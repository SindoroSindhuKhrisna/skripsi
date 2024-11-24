#include <ESPAsyncWebSrv.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <AsyncTCP.h>
#include <Arduino.h>
#include <WiFi.h>
#include <LoRa.h>
#include <SPI.h>
// ##########################################################
// #                    FUNCTION HEADERS                    #
// ##########################################################
void webserverLog(int statusCode, String errorMessage, AsyncWebServerRequest *request = nullptr);

String clientSideHttpRequestHandler(String jsonBody, AsyncWebServerRequest *request);

// ##########################################################
// #                         CONFIGS                        #
// ##########################################################
// SYSTEM
// #define SYSTEM_OPERATION_MODE_SERVERSIDE //COMMENT for CLIENTSIDE

// WIFI
const char* WiFi_SSID = "REDACTED";
const char* WiFi_PASSWORD = "REDACTED";

// LoRa
long LoRa_FREQUENCY           = 433E6;
const int LoRa_PIN_SS         = 5;
const int LoRa_PIN_RESET      = 12;
const int LoRa_PIN_IRQ        = 2;
const int LoRa_MAX_CHUNK_SIZE = 200;
byte LoRa_SERVER_ADDR         = 0xBB;
byte LoRa_CLIENT_ADDR         = 0xFF;

// Web Server
const int SERVER_HTTP_PORT = 80; 
const String SERVER_TARGET_HOST = "REDACTED";

AsyncWebServer server(SERVER_HTTP_PORT);
void notFound(AsyncWebServerRequest *request) {
    webserverLog(404, "Not found", request);
}
void handleCors(AsyncWebServerRequest *request){ 
    request->send(200);
}


// ##########################################################
// #                    SYSTEM VARIABLES                    #
// ##########################################################
bool SYSTEM_IS_BUSY = false;


// LoRa
struct MessageTracker {
    byte messageId;
    byte totalChunks;
    byte receivedChunks;
    String* chunks;
    
    MessageTracker() : messageId(0), totalChunks(0), receivedChunks(0), chunks(nullptr) {}
    
    void init(byte msgId, byte total) {
        messageId = msgId;
        totalChunks = total;
        receivedChunks = 0;
        chunks = new String[total];
    }
    
    void clear() {
        if (chunks != nullptr) {
            delete[] chunks;
            chunks = nullptr;
        }
        messageId = 0;
        totalChunks = 0;
        receivedChunks = 0;
    }
};
MessageTracker currentMessage;

// ##########################################################

void setup() {
    // Serial
    Serial.begin(115200);
    Serial.println("##########################################################");
    Serial.println("#        Timsalut-Lite Communication Device | V1.0       #");
    Serial.println("##########################################################");
    Serial.print("SYSTEM    : Booting to ");
    #ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
        Serial.println("server side mode");
    #else
        Serial.println("client side mode");
    #endif

    // WiFi (client mode in serverside mode, AP mode in clientside mode)
    #ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
        Serial.println("SYSTEM    : Configuring WiFi in client mode...");
        WiFi.mode(WIFI_STA);
        WiFi.begin(WiFi_SSID, WiFi_PASSWORD);
        if (WiFi.waitForConnectResult() != WL_CONNECTED) {
            Serial.println("SYSTEM    : Failed connecting to WiFi. System is halted!");
            while (true);
        }
        Serial.println("SYSTEM    : WiFi successfully connected");
        Serial.print("SYSTEM    : IP Address: ");
        Serial.println(WiFi.localIP());
    #else
        Serial.println("SYSTEM    : Configuring WiFi in AP mode...");
        WiFi.mode(WIFI_AP);
        WiFi.softAP(WiFi_SSID, WiFi_PASSWORD);
        Serial.println("SYSTEM    : WiFi AP mode activated");
        Serial.print("SYSTEM    : IP Address: ");
        Serial.println(WiFi.softAPIP());
    #endif

    // LoRa
    Serial.println("SYSTEM    : Configuring LoRa module...");
    LoRa.setPins(LoRa_PIN_SS, LoRa_PIN_RESET, LoRa_PIN_IRQ);
    if (!LoRa.begin(LoRa_FREQUENCY)) {
        Serial.println("SYSTEM    : Failed to initialize LoRa. System is halted!");
        while (true);
    }
    Serial.println("SYSTEM    : LoRa init succeeded.");

    // Web Server (Client Side Only)
    #ifndef SYSTEM_OPERATION_MODE_SERVERSIDE
        Serial.print("SYSTEM    : Configuring Web Server on port ");
        Serial.println(SERVER_HTTP_PORT);
        server.on("/API", HTTP_POST, [](AsyncWebServerRequest *request){}, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
            Serial.println("WEBSERVER : New Request...");
            if(SYSTEM_IS_BUSY) {
                webserverLog(425, "Too Early, System is Busy", request);
                return;
            }
            if(!index){
                SYSTEM_IS_BUSY = true;
                String LoRaResponse = clientSideHttpRequestHandler(String((const char*)data), request);
                request->send(200, "application/json", LoRaResponse);
            }
        });
        server.on("/API", HTTP_OPTIONS, handleCors);
        server.onNotFound(notFound);
        DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
        DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
        DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
        server.begin();
    #endif

    Serial.println("SYSTEM    : System boot completed. Waiting for request!");
}

