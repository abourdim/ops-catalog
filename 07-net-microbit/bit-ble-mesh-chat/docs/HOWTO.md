# How To Use BLE Mesh Chat

## Overview

BLE Mesh Chat simulates a multi-hop messaging network where micro:bit-like nodes relay messages to each other. This guide walks you through every feature.

---

## Step 1: Build Your Network

1. Open the app in a modern browser.
2. The canvas shows your mesh network with 5 default nodes (A through E).
3. Use the **Nodes** slider (3-8) to change how many nodes are in the network.
4. Nodes automatically connect to nearby neighbors (within BLE range).

## Step 2: Send a Message

1. Select a **Source** node from the "From" dropdown (e.g., Node A).
2. Select a **Destination** node from the "To" dropdown (e.g., Node E).
3. Set the **TTL** (Time-To-Live) -- this controls how many hops the message can survive.
4. Type your message in the text input.
5. Click **Send** and watch the animated dots travel between nodes.

## Step 3: Read the Results

- **Hop Counter**: Shows how many relays the message took.
- **Delivery Status**:
  - Green "Message delivered!" -- success
  - Red "TTL expired" -- message ran out of hops before reaching destination
  - Yellow "Destination unreachable" -- no connected path exists
- **Activity Log** (click the scroll icon): Shows every TX, RX, and relay event with timestamps.

## Step 4: Experiment

### Move Nodes
- Click and drag any node to reposition it.
- Links automatically recalculate based on distance.
- Moving a node far away from others will disconnect it.

### Add Nodes
- Click on any empty space on the canvas to add a new node.
- The node gets the next available letter (up to 12 nodes).

### Remove Nodes
- Right-click on a node to remove it from the network.
- Minimum of 2 nodes must remain.

### Break and Restore Links
- Click on a connection line between two nodes to break it (shown as a dashed red line).
- Click the broken link again to restore it.
- This lets you test what happens when a relay path is unavailable.

---

## Challenges

### Challenge 1: Minimum Hops
Arrange the nodes so you can deliver a message from one end of the network to the other using as few hops as possible. Try different topologies (star, line, ring).

### Challenge 2: Survive Node Failure
Send a message successfully, then remove a critical relay node. Can you still deliver the message by rearranging the remaining nodes?

### Challenge 3: Network Partition
Move nodes so the network splits into two disconnected groups. Then add a bridge node (click on the canvas between the groups) to reconnect them.

---

## Tips

- A lower TTL means the message cannot travel far -- set it too low and it will expire before reaching the destination.
- Flooding sends the message to ALL neighbors at each hop, so even if the shortest path is 2 hops, the message will reach nodes that are 3+ hops away (if TTL allows).
- The activity log shows the exact routing path: TX for sending, RX for receiving, and info for relay events.
- Use the log filters (TX, RX, Info) to focus on specific event types.

---

## Settings

- **Theme**: 8 visual themes available (Settings panel).
- **Language**: English, French, Arabic (Arabic enables right-to-left layout).
- **Sound**: Toggle sound effects for click, success, and error events.
- **Log Export**: Copy or download the activity log for your lab report.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No links between nodes | Drag nodes closer together (within BLE range) |
| Message always expires | Increase the TTL value or reduce the network diameter |
| Cannot add more nodes | Maximum is 12 nodes on the canvas |
| Canvas looks empty | Try refreshing or adjusting the node count slider |
