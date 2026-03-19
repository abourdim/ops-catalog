/*
 * Chrono Epoch Vault - ESP32 Firmware
 * Time-locked encrypted data vault using synchronized epoch timestamps
 * Data only decryptable at specific future timestamps
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <mbedtls/sha256.h>

#define LED_PIN 2
#define MAX_VAULTS 16
#define VAULT_DATA_LEN 32
#define MAX_PEERS 4

typedef struct {
  uint8_t type;        // 0=lock, 1=unlock_req, 2=unlock_resp, 3=time_sync
  uint8_t vault_id;
  uint32_t lock_epoch;
  uint32_t unlock_epoch;
  uint8_t data[VAULT_DATA_LEN];
  uint8_t hash[8];
} vault_packet_t;

typedef struct {
  bool used;
  bool locked;
  uint8_t id;
  uint32_t lock_epoch;
  uint32_t unlock_epoch;
  uint8_t encrypted[VAULT_DATA_LEN];
  uint8_t key_hash[32];
} vault_entry_t;

vault_entry_t vaults[MAX_VAULTS];
uint32_t current_epoch = 0;
uint32_t epoch_offset = 0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void deriveKey(uint32_t epoch, uint8_t *key_out) {
  uint8_t input[8];
  memcpy(input, &epoch, 4);
  input[4] = my_id;
  input[5] = 0x42;
  input[6] = (epoch >> 8) & 0xFF;
  input[7] = (epoch >> 16) & 0xFF;
  mbedtls_sha256(input, 8, key_out, 0);
}

void xorEncrypt(uint8_t *data, int len, const uint8_t *key) {
  for (int i = 0; i < len; i++) {
    data[i] ^= key[i % 32];
  }
}

int lockVault(const uint8_t *data, int len, uint32_t unlock_epoch) {
  for (int i = 0; i < MAX_VAULTS; i++) {
    if (!vaults[i].used) {
      vaults[i].used = true;
      vaults[i].locked = true;
      vaults[i].id = i;
      vaults[i].lock_epoch = current_epoch;
      vaults[i].unlock_epoch = unlock_epoch;
      memset(vaults[i].encrypted, 0, VAULT_DATA_LEN);
      memcpy(vaults[i].encrypted, data, min(len, VAULT_DATA_LEN));
      deriveKey(unlock_epoch, vaults[i].key_hash);
      xorEncrypt(vaults[i].encrypted, VAULT_DATA_LEN, vaults[i].key_hash);
      Serial.printf("[VAULT] Locked vault %d until epoch %u\n", i, unlock_epoch);
      return i;
    }
  }
  return -1;
}

bool tryUnlock(int vault_id) {
  if (vault_id < 0 || vault_id >= MAX_VAULTS) return false;
  vault_entry_t *v = &vaults[vault_id];
  if (!v->used || !v->locked) return false;

  if (current_epoch >= v->unlock_epoch) {
    uint8_t key[32];
    deriveKey(v->unlock_epoch, key);
    xorEncrypt(v->encrypted, VAULT_DATA_LEN, key);
    v->locked = false;
    Serial.printf("[VAULT] Unlocked vault %d!\n", vault_id);
    return true;
  }
  Serial.printf("[VAULT] Too early! Need epoch %u, current %u (wait %u s)\n",
    v->unlock_epoch, current_epoch, v->unlock_epoch - current_epoch);
  return false;
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(vault_packet_t)) return;
  vault_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  if (pkt.type == 3) {
    epoch_offset = pkt.lock_epoch - (uint32_t)(esp_timer_get_time() / 1000000);
    current_epoch = pkt.lock_epoch;
    Serial.printf("[VAULT] Time sync: epoch=%u\n", current_epoch);
  } else if (pkt.type == 0) {
    int id = lockVault(pkt.data, VAULT_DATA_LEN, pkt.unlock_epoch);
    vault_packet_t resp;
    resp.type = 2;
    resp.vault_id = id;
    resp.lock_epoch = current_epoch;
    resp.unlock_epoch = pkt.unlock_epoch;
    esp_now_send(mac, (uint8_t *)&resp, sizeof(resp));
  } else if (pkt.type == 1) {
    tryUnlock(pkt.vault_id);
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(vaults, 0, sizeof(vaults));

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

  Serial.printf("[VAULT] Epoch Vault %02X ready\n", my_id);
  Serial.println("[VAULT] Commands: LOCK <data> <unlock_epoch>, UNLOCK <id>, STATUS");
}

void loop() {
  current_epoch = (uint32_t)(esp_timer_get_time() / 1000000) + epoch_offset;

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("LOCK ")) {
      int sp = cmd.indexOf(' ', 5);
      String data = cmd.substring(5, sp > 0 ? sp : cmd.length());
      uint32_t unlock_t = sp > 0 ? cmd.substring(sp + 1).toInt() : current_epoch + 60;
      lockVault((uint8_t *)data.c_str(), data.length(), unlock_t);
    } else if (cmd.startsWith("UNLOCK ")) {
      tryUnlock(cmd.substring(7).toInt());
    } else if (cmd == "STATUS") {
      for (int i = 0; i < MAX_VAULTS; i++) {
        if (vaults[i].used) {
          Serial.printf("  Vault %d: %s unlock@%u\n", i,
            vaults[i].locked ? "LOCKED" : "OPEN", vaults[i].unlock_epoch);
        }
      }
    } else if (cmd.startsWith("EPOCH ")) {
      epoch_offset = cmd.substring(6).toInt() - (uint32_t)(esp_timer_get_time() / 1000000);
    }
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    int used = 0, locked = 0;
    for (int i = 0; i < MAX_VAULTS; i++) {
      if (vaults[i].used) { used++; if (vaults[i].locked) locked++; }
    }
    Serial.printf("{\"node\":\"%02X\",\"epoch\":%u,\"vaults\":%d,\"locked\":%d}\n",
      my_id, current_epoch, used, locked);
    digitalWrite(LED_PIN, locked > 0);
  }
}