void loop() {
  // put your main code here, to run repeatedly:
  #ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
    onReceive(LoRa.parsePacket());
  #endif
  yield();
}

// ##########################################################
// #                     LoRa FUNCTIONS                     #
// ##########################################################

void LoRaSendMessage(String message) {
    int messageLength = message.length();
    int numChunks = (messageLength + LoRa_MAX_CHUNK_SIZE - 1) / LoRa_MAX_CHUNK_SIZE;
    
    for (int i = 0; i < numChunks; i++) {
        int chunkStart = i * LoRa_MAX_CHUNK_SIZE;
        int chunkEnd = min((i + 1) * LoRa_MAX_CHUNK_SIZE, messageLength);
        String chunk = message.substring(chunkStart, chunkEnd);
        random(1, 251);
        LoRaChunksSender(chunk, 1, i, numChunks);
        delay(100); // Small delay between chunks to prevent packet collision
    }
}

void LoRaChunksSender(String chunk, byte messageId, byte chunkIndex, byte totalChunks) {
    LoRa.beginPacket();
    #ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
        LoRa.write(LoRa_CLIENT_ADDR);      // destination address
        LoRa.write(LoRa_SERVER_ADDR);      // sender address
    #else
        LoRa.write(LoRa_SERVER_ADDR);      // destination address
        LoRa.write(LoRa_CLIENT_ADDR);      // sender address
    #endif
    LoRa.write(messageId);               // apiSelect
    LoRa.write(totalChunks);             // total number of chunks
    LoRa.write(chunkIndex);              // chunk index
    LoRa.write(chunk.length());          // chunk length
    LoRa.print(chunk);                   // chunk data
    LoRa.endPacket();
}

void onReceive(int packetSize) {
    if (packetSize == 0) return;
    Serial.println("LoRa      : Incoming Packet...");
    // read packet header bytes:
    int recipient = LoRa.read();          // recipient address
    byte sender = LoRa.read();            // sender address
    byte incomingMsgId = LoRa.read();     // incoming msg ID
    byte totalChunks = LoRa.read();       // total chunks
    byte chunkIndex = LoRa.read();        // chunk index
    byte chunkLength = LoRa.read();       // chunk length

    String chunk = "";
    while (LoRa.available()) {
        chunk += (char)LoRa.read();
    }

    if (chunkLength != chunk.length()) {
        Serial.println("LoRa      : New Packet received, but chunk length does not match length");
        return;
    }

    // if the recipient isn't this device or broadcast,
    #ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
        if (recipient != LoRa_SERVER_ADDR && LoRa_CLIENT_ADDR != 0xFF) {
            Serial.println("LoRa      : New Packet received, but this packet is not for me.");
            return;
        }
    #else
        if (recipient != LoRa_CLIENT_ADDR && LoRa_SERVER_ADDR != 0xFF) {
            Serial.println("LoRa      : New Packet received, but this packet is not for me.");
            return;
        }
    #endif
    

    // Initialize message tracker if this is the first chunk of a new message
    if (chunkIndex == 0) {
        currentMessage.clear();
        currentMessage.init(incomingMsgId, totalChunks);
    }

    // Store the chunk
    if (currentMessage.messageId == incomingMsgId && chunkIndex < totalChunks) {
        currentMessage.chunks[chunkIndex] = chunk;
        currentMessage.receivedChunks++;

        // Print chunk information
        Serial.println("LoRa      : Received chunk " + String(chunkIndex + 1) + "/" + String(totalChunks));
        Serial.println("LoRa      : From: 0x" + String(sender, HEX));
        Serial.println("LoRa      : RSSI: " + String(LoRa.packetRssi()));
        Serial.println("LoRa      : Snr: " + String(LoRa.packetSnr()));

        // If all chunks received, reassemble and process the message
        if (currentMessage.receivedChunks == currentMessage.totalChunks) {
            String completeMessage = "";
            for (int i = 0; i < totalChunks; i++) {
                completeMessage += currentMessage.chunks[i];
            }

            // Process the complete message
            Serial.println("\nLoRa      : Complete message received:");
            Serial.println("LoRa      : From: 0x" + String(sender, HEX));
            Serial.println("LoRa      : Message ID: " + String(incomingMsgId));
            Serial.println("LoRa      : Message: " + completeMessage);
            Serial.println();

            // Clear the message tracker
            currentMessage.clear();
            #ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
                restAPItoServer(completeMessage);
            #endif
        } 
    }
}

String clientSideLoRaAwaitResponse() {
    Serial.println("SYSTEM    : System is flagged busy");
    Serial.println("LoRa      : Awaiting response from server side...");
    while (SYSTEM_IS_BUSY) {
        int packetSize = LoRa.parsePacket();
        if (packetSize) {
            if (packetSize == 0) return "";
            Serial.println("LoRa      : Incoming Packet...");
            // read packet header bytes:
            int recipient = LoRa.read();          // recipient address
            byte sender = LoRa.read();            // sender address
            byte incomingMsgId = LoRa.read();     // incoming msg ID
            byte totalChunks = LoRa.read();       // total chunks
            byte chunkIndex = LoRa.read();        // chunk index
            byte chunkLength = LoRa.read();       // chunk length

            String chunk = "";
            while (LoRa.available()) {
                chunk += (char)LoRa.read();
            }

            if (chunkLength != chunk.length()) {
                Serial.println("LoRa      : New Packet received, but chunk length does not match length");
                return "{\"error\":\"New Packet received, but chunk length does not match length\"}";
            }

            // if the recipient isn't this device or broadcast,
            #ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
                if (recipient != LoRa_SERVER_ADDR && LoRa_CLIENT_ADDR != 0xFF) {
                    Serial.println("LoRa      : New Packet received, but this packet is not for me.");
                    return "{\"error\":\"New Packet received, but this packet is not for me\"}";
                }
            #else
                if (recipient != LoRa_CLIENT_ADDR && LoRa_SERVER_ADDR != 0xFF) {
                    Serial.println("LoRa      : New Packet received, but this packet is not for me.");
                    return "{\"error\":\"New Packet received, but this packet is not for me\"}";
                }
            #endif
            

            // Initialize message tracker if this is the first chunk of a new message
            if (chunkIndex == 0) {
                currentMessage.clear();
                currentMessage.init(incomingMsgId, totalChunks);
            }

            // Store the chunk
            if (currentMessage.messageId == incomingMsgId && chunkIndex < totalChunks) {
                currentMessage.chunks[chunkIndex] = chunk;
                currentMessage.receivedChunks++;

                // Print chunk information
                Serial.println("LoRa      : Received chunk " + String(chunkIndex + 1) + "/" + String(totalChunks));
                Serial.println("LoRa      : From: 0x" + String(sender, HEX));
                Serial.println("LoRa      : RSSI: " + String(LoRa.packetRssi()));
                Serial.println("LoRa      : Snr: " + String(LoRa.packetSnr()));

                // If all chunks received, reassemble and process the message
                if (currentMessage.receivedChunks == currentMessage.totalChunks) {
                    String completeMessage = "";
                    for (int i = 0; i < totalChunks; i++) {
                        completeMessage += currentMessage.chunks[i];
                    }

                    // Process the complete message
                    Serial.println("\nLoRa      : Complete message received:");
                    Serial.println("LoRa      : From: 0x" + String(sender, HEX));
                    Serial.println("LoRa      : Message ID: " + String(incomingMsgId));
                    Serial.println("LoRa      : Message: " + completeMessage);
                    Serial.println();

                    // Clear the message tracker
                    currentMessage.clear();
                    SYSTEM_IS_BUSY = false;
                    return completeMessage;
                }
            }
        }
    }
    Serial.println("SYSTEM    : System busy flag is retracted");
} 

// ##########################################################
// #                  SERVER SIDE FUNCTIONS                 #
// ##########################################################
#ifdef SYSTEM_OPERATION_MODE_SERVERSIDE
    void restAPItoServer(String LoRaMessage) {

        // ##########################################
        // #           HANDLE JSON Message          #
        // ##########################################
        JsonDocument incomingJsonDoc;
        DeserializationError error = deserializeJson(incomingJsonDoc, LoRaMessage);

        if (error) {
            webserverLog(422, "Unprocessable Content, Invalid JSON");
            return;
        }

        if (!incomingJsonDoc.containsKey("apiSelect") || !incomingJsonDoc.containsKey("body")) {
            webserverLog(400, "Bad Request, Missing required fields");
            return;
        }

        const char* apiSelect = incomingJsonDoc["apiSelect"].as<const char*>();
        JsonVariant requestBody = incomingJsonDoc["body"];

        if (apiSelect == nullptr) {
            webserverLog(400, "Bad Request, Invalid apiSelect value");
            return;
        }

        // ##########################################
        // #        HANDLE REQUEST TO TARGET        #
        // ##########################################
        HTTPClient http;
        
        String targetURL = SERVER_TARGET_HOST;
        targetURL += apiSelect;
        http.begin(targetURL);
        http.addHeader("Content-Type", "application/json");
        String jsonPayload = requestBody;

        int httpResponseCode = http.POST(jsonPayload);

        if (httpResponseCode > 0) {
            String response = http.getString();
            // request->send(200, "application/json", response);
            // webserverLog(200, "", request);
            LoRaSendMessage(response);
            // return response;
        } else {
            Serial.print("Error on HTTP request: ");
            Serial.println(httpResponseCode);
            // webserverLog(500, "Server Side Error, Request to Bapenda has failed", request);
            LoRaSendMessage("{\"error\":\"Error on HTTP request: " + String(httpResponseCode) + " - " + "\"}");
            // return "{\"error\":\"Error on HTTP request: " + String(httpResponseCode) + " - " + "\"}" + ;
        }

        http.end();
    }
