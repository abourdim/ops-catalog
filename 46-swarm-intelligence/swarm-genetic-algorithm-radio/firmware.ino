/*
 * Swarm Genetic Algorithm Radio - ESP32 Firmware
 * Distributed genetic algorithm optimizing radio parameters
 * ESP-NOW mesh shares chromosomes and performs crossover/mutation
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_POP 10
#define GENE_LEN 8
#define MUTATION_RATE 0.1

typedef struct {
  uint8_t type;       // 0=chromosome, 1=fitness, 2=best
  uint8_t node_id;
  uint32_t seq;
  uint8_t genes[GENE_LEN];
  float fitness;
  uint32_t generation;
} ga_packet_t;

typedef struct {
  uint8_t genes[GENE_LEN];
  float fitness;
  uint8_t origin;
  bool evaluated;
} individual_t;

individual_t population[MAX_POP];
int pop_size = 0;
uint8_t best_genes[GENE_LEN];
float best_fitness = 0;
uint32_t generation = 0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

// Fitness: optimize for signal coverage (simulated)
float evaluateFitness(uint8_t *genes) {
  float f = 0;
  // Gene 0-1: TX power (0-255 -> 0-20dBm)
  float power = (genes[0] + genes[1]) / 510.0 * 20.0;
  // Gene 2-3: frequency offset
  float freq_opt = abs(genes[2] - genes[3]) / 255.0;
  // Gene 4-5: timing
  float timing = (genes[4] * genes[5]) / 65025.0;
  // Gene 6-7: channel strategy
  float strategy = (genes[6] ^ genes[7]) / 255.0;

  f = power * 0.3 + freq_opt * 0.2 + timing * 0.3 + strategy * 0.2;
  // Penalty for extreme power
  if (power > 15) f -= (power - 15) * 0.1;
  return fmax(f, 0);
}

void randomIndividual(individual_t *ind) {
  for (int i = 0; i < GENE_LEN; i++)
    ind->genes[i] = esp_random() & 0xFF;
  ind->fitness = evaluateFitness(ind->genes);
  ind->origin = my_id;
  ind->evaluated = true;
}

void crossover(uint8_t *p1, uint8_t *p2, uint8_t *child) {
  int xpoint = esp_random() % GENE_LEN;
  for (int i = 0; i < GENE_LEN; i++)
    child[i] = (i < xpoint) ? p1[i] : p2[i];
}

void mutate(uint8_t *genes) {
  for (int i = 0; i < GENE_LEN; i++) {
    if ((float)(esp_random() % 1000) / 1000.0 < MUTATION_RATE) {
      genes[i] ^= (1 << (esp_random() % 8));
    }
  }
}

void evolve() {
  if (pop_size < 4) return;

  // Tournament selection
  int a = esp_random() % pop_size, b = esp_random() % pop_size;
  int c = esp_random() % pop_size, d = esp_random() % pop_size;
  individual_t *p1 = population[a].fitness > population[b].fitness ? &population[a] : &population[b];
  individual_t *p2 = population[c].fitness > population[d].fitness ? &population[c] : &population[d];

  // Find worst individual to replace
  int worst = 0;
  for (int i = 1; i < pop_size; i++)
    if (population[i].fitness < population[worst].fitness) worst = i;

  crossover(p1->genes, p2->genes, population[worst].genes);
  mutate(population[worst].genes);
  population[worst].fitness = evaluateFitness(population[worst].genes);
  population[worst].origin = my_id;
  population[worst].evaluated = true;

  // Update best
  for (int i = 0; i < pop_size; i++) {
    if (population[i].fitness > best_fitness) {
      best_fitness = population[i].fitness;
      memcpy(best_genes, population[i].genes, GENE_LEN);
    }
  }
  generation++;
}

void shareBest() {
  ga_packet_t pkt;
  pkt.type = 2;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  memcpy(pkt.genes, best_genes, GENE_LEN);
  pkt.fitness = best_fitness;
  pkt.generation = generation;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(ga_packet_t)) return;
  ga_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  if (pop_size < MAX_POP) {
    memcpy(population[pop_size].genes, pkt.genes, GENE_LEN);
    population[pop_size].fitness = evaluateFitness(pkt.genes);
    population[pop_size].origin = pkt.node_id;
    population[pop_size].evaluated = true;
    pop_size++;
  } else {
    // Replace worst if incoming is better
    float incoming_fit = evaluateFitness(pkt.genes);
    int worst = 0;
    for (int i = 1; i < pop_size; i++)
      if (population[i].fitness < population[worst].fitness) worst = i;
    if (incoming_fit > population[worst].fitness) {
      memcpy(population[worst].genes, pkt.genes, GENE_LEN);
      population[worst].fitness = incoming_fit;
      population[worst].origin = pkt.node_id;
    }
  }

  if (pkt.fitness > best_fitness) {
    best_fitness = pkt.fitness;
    memcpy(best_genes, pkt.genes, GENE_LEN);
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  WiFi.mode(WIFI_STA);
  uint8_t mac[6]; esp_wifi_get_mac(WIFI_IF_STA, mac); my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv); esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, bcast, 6); pi.channel = 1;
  esp_now_add_peer(&pi);

  for (int i = 0; i < 5; i++) { randomIndividual(&population[i]); pop_size++; }
  Serial.printf("[GA] Genetic Algorithm node %02X ready (pop=%d)\n", my_id, pop_size);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 500) return;
  last = millis();
  evolve();
  if (generation % 10 == 0) shareBest();

  Serial.printf("{\"ga\":\"%02X\",\"gen\":%u,\"best_fit\":%.4f,\"pop\":%d,\"genes\":\"",
    my_id, generation, best_fitness, pop_size);
  for (int i = 0; i < GENE_LEN; i++) Serial.printf("%02X", best_genes[i]);
  Serial.println("\"}");
  digitalWrite(LED_PIN, generation & 1);
}
