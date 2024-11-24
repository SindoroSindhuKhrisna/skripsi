#include <SPI.h>
#include <LoRa.h>

#define LoRa_FREQUENCY 392E6
#define LoRa_PIN_ss 5
#define LoRa_PIN_rst 12
#define LoRa_PIN_dio0 2

int counter = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial);

  Serial.println("LoRa Sender");

  LoRa.setPins(LoRa_PIN_ss, LoRa_PIN_rst, LoRa_PIN_dio0);
  if (!LoRa.begin(LoRa_FREQUENCY)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  LoRa.setTxPower(22, PA_OUTPUT_PA_BOOST_PIN);
  LoRa.setSpreadingFactor(12);
}

void loop() {
  Serial.print("Sending packet: ");
  Serial.println(counter);

  // send packet
  LoRa.beginPacket();
  LoRa.print("hello ");
  LoRa.print(counter);
  LoRa.endPacket();

  counter++;

  delay(300);
}
