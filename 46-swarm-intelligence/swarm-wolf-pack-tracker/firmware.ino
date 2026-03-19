/*
 * Swarm Wolf Pack Tracker - ESP32 Firmware
 * Wolf pack hunting strategy: alpha leads, pack follows RSSI trail
 * Role-based swarm with alpha/beta/omega hierarchy via ESP-NOW
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_WOLVES 10
#define ROLE_ALPHA 0
#define ROLE_BETA 1
#define ROLE_OMEGA 2

typedef struct {
  uint8_t type;       // 0=position, 1=prey_signal, 2=hunt_cmd
  uint8_t wolf_id;
  uint8_t role;
  uint32_t seq;
  float px, py;
  float target_x, target_y;
  float fitness;
  int8_t rssi;
} wolf_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  uint8_t role;
  float px, py;
  float fitness;
  int8_t rssi;
  bool active;
} wolf_t;

wolf_t pack[MAX_WOLVES];
float my_px, my_py;
float prey_x = 50, prey_y = 50;
uint8_t my_role = ROLE_OMEGA;
float my_fitness = 0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

float distToPrey() {
  float dx = my_px - prey_x, dy = my_py - prey_y;
  return sqrt(dx*dx + dy*dy);
}

void updateRoles() {
  // Rank by fitness (distance to prey, lower = better)
  my_fitness = 1.0 / (distToPrey() + 1.0);
  float best = my_fitness, second = 0;
  uint8_t best_id = my_id;

  for (int i = 0; i < MAX_WOLVES; i++) {
    if (!pack[i].active) continue;
    if (pack[i].fitness > best) {
      second = best; best = pack[i].fitness; best_id = pack[i].id;
    } else if (pack[i].fitness > second) {
      second = pack[i].fitness;
    }
  }

  if (best_id == my_id) my_role = ROLE_ALPHA;
  else if (my_fitness >= second) my_role = ROLE_BETA;
  else my_role = ROLE_OMEGA;
}

void gwoStep() {
  // Grey Wolf Optimizer step
  float alpha_x = my_px, alpha_y = my_py;
  float beta_x = my_px, beta_y = my_py;
  float delta_x = my_px, delta_y = my_py;
  float af = 0, bf = 0, df = 0;

  for (int i = 0; i < MAX_WOLVES; i++) {
    if (!pack[i].active) continue;
    if (pack[i].fitness > af) {
      df = bf; delta_x = beta_x; delta_y = beta_y;
      bf = af; beta_x = alpha_x; beta_y = alpha_y;
      af = pack[i].fitness; alpha_x = pack[i].px; alpha_y = pack[i].py;
    } else if (pack[i].fitness > bf) {
      df = bf; delta_x = beta_x; delta_y = beta_y;
      bf = pack[i].fitness; beta_x = pack[i].px; beta_y = pack[i].py;
    } else if (pack[i].fitness > df) {
      df = pack[i].fitness; delta_x = pack[i].px; delta_y = pack[i].py;
    }
  }

  float a = 2.0 - generation() * 0.01;  // Linearly decrease
  float r1 = (float)(esp_random() % 1000) / 1000.0;
  float r2 = (float)(esp_random() % 1000) / 1000.0;
  float A1 = 2 * a * r1 - a;
  float C1 = 2 * r2;

  float x1 = alpha_x - A1 * fabs(C1 * alpha_x - my_px);
  float y1 = alpha_y - A1 * fabs(C1 * alpha_y - my_py);
  float x2 = beta_x - A1 * fabs(C1 * beta_x - my_px);
  float y2 = beta_y - A1 * fabs(C1 * beta_y - my_py);
  float x3 = delta_x - A1 * fabs(C1 * delta_x - my_px);
  float y3 = delta_y - A1 * fabs(C1 * delta_y - my_py);

  my_px = (x1 + x2 + x3) / 3.0;
  my_py = (y1 + y2 + y3) / 3.0;
}

uint32_t generation() { return seq / 2; }

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(wolf_packet_t)) return;
  wolf_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = -1;
  for (int i = 0; i < MAX_WOLVES; i++)
    if (pack[i].active && pack[i].id == pkt.wolf_id) { idx = i; break; }
  if (idx < 0) {
    for (int i = 0; i < MAX_WOLVES; i++) {
      if (!pack[i].active) {
        memcpy(pack[i].mac, mac, 6); pack[i].id = pkt.wolf_id; pack[i].active = true;
        esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, mac, 6); pi.channel = 1;
        esp_now_add_peer(&pi); idx = i; break;
      }
    }
  }
  if (idx >= 0) {
    pack[idx].px = pkt.px; pack[idx].py = pkt.py;
    pack[idx].role = pkt.role; pack[idx].fitness = pkt.fitness;
  }
  if (pkt.type == 1) { prey_x = pkt.target_x; prey_y = pkt.target_y; }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(pack, 0, sizeof(pack));
  my_px = (float)(esp_random()%100); my_py = (float)(esp_random()%100);

  WiFi.mode(WIFI_STA);
  uint8_t mac[6]; esp_wifi_get_mac(WIFI_IF_STA, mac); my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv); esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, bcast, 6); pi.channel = 1;
  esp_now_add_peer(&pi);
  Serial.printf("[WOLF] Wolf %02X ready\n", my_id);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 300) return;
  last = millis();

  gwoStep();
  updateRoles();

  wolf_packet_t pkt;
  pkt.type = 0; pkt.wolf_id = my_id; pkt.role = my_role; pkt.seq = seq++;
  pkt.px = my_px; pkt.py = my_py; pkt.fitness = my_fitness;
  pkt.target_x = prey_x; pkt.target_y = prey_y;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));

  const char *roles[] = {"alpha", "beta", "omega"};
  int n = 0; for (int i = 0; i < MAX_WOLVES; i++) if (pack[i].active) n++;
  Serial.printf("{\"wolf\":\"%02X\",\"role\":\"%s\",\"pos\":[%.1f,%.1f],\"prey\":[%.1f,%.1f],\"fit\":%.3f,\"pack\":%d}\n",
    my_id, roles[my_role], my_px, my_py, prey_x, prey_y, my_fitness, n);
  digitalWrite(LED_PIN, my_role == ROLE_ALPHA);
}
