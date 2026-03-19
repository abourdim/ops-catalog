# HOWTO — bit-mesh-rescue

Step-by-step guide for students.

---

## Getting Started

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari)
2. The app starts with 5 randomly placed nodes already connected
3. The green nodes are active, and lines between them show connections

---

## Building Your Network

1. Click **"Add Node"** to place a new node at a random position
2. The node automatically connects to any peers within radio range (150px)
3. Add 5-10 nodes for a good mesh network
4. Watch the **Active Paths** counter increase as you add nodes

---

## Simulating Failures

1. Click **"Kill Node"** — the button highlights and the cursor changes to a crosshair
2. Click any green (active) node on the canvas
3. The node turns **red** and all its connections are severed
4. Watch the **Health Meter** drop and **Failed Nodes** counter increase
5. Click "Kill Node" again to exit kill mode

---

## Healing the Network

1. Click **"Heal Network"** (the green button)
2. Failed nodes transition through **yellow** (healing) before turning **green** (active)
3. The BFS algorithm recalculates routes through surviving nodes
4. The log shows how many new paths were established and the recovery time in milliseconds

---

## Testing Message Delivery

1. Click **"Test Message"** to send a message between two random active nodes
2. The BFS pathfinding algorithm finds the shortest route
3. A **blue highlight** animates along the path showing the message traveling
4. If no path exists (network is partitioned), the message fails with a red error

---

## Challenges

### Challenge 1: Survive 50% Failure
- Build a network of 10 nodes
- Kill 5 of them
- Click "Test Message" — can data still get through?
- Tip: networks with more connections per node are more resilient

### Challenge 2: Find the SPOF
- Build a network and look for a node that, if removed, splits the network in two
- This is called a **Single Point of Failure**
- Kill that node and test if messages can still travel between all remaining nodes

### Challenge 3: No-SPOF Network
- Design a network where removing ANY single node does not disconnect the rest
- Every node needs at least 2 independent paths to every other node
- This requires careful placement and enough redundant connections

---

## Understanding the Health Meter

| Health | Color | Meaning |
|--------|-------|---------|
| 71-100% | Green | Network is healthy |
| 41-70% | Yellow | Network is degraded but functional |
| 0-40% | Red | Network is critically damaged |

---

## Key Concepts

- **Mesh Network**: every node can relay data for other nodes
- **BFS (Breadth-First Search)**: algorithm that finds the shortest path by exploring neighbors level by level
- **Heartbeat**: periodic signal ("I'm alive!") sent between neighbors
- **Self-Healing**: automatic recovery without human intervention
- **Redundancy**: having backup paths so one failure doesn't break everything
- **SPOF**: a single component whose failure brings down the whole system

---

## Tips

- More nodes = more potential paths = more resilient network
- Nodes that are close together have stronger connections
- A good mesh has every node connected to at least 2-3 others
- Real micro:bit mesh networks work the same way but with radio signals!

---

## Settings

- Change language: Settings > Language (English, French, Arabic)
- Change theme: Settings > Theme (9 options)
- Enable sounds: Settings > Sound effects
- View activity log: click the scroll icon (📜)
