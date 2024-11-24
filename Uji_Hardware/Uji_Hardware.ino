// ################################
// # Pengujian Hardware Rancangan #
// # Sindhu Khrisna © 2024        #
// ################################

#include <WiFi.h>
#include <LoRa.h>
#include <SPI.h>

// Konfigurasi
// LoRa
const int LoRa_PIN_SS         = 5;
const int LoRa_PIN_RESET      = 12;
const int LoRa_PIN_IRQ        = 2;
// WiFi
const char* WiFi_SSID = "mushang98";
const char* WiFi_PASSWORD = "xmaX351080";

void setup() {
  // Inisialisasi Serial
  Serial.begin(115200);
  while(!Serial);
  Serial.println("Memulai Pengujian...");
  
  // Uji Koneksi ke Modul LoRa
  Serial.println("Menguji Koneksi ke Modul Lora...");
    LoRa.setPins(LoRa_PIN_SS, LoRa_PIN_RESET, LoRa_PIN_IRQ);
    if (!LoRa.begin(433E6)) {
        Serial.println("Gagal Terhubung ke Modul Lora");
        while (true);
    }
    Serial.println("Berhasil Terhubung ke Modul Lora");

  // Uji WiFI
  Serial.println("Menguji Kapabilitas WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WiFi_SSID, WiFi_PASSWORD);
  unsigned long WiFiTimeout = millis() + 10000;
  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
          Serial.println("Pengujian WiFi Gagal");
          while(true);
        }
  Serial.println("Pengujian WiFi Berhasil");
}

void loop() {
  yield();
}
