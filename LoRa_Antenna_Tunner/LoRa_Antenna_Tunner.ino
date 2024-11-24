#include <SPI.h>
#include <LoRa.h>

#define SERVER_MODE
// #define CLIENT_MODE

// LoRa Configs
#define ss 5
#define rst 12
#define dio0 2

// Frequency testing parameters
#define START_FREQ 380E6
#define END_FREQ 525E6
#define FREQ_STEP 1E6  // 5MHz steps
#define TRIES_PER_FREQ 10
#define MEASUREMENT_DELAY 100  // ms between measurements

void setup() {
  LoRa.setPins(ss, rst, dio0);
  while (!LoRa.begin(START_FREQ)) {
    Serial.println(".");
    delay(1000);
  }
  LoRa.setSpreadingFactor(12);
  LoRa.setTxPower(22, PA_OUTPUT_PA_BOOST_PIN);
  LoRa.enableCrc();
  LoRa.setSyncWord(0xA5);
  Serial.begin(115200);
  while (!Serial);
  #ifdef SERVER_MODE
    Serial.println("LoRa Server");
    Serial.print("CHANGING TO FREQ ");
    Serial.print(START_FREQ / 1E6);
    Serial.println(" MHz");
  #else
    Serial.println("LoRa Client");
  #endif
}

void loop() {
  #ifdef SERVER_MODE
    static int counter = 0;
    static int packetsAtFreq = 0;
    static float currentFreq = START_FREQ;
    
    // Check if we need to change frequency
    if (packetsAtFreq >= TRIES_PER_FREQ) {
      currentFreq += FREQ_STEP;
      if (currentFreq > END_FREQ) {
        currentFreq = START_FREQ;
      }
      
      // Set new frequency
      LoRa.sleep();
      LoRa.setFrequency(currentFreq);
      LoRa.idle();
      
      // Announce frequency change
      Serial.print("CHANGING TO FREQ ");
      Serial.print(currentFreq / 1E6);
      Serial.println(" MHz");
      
      packetsAtFreq = 0;
    }
    
    LoRa.beginPacket();
    LoRa.print(counter);
    LoRa.endPacket();
    Serial.println(counter);
    counter++;
    packetsAtFreq++;
    delay(MEASUREMENT_DELAY);
  #else
    static float currentFreq = START_FREQ;
    static int measurementCount = 0;
    static float rssiSum = 0;
    static float snrSum = 0;
    
    // Check if we need to change frequency
    if (measurementCount >= TRIES_PER_FREQ) {
      // Calculate and print averages
      float avgRssi = rssiSum / TRIES_PER_FREQ;
      float avgSnr = snrSum / TRIES_PER_FREQ;
      
      Serial.println("\n##################");
      Serial.print("Freq: "); Serial.print(currentFreq / 1E6); Serial.println(" MHz");
      Serial.print("AVG RSSI: "); Serial.println(avgRssi);
      Serial.print("AVG SNR: "); Serial.println(avgSnr);
      Serial.println("##################\n");
      
      // Reset counters and sums
      measurementCount = 0;
      rssiSum = 0;
      snrSum = 0;
      
      // Move to next frequency
      currentFreq += FREQ_STEP;
      if (currentFreq > END_FREQ) {
        currentFreq = START_FREQ;
      }
      
      // Set new frequency
      LoRa.sleep();
      LoRa.setFrequency(currentFreq);
      LoRa.idle();
    }
    
    int packetSize = LoRa.parsePacket();
    if (packetSize) {
      String LoRaData = "";
      while (LoRa.available()) {
        LoRaData = LoRa.readString();
      }
      
      float rssi = LoRa.packetRssi();
      float snr = LoRa.packetSnr();
      
      // Add to sums for averaging
      rssiSum += rssi;
      snrSum += snr;
      measurementCount++;
      
      // Print current measurement
      Serial.print("Received packet '");
      Serial.print(LoRaData);
      Serial.print("' with RSSI ");
      Serial.print(rssi);
      Serial.print(", with SNR ");
      Serial.print(snr);
      Serial.print(", with Freq ");
      Serial.print(currentFreq / 1E6);
      Serial.println(" MHz");
    }
    // delay(MEASUREMENT_DELAY);
  #endif
}