/*
 * Swarm Particle Swarm Optimizer - ESP32 Firmware
 * Classic PSO distributed across ESP-NOW mesh nodes
 * Each node is a particle optimizing a shared objective function
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_PARTICLES 10
#define DIM 4
#define W_INERTIA 0.7
#define C_PERSONAL 1.5
#define C_SOCIAL 1.5

typedef struct {
  uint8_t type;       // 0=particle_state, 1=global_best
  uint8_t particle_id;
  uint32_t seq;
  float position[DIM];
  float velocity[DIM];
  float fitness;
  float gbest_fitness;
} pso_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float pos[DIM];
  float vel[DIM];
  float fitness;
  float pbest_pos[DIM];
  float pbest_fitness;
  bool active;
} particle_t;

particle_t particles[MAX_PARTICLES];
float my_pos[DIM], my_vel[DIM];
float my_pbest_pos[DIM], my_pbest_fit;
float gbest_pos[DIM], gbest_fit;
uint8_t my_id;
uint32_t seq = 0;
uint32_t iteration = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

// Rastrigin function (classic benchmark)
float objectiveFunction(float *x) {
  float sum = 10.0 * DIM;
  for (int i = 0; i < DIM; i++) {
    sum += x[i] * x[i] - 10.0 * cos(2.0 * M_PI * x[i]);
  }
  return -sum;  // Negate because we maximize
}

float randFloat() {
  return (float)(esp_random() % 10000) / 10000.0;
}

void initParticle() {
  for (int i = 0; i < DIM; i++) {
    my_pos[i] = (randFloat() - 0.5) * 10.0;
    my_vel[i] = (randFloat() - 0.5) * 2.0;
    my_pbest_pos[i] = my_pos[i];
    gbest_pos[i] = my_pos[i];
  }
  my_pbest_fit = objectiveFunction(my_pos);
  gbest_fit = my_pbest_fit;
}

void psoStep() {
  for (int d = 0; d < DIM; d++) {
    float r1 = randFloat(), r2 = randFloat();
    my_vel[d] = W_INERTIA * my_vel[d]
              + C_PERSONAL * r1 * (my_pbest_pos[d] - my_pos[d])
              + C_SOCIAL * r2 * (gbest_pos[d] - my_pos[d]);

    // Clamp velocity
    if (my_vel[d] > 5.0) my_vel[d] = 5.0;
    if (my_vel[d] < -5.0) my_vel[d] = -5.0;

    my_pos[d] += my_vel[d];

    // Clamp position
    if (my_pos[d] > 5.12) my_pos[d] = 5.12;
    if (my_pos[d] < -5.12) my_pos[d] = -5.12;
  }

  float fit = objectiveFunction(my_pos);
  if (fit > my_pbest_fit) {
    my_pbest_fit = fit;
    memcpy(my_pbest_pos, my_pos, sizeof(my_pos));
  }
  if (fit > gbest_fit) {
    gbest_fit = fit;
    memcpy(gbest_pos, my_pos, sizeof(my_pos));
  }
  iteration++;
}

void broadcastState() {
  pso_packet_t pkt;
  pkt.type = 0;
  pkt.particle_id = my_id;
  pkt.seq = seq++;
  memcpy(pkt.position, my_pos, sizeof(my_pos));
  memcpy(pkt.velocity, my_vel, sizeof(my_vel));
  pkt.fitness = objectiveFunction(my_pos);
  pkt.gbest_fitness = gbest_fit;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(pso_packet_t)) return;
  pso_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = -1;
  for (int i = 0; i < MAX_PARTICLES; i++)
    if (particles[i].active && particles[i].id == pkt.particle_id) { idx = i; break; }
  if (idx < 0) {
    for (int i = 0; i < MAX_PARTICLES; i++) {
      if (!particles[i].active) {
        memcpy(particles[i].mac, mac, 6);
        particles[i].id = pkt.particle_id;
        particles[i].active = true;
        esp_now_peer_info_t pi = {};
        memcpy(pi.peer_addr, mac, 6); pi.channel = 1;
        esp_now_add_peer(&pi);
        idx = i; break;
      }
    }
  }
  if (idx >= 0) {
    memcpy(particles[idx].pos, pkt.position, sizeof(pkt.position));
    memcpy(particles[idx].vel, pkt.velocity, sizeof(pkt.velocity));
    particles[idx].fitness = pkt.fitness;
  }

  // Update global best
  if (pkt.fitness > gbest_fit) {
    gbest_fit = pkt.fitness;
    memcpy(gbest_pos, pkt.position, sizeof(gbest_pos));
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(particles, 0, sizeof(particles));

  WiFi.mode(WIFI_STA);
  uint8_t mac[6]; esp_wifi_get_mac(WIFI_IF_STA, mac); my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv); esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, bcast, 6); pi.channel = 1;
  esp_now_add_peer(&pi);

  initParticle();
  Serial.printf("[PSO] Particle %02X ready\n", my_id);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 200) return;
  last = millis();

  psoStep();
  broadcastState();

  static int report = 0;
  if (++report >= 5) {
    report = 0;
    int np = 0;
    for (int i = 0; i < MAX_PARTICLES; i++) if (particles[i].active) np++;

    Serial.printf("{\"pso\":\"%02X\",\"iter\":%u,\"fit\":%.4f,\"gbest\":%.4f,\"pos\":[",
      my_id, iteration, objectiveFunction(my_pos), gbest_fit);
    for (int d = 0; d < DIM; d++) {
      if (d) Serial.print(",");
      Serial.printf("%.3f", my_pos[d]);
    }
    Serial.printf("],\"particles\":%d}\n", np);
    digitalWrite(LED_PIN, iteration & 1);
  }
}
