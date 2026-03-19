#!/usr/bin/env python3
"""Cognitive Radio — RPi ML Inference Engine
Implements dynamic spectrum access using reinforcement learning.
The radio learns optimal frequency/power/modulation decisions
based on spectrum observations and past performance.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/cognitive_radio_rl.tflite")
PIPE_PATH = "/tmp/sdr_cognitive_pipe"
STATE_LOG = os.path.expanduser("~/cognitive_radio_state/")

NUM_CHANNELS = 16
MODULATION_SCHEMES = ["BPSK", "QPSK", "8PSK", "16QAM", "64QAM"]
POWER_LEVELS = [0.1, 0.25, 0.5, 0.75, 1.0]
EPSILON_START = 1.0
EPSILON_DECAY = 0.995
EPSILON_MIN = 0.05


class CognitiveRadioAgent:
    """RL agent for dynamic spectrum access decisions."""

    def __init__(self, model_path):
        self.interpreter = None
        self.q_table = np.zeros((NUM_CHANNELS, len(MODULATION_SCHEMES), len(POWER_LEVELS)))
        self.epsilon = EPSILON_START
        self.alpha = 0.1
        self.gamma = 0.95
        self.episode_rewards = deque(maxlen=200)
        self.current_state = None
        self.current_action = None
        self.total_throughput = 0
        self.collisions = 0
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("RL policy network loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using Q-table.")

    def observe_spectrum(self, spectrum_state):
        """Process spectrum observation into state representation."""
        channel_powers = np.zeros(NUM_CHANNELS)
        bins_per_ch = len(spectrum_state) // NUM_CHANNELS
        for i in range(NUM_CHANNELS):
            channel_powers[i] = np.mean(spectrum_state[i * bins_per_ch:(i + 1) * bins_per_ch])
        occupancy = (channel_powers > np.percentile(channel_powers, 40)).astype(float)
        self.current_state = {
            "channel_powers": channel_powers,
            "occupancy": occupancy,
            "free_channels": np.where(occupancy == 0)[0].tolist(),
        }
        return self.current_state

    def select_action(self):
        """Epsilon-greedy action selection."""
        if self.interpreter is not None and np.random.rand() > self.epsilon:
            state_vec = self.current_state["channel_powers"].astype(np.float32)
            input_data = state_vec.reshape(self.input_det[0]['shape'])
            self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
            self.interpreter.invoke()
            q_values = self.interpreter.get_tensor(self.output_det[0]['index']).flatten()
            action_idx = int(np.argmax(q_values))
            channel = action_idx // (len(MODULATION_SCHEMES) * len(POWER_LEVELS))
            mod_idx = (action_idx % (len(MODULATION_SCHEMES) * len(POWER_LEVELS))) // len(POWER_LEVELS)
            pwr_idx = action_idx % len(POWER_LEVELS)
        elif np.random.rand() > self.epsilon:
            free = self.current_state.get("free_channels", list(range(NUM_CHANNELS)))
            channel = np.random.choice(free) if free else np.random.randint(NUM_CHANNELS)
            q_slice = self.q_table[channel]
            best = np.unravel_index(np.argmax(q_slice), q_slice.shape)
            mod_idx, pwr_idx = best
        else:
            channel = np.random.randint(NUM_CHANNELS)
            mod_idx = np.random.randint(len(MODULATION_SCHEMES))
            pwr_idx = np.random.randint(len(POWER_LEVELS))

        self.current_action = {
            "channel": int(channel),
            "modulation": MODULATION_SCHEMES[mod_idx],
            "mod_idx": mod_idx,
            "power": POWER_LEVELS[pwr_idx],
            "pwr_idx": pwr_idx,
        }
        return self.current_action

    def compute_reward(self, action, state):
        """Compute reward based on throughput and collision avoidance."""
        ch = action["channel"]
        occupied = state["occupancy"][ch]
        mod_idx = action["mod_idx"]
        bits_per_symbol = [1, 2, 3, 4, 6][mod_idx]
        snr_needed = [3, 6, 10, 14, 20][mod_idx]
        channel_snr = float(state["channel_powers"][ch])

        if occupied > 0.5:
            self.collisions += 1
            return -1.0

        if channel_snr < snr_needed:
            return -0.3

        throughput = bits_per_symbol * (1 - action["power"] * 0.1)
        self.total_throughput += throughput
        return throughput / 6.0

    def update(self, reward):
        """Update Q-table with observed reward."""
        if self.current_action is None:
            return
        ch = self.current_action["channel"]
        mi = self.current_action["mod_idx"]
        pi = self.current_action["pwr_idx"]
        old_q = self.q_table[ch, mi, pi]
        max_future = np.max(self.q_table[ch])
        self.q_table[ch, mi, pi] = old_q + self.alpha * (reward + self.gamma * max_future - old_q)
        self.epsilon = max(EPSILON_MIN, self.epsilon * EPSILON_DECAY)
        self.episode_rewards.append(reward)


def read_spectrum_pipe(num_bins=NUM_CHANNELS * 16):
    """Read spectrum data from SDR pipe."""
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(num_bins * 4)
            return np.frombuffer(raw, dtype=np.float32)
        except Exception:
            pass
    base = np.random.randn(num_bins) * 5 - 20
    for _ in range(np.random.randint(2, 8)):
        idx = np.random.randint(0, num_bins)
        width = np.random.randint(2, 10)
        base[max(0, idx - width):min(num_bins, idx + width)] += np.random.uniform(10, 30)
    return base.astype(np.float32)


def main():
    logger.info("=== Cognitive Radio — RPi RL Engine ===")
    agent = CognitiveRadioAgent(MODEL_PATH)
    os.makedirs(STATE_LOG, exist_ok=True)
    episode = 0

    try:
        while True:
            spectrum = read_spectrum_pipe()
            state = agent.observe_spectrum(spectrum)
            action = agent.select_action()
            reward = agent.compute_reward(action, state)
            agent.update(reward)
            episode += 1
            avg_reward = np.mean(agent.episode_rewards) if agent.episode_rewards else 0
            logger.info(f"Ep {episode}: ch={action['channel']} {action['modulation']} "
                        f"pwr={action['power']:.2f} | R={reward:.2f} avgR={avg_reward:.2f} | "
                        f"eps={agent.epsilon:.3f} coll={agent.collisions}")

            if episode % 100 == 0:
                with open(os.path.join(STATE_LOG, "state.json"), 'w') as f:
                    json.dump({"episode": episode, "avg_reward": round(avg_reward, 3),
                               "epsilon": round(agent.epsilon, 4),
                               "throughput": round(agent.total_throughput, 1),
                               "collisions": agent.collisions}, f, indent=2)
            time.sleep(0.2)

    except KeyboardInterrupt:
        logger.info(f"Stopped. Episodes={episode}, Throughput={agent.total_throughput:.0f}")


if __name__ == "__main__":
    main()