#endif

// ##########################################################
// #                  CLIENT SIDE FUNCTIONS                 #
// ##########################################################
#ifndef SYSTEM_OPERATION_MODE_SERVERSIDE
    String clientSideHttpRequestHandler(String jsonBody, AsyncWebServerRequest *request) {
        Serial.println("WEBSERVER : Processing JSON...");
        JsonDocument incomingJsonDoc;
        DeserializationError error = deserializeJson(incomingJsonDoc, jsonBody);

        if (error) {
            webserverLog(422, "Unprocessable Content, Invalid JSON", request);
            SYSTEM_IS_BUSY = false;
            return "{\"error\":\"Unprocessable Content, Invalid JSON\"";
        }

        if (!incomingJsonDoc.containsKey("apiSelect") || !incomingJsonDoc.containsKey("body")) {
            webserverLog(400, "Bad Request, Missing required fields", request);
            SYSTEM_IS_BUSY = false;
            return "{\"error\":\"Bad Request, Missing required fields\"}";
        }

        const char* apiSelect = incomingJsonDoc["apiSelect"].as<const char*>();
        JsonVariant requestBody = incomingJsonDoc["body"];

        if (apiSelect == nullptr) {
            webserverLog(400, "Bad Request, Invalid apiSelect value", request);
            SYSTEM_IS_BUSY = false;
            return "{\"error\":\"Bad Request, Invalid apiSelect value\"}";
        }

        Serial.print("WEBSERVER : apiSelect: ");
        Serial.println(apiSelect);
        Serial.print("WEBSERVER : body: ");
        serializeJson(requestBody, Serial);
        Serial.println();
        // Forward Request via LoRa
        LoRaSendMessage(jsonBody);
        // Flag Sytem Busy
        SYSTEM_IS_BUSY = true;
        // Await Response from LoRa
        String LoRaResponse = clientSideLoRaAwaitResponse();

        if(LoRaResponse == ""){
            SYSTEM_IS_BUSY = false;
            return "{\"error\":\"No response from server side\"}";
        }
        return LoRaResponse;
    }
#endif


// ##########################################################
// #                     OTHER FUNCTIONS                    #
// ##########################################################
String HttpMethodDict(int number) { 
  switch (number) { 
    case 1: return "GET"; 
    case 2: return "POST"; 
    case 3: return "DELETE"; 
    case 4: return "PUT"; 
    case 5: return "PATCH"; 
    case 6: return "HEAD"; 
    case 7: return "OPTIONS"; 
    default: return "UNKNOWN";
  }
}

void webserverLog(int statusCode, String errorMessage, AsyncWebServerRequest *request){
  if (statusCode == 200){
    Serial.print("WEBSERVER : ");
    // if request is not nullptr:
    if(request != nullptr){
        Serial.print(request->client()->remoteIP());
        Serial.print(" - \"");
        String requestMethod = HttpMethodDict(request->method());
        Serial.print(requestMethod);
        Serial.print(" ");
        Serial.print(request->url());
        Serial.print("\" ");
    } else {
        Serial.print("Unknown - \"");
        Serial.print("Unknown Unknown");
        Serial.print("\" ");
    }
    Serial.print("\" ");
    Serial.print("200");
    Serial.print(" - ");
    Serial.println("OK");
    return;
  }
  if(request == nullptr){
    Serial.print("WEBSERVER : ");
    Serial.print("Unknown");
    Serial.print(" - \"");
    Serial.print("Unknown");
    Serial.print("\" ");
    Serial.print(statusCode);
    Serial.print(" - ");
    Serial.println(errorMessage);
    return;
  }
  Serial.print("WEBSERVER : ");
  Serial.print(request->client()->remoteIP());
  Serial.print(" - \"");
  String requestMethod = HttpMethodDict(request->method());
  Serial.print(requestMethod);
  Serial.print(" ");
  Serial.print(request->url());
  Serial.print("\" ");
  Serial.print(statusCode);
  Serial.print(" - ");
  Serial.println(errorMessage);
  request->send(statusCode, "application/json", "{\"error\":\"" + errorMessage + "\"}");
  return;
}