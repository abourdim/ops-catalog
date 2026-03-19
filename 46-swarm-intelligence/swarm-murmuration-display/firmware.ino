/*
 * Swarm Murmuration Display - ESP32 Firmware
 * Starling murmuration simulation over ESP-NOW mesh
 * High-speed neighbor tracking with Reynolds rules + obstacle avoidance
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_BIRDS 12
#define TOPOLOGICAL_K 7

typedef struct {
  uint8_t type;
  uint8_t bird_id;
  uint32_t seq;
  float px, py, pz;
  float vx, vy, vz;
} bird_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float px, py, pz, vx, vy, vz;
  float distance;
  int8_t rssi;
  bool active;
} bird_t;

bird_t flock[MAX_BIRDS];
float mx, my, mz, mvx, mvy, mvz;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void limitVec(float *x, float *y, float *z, float maxMag) {
  float m = sqrt(*x * *x + *y * *y + *z * *z);
  if (m > maxMag) { *x *= maxMag/m; *y *= maxMag/m; *z *= maxMag/m; }
}

void murmurationRules() {
  float sep_x=0,sep_y=0,sep_z=0;
  float ali_x=0,ali_y=0,ali_z=0;
  float coh_x=0,coh_y=0,coh_z=0;
  int count = 0;

  // Sort by distance for topological neighbors
  float dists[MAX_BIRDS];
  int indices[MAX_BIRDS];
  int n = 0;
  for (int i = 0; i < MAX_BIRDS; i++) {
    if (!flock[i].active) continue;
    float dx = flock[i].px - mx, dy = flock[i].py - my, dz = flock[i].pz - mz;
    dists[n] = sqrt(dx*dx + dy*dy + dz*dz);
    flock[i].distance = dists[n];
    indices[n] = i;
    n++;
  }
  // Simple sort
  for (int i = 0; i < n-1; i++)
    for (int j = i+1; j < n; j++)
      if (dists[j] < dists[i]) {
        float td = dists[i]; dists[i] = dists[j]; dists[j] = td;
        int ti = indices[i]; indices[i] = indices[j]; indices[j] = ti;
      }

  int k = min(n, TOPOLOGICAL_K);
  for (int i = 0; i < k; i++) {
    bird_t *b = &flock[indices[i]];
    float dx = b->px - mx, dy = b->py - my, dz = b->pz - mz;
    float d = dists[i] + 0.001;
    count++;
    if (d < 15) { sep_x -= dx/d; sep_y -= dy/d; sep_z -= dz/d; }
    ali_x += b->vx; ali_y += b->vy; ali_z += b->vz;
    coh_x += b->px; coh_y += b->py; coh_z += b->pz;
  }

  if (count > 0) {
    ali_x /= count; ali_y /= count; ali_z /= count;
    coh_x = coh_x/count - mx; coh_y = coh_y/count - my; coh_z = coh_z/count - mz;
    mvx += sep_x*0.15 + (ali_x-mvx)*0.08 + coh_x*0.02;
    mvy += sep_y*0.15 + (ali_y-mvy)*0.08 + coh_y*0.02;
    mvz += sep_z*0.15 + (ali_z-mvz)*0.08 + coh_z*0.02;
  }

  // Boundary forces
  if (mx > 80) mvx -= 0.5; if (mx < -80) mvx += 0.5;
  if (my > 80) mvy -= 0.5; if (my < -80) mvy += 0.5;
  if (mz > 40) mvz -= 0.3; if (mz < -40) mvz += 0.3;

  limitVec(&mvx, &mvy, &mvz, 4.0);
  mx += mvx; my += mvy; mz += mvz;
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(bird_packet_t)) return;
  bird_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = -1;
  for (int i = 0; i < MAX_BIRDS; i++)
    if (flock[i].active && flock[i].id == pkt.bird_id) { idx = i; break; }
  if (idx < 0) {
    for (int i = 0; i < MAX_BIRDS; i++) {
      if (!flock[i].active) {
        memcpy(flock[i].mac, mac, 6); flock[i].id = pkt.bird_id; flock[i].active = true;
        esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, mac, 6); pi.channel = 1;
        esp_now_add_peer(&pi); idx = i; break;
      }
    }
  }
  if (idx >= 0) {
    flock[idx].px=pkt.px; flock[idx].py=pkt.py; flock[idx].pz=pkt.pz;
    flock[idx].vx=pkt.vx; flock[idx].vy=pkt.vy; flock[idx].vz=pkt.vz;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void broadcastState() {
  bird_packet_t pkt;
  pkt.type = 0; pkt.bird_id = my_id; pkt.seq = seq++;
  pkt.px=mx; pkt.py=my; pkt.pz=mz; pkt.vx=mvx; pkt.vy=mvy; pkt.vz=mvz;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(flock, 0, sizeof(flock));
  mx = (float)(esp_random()%100)-50; my = (float)(esp_random()%100)-50; mz = (float)(esp_random()%40)-20;
  mvx = (float)(esp_random()%10-5)/5.0; mvy = mvx; mvz = 0;

  WiFi.mode(WIFI_STA);
  uint8_t mac[6]; esp_wifi_get_mac(WIFI_IF_STA, mac); my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv); esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, bcast, 6); pi.channel = 1;
  esp_now_add_peer(&pi);
  Serial.printf("[MURMUR] Bird %02X ready\n", my_id);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 50) return;
  last = millis();
  murmurationRules();
  broadcastState();
  static int r = 0;
  if (++r >= 20) {
    r = 0; int n = 0;
    for (int i = 0; i < MAX_BIRDS; i++) if (flock[i].active) n++;
    Serial.printf("{\"bird\":\"%02X\",\"p\":[%.1f,%.1f,%.1f],\"v\":[%.1f,%.1f,%.1f],\"flock\":%d}\n",
      my_id,mx,my,mz,mvx,mvy,mvz,n);
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
