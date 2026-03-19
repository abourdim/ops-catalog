/*
 * Chrono Relativistic Calculator - ESP32 Firmware
 * Measures time dilation effects using synchronized ESP-NOW clocks
 * Computes relativistic corrections for velocity and gravitational potential
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_CLOCKS 6
#define C_MS 299792458.0
#define G_CONST 6.674e-11
#define M_EARTH 5.972e24
#define R_EARTH 6.371e6

typedef struct {
  uint8_t type;       // 0=time_sync, 1=position, 2=velocity
  uint8_t clock_id;
  uint32_t seq;
  int64_t local_us;
  double altitude_m;
  double velocity_ms;
  double lat;
  double lon;
} relativ_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  int64_t offset_us;
  int64_t last_sync;
  double altitude_m;
  double velocity_ms;
  double time_dilation;
  double grav_dilation;
  uint32_t syncs;
  bool active;
} rel_clock_t;

rel_clock_t clocks[MAX_CLOCKS];
uint8_t my_id;
double my_altitude = 0.0;
double my_velocity = 0.0;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

double calcGravitationalDilation(double alt) {
  double r = R_EARTH + alt;
  double phi = -G_CONST * M_EARTH / r;
  double phi0 = -G_CONST * M_EARTH / R_EARTH;
  return 1.0 + (phi - phi0) / (C_MS * C_MS);
}

double calcVelocityDilation(double v) {
  double beta = v / C_MS;
  return sqrt(1.0 - beta * beta);
}

double calcTotalDilation(double alt, double v) {
  return calcGravitationalDilation(alt) * calcVelocityDilation(v);
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(relativ_packet_t)) return;
  relativ_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  int idx = -1;
  for (int i = 0; i < MAX_CLOCKS; i++) {
    if (clocks[i].active && clocks[i].id == pkt.clock_id) { idx = i; break; }
  }
  if (idx < 0) {
    for (int i = 0; i < MAX_CLOCKS; i++) {
      if (!clocks[i].active) {
        memcpy(clocks[i].mac, mac, 6);
        clocks[i].id = pkt.clock_id;
        clocks[i].active = true;
        clocks[i].syncs = 0;
        esp_now_peer_info_t pi = {};
        memcpy(pi.peer_addr, mac, 6);
        pi.channel = 1;
        esp_now_add_peer(&pi);
        idx = i;
        break;
      }
    }
  }
  if (idx < 0) return;

  if (pkt.type == 0) {
    clocks[idx].offset_us = pkt.local_us - now;
    clocks[idx].last_sync = now;
    clocks[idx].syncs++;
  }
  clocks[idx].altitude_m = pkt.altitude_m;
  clocks[idx].velocity_ms = pkt.velocity_ms;
  clocks[idx].grav_dilation = calcGravitationalDilation(pkt.altitude_m);
  clocks[idx].time_dilation = calcTotalDilation(pkt.altitude_m, pkt.velocity_ms);
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void broadcastState() {
  relativ_packet_t pkt;
  pkt.type = 0;
  pkt.clock_id = my_id;
  pkt.seq = seq++;
  pkt.local_us = esp_timer_get_time();
  pkt.altitude_m = my_altitude;
  pkt.velocity_ms = my_velocity;
  pkt.lat = 0;
  pkt.lon = 0;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(clocks, 0, sizeof(clocks));

  WiFi.mode(WIFI_STA);
  uint8_t mac[6];
  esp_wifi_get_mac(WIFI_IF_STA, mac);
  my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);

  esp_now_init();
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);

  esp_now_peer_info_t pi = {};
  memcpy(pi.peer_addr, bcast, 6);
  pi.channel = 1;
  esp_now_add_peer(&pi);

  Serial.printf("[RELATIV] Clock %02X online. c=%.0f m/s\n", my_id, C_MS);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 500) return;
  last = millis();

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    if (cmd.startsWith("ALT:")) my_altitude = cmd.substring(4).toDouble();
    if (cmd.startsWith("VEL:")) my_velocity = cmd.substring(4).toDouble();
  }

  broadcastState();

  double my_grav = calcGravitationalDilation(my_altitude);
  double my_total = calcTotalDilation(my_altitude, my_velocity);

  Serial.printf("{\"id\":\"%02X\",\"t_us\":%lld,\"alt\":%.1f,\"vel\":%.2f,\"grav_d\":%.15f,\"total_d\":%.15f,\"clocks\":[",
    my_id, esp_timer_get_time(), my_altitude, my_velocity, my_grav, my_total);
  bool first = true;
  for (int i = 0; i < MAX_CLOCKS; i++) {
    if (!clocks[i].active) continue;
    if (!first) Serial.print(",");
    double diff_ns_per_s = (clocks[i].time_dilation - my_total) * 1e9;
    Serial.printf("{\"id\":\"%02X\",\"off_us\":%lld,\"alt\":%.1f,\"vel\":%.2f,\"dilation\":%.15f,\"drift_ns_s\":%.6f}",
      clocks[i].id, clocks[i].offset_us, clocks[i].altitude_m,
      clocks[i].velocity_ms, clocks[i].time_dilation, diff_ns_per_s);
    first = false;
  }
  Serial.println("]}");
  digitalWrite(LED_PIN, !digitalRead(LED_PIN));
}
