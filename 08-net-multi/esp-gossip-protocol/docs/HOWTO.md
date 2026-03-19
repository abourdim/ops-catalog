# How To Use Gossip Protocol

## Overview

This app simulates a gossip (epidemic) protocol where data spreads from one seeded node to all others through probabilistic peer-to-peer communication rounds.

---

## Step 1: Seed a Node

Click any gray node on the canvas, or press **Seed Node**. The seeded node turns green (infected with data).

## Step 2: Watch the Rounds

Gossip rounds run automatically. Each round, every infected node picks a random neighbor and tries to share data. The neighbor becomes infected based on the spread probability.

## Step 3: Adjust Parameters

- **Nodes slider**: Set 6-25 nodes to see different network sizes.
- **Spread % slider**: Control infection probability (10-100%).
- **Reset button**: Start over with fresh uninfected nodes.

## Step 4: Monitor Convergence

- The **timeline bar** fills as more nodes get infected.
- Stats show round count, infected/total, and convergence status.
- Convergence = all nodes have the data.

---

## Experiments

| Experiment | What to observe |
|-----------|----------------|
| 100% spread, 6 nodes | Fastest convergence |
| 10% spread, 25 nodes | Slow, many rounds needed |
| 50% spread, 12 nodes | Typical behavior |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Nothing happening | Click a node to seed it first |
| Convergence is slow | Increase spread probability |
| Nodes not connecting | Reset to regenerate the network |
