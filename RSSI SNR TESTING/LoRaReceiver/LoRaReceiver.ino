#include <SPI.h>
#include <LoRa.h>

#define LoRa_FREQUENCY 392E6
#define LoRa_PIN_ss 5
#define LoRa_PIN_rst 12
#define LoRa_PIN_dio0 2

void setup() {
  Serial.begin(115200);
  while (!Serial);

  Serial.println("LoRa Receiver");

  LoRa.setPins(LoRa_PIN_ss, LoRa_PIN_rst, LoRa_PIN_dio0);
  if (!LoRa.begin(LoRa_FREQUENCY)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  LoRa.setSpreadingFactor(12);
}

void loop() {
  // try to parse packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // received a packet
    Serial.print("Received packet '");

    // read packet
    while (LoRa.available()) {
      Serial.print((char)LoRa.read());
    }

    // print RSSI of packet
    Serial.print("' with RSSI ");
    Serial.println(LoRa.packetRssi());
    Serial.print("' with SNR ");
    Serial.println(LoRa.packetSnr());
  }
}
