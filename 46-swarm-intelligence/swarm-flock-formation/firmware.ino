/*
 * Swarm Flock Formation - ESP32 Firmware
 * Boids-based flocking algorithm over ESP-NOW mesh
 * Separation, alignment, cohesion rules for swarm formation
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_BOIDS 12
#define SEPARATION_DIST 30.0
#define ALIGNMENT_WEIGHT 0.05
#define COHESION_WEIGHT 0.01
#define SEPARATION_WEIGHT 0.1
#define MAX_SPEED 5.0

typedef struct {
  uint8_t type;       // 0=state, 1=formation_cmd
  uint8_t boid_id;
  uint32_t seq;
  float px, py;
  float vx, vy;
  int8_t rssi;
} boid_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float px, py, vx, vy;
  int8_t rssi;
  float distance;
  int64_t last_seen;
  bool active;
} flock_member_t;

flock_member_t flock[MAX_BOIDS];
float my_px, my_py, my_vx, my_vy;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

float estimateDistance(int8_t rssi) {
  float txPower = -30.0;
  return pow(10.0, (txPower - rssi) / 20.0);
}

void applyBoidRules() {
  float sep_x = 0, sep_y = 0;
  float ali_x = 0, ali_y = 0;
  float coh_x = 0, coh_y = 0;
  int count = 0;

  for (int i = 0; i < MAX_BOIDS; i++) {
    if (!flock[i].active) continue;
    float dx = flock[i].px - my_px;
    float dy = flock[i].py - my_py;
    float dist = sqrt(dx*dx + dy*dy);
    flock[i].distance = dist;
    count++;

    // Separation
    if (dist < SEPARATION_DIST && dist > 0.01) {
      sep_x -= dx / dist;
      sep_y -= dy / dist;
    }
    // Alignment
    ali_x += flock[i].vx;
    ali_y += flock[i].vy;
    // Cohesion
    coh_x += flock[i].px;
    coh_y += flock[i].py;
  }

  if (count > 0) {
    ali_x /= count;
    ali_y /= count;
    coh_x = coh_x / count - my_px;
    coh_y = coh_y / count - my_py;

    my_vx += sep_x * SEPARATION_WEIGHT + (ali_x - my_vx) * ALIGNMENT_WEIGHT + coh_x * COHESION_WEIGHT;
    my_vy += sep_y * SEPARATION_WEIGHT + (ali_y - my_vy) * ALIGNMENT_WEIGHT + coh_y * COHESION_WEIGHT;

    float speed = sqrt(my_vx*my_vx + my_vy*my_vy);
    if (speed > MAX_SPEED) {
      my_vx = my_vx / speed * MAX_SPEED;
      my_vy = my_vy / speed * MAX_SPEED;
    }
  }

  my_px += my_vx;
  my_py += my_vy;
  if (my_px < -100) my_px = 100;
  if (my_px > 100) my_px = -100;
  if (my_py < -100) my_py = 100;
  if (my_py > 100) my_py = -100;
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(boid_packet_t)) return;
  boid_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = -1;
  for (int i = 0; i < MAX_BOIDS; i++)
    if (flock[i].active && flock[i].id == pkt.boid_id) { idx = i; break; }
  if (idx < 0) {
    for (int i = 0; i < MAX_BOIDS; i++) {
      if (!flock[i].active) {
        memcpy(flock[i].mac, mac, 6);
        flock[i].id = pkt.boid_id;
        flock[i].active = true;
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

  flock[idx].px = pkt.px;
  flock[idx].py = pkt.py;
  flock[idx].vx = pkt.vx;
  flock[idx].vy = pkt.vy;
  flock[idx].rssi = pkt.rssi;
  flock[idx].last_seen = esp_timer_get_time();
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void broadcastState() {
  boid_packet_t pkt;
  pkt.type = 0;
  pkt.boid_id = my_id;
  pkt.seq = seq++;
  pkt.px = my_px;
  pkt.py = my_py;
  pkt.vx = my_vx;
  pkt.vy = my_vy;
  pkt.rssi = 0;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(flock, 0, sizeof(flock));

  my_px = (float)(esp_random() % 200) - 100;
  my_py = (float)(esp_random() % 200) - 100;
  my_vx = (float)(esp_random() % 10 - 5) / 5.0;
  my_vy = (float)(esp_random() % 10 - 5) / 5.0;

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

  Serial.printf("[FLOCK] Boid %02X at (%.1f, %.1f)\n", my_id, my_px, my_py);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 100) return;
  last = millis();

  applyBoidRules();
  broadcastState();

  static int report = 0;
  if (++report >= 10) {
    report = 0;
    int n = 0;
    for (int i = 0; i < MAX_BOIDS; i++) if (flock[i].active) n++;
    Serial.printf("{\"boid\":\"%02X\",\"px\":%.2f,\"py\":%.2f,\"vx\":%.2f,\"vy\":%.2f,\"flock\":%d}\n",
      my_id, my_px, my_py, my_vx, my_vy, n);
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
