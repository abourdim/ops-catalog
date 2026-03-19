# esp-mesh-whisper — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Explore the Mesh
Open the app to see 9 ESP32 nodes connected in a mesh topology. Links show which nodes can communicate directly.

### Step 2: Select Source and Destination
Click on any alive node to select it as the source. Click a second node to set the destination. The info bar shows the BFS shortest path.

### Step 3: Send a Message
Type a message in the input field and click "Send". Watch the message hop from node to node along the BFS path, with each hop highlighted in green.

### Step 4: Kill a Node
Click "Kill Node" to randomly destroy a non-selected node. The node turns red and dashed. If it was on your path, the mesh reroutes automatically.

### Step 5: Observe Rerouting
After killing a node, select the same source and destination. Notice the new path avoids the dead node, demonstrating self-healing mesh behavior.

### Step 6: Heal the Mesh
Click "Heal All" to restore all dead nodes. Watch them come back online one by one with green confirmation logs.

### Step 7: Try the Challenges
Open the Challenge section to test your understanding of mesh networking, BFS routing, and fault tolerance.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | Mesh topology and node connectivity |
| 2 | Source/destination addressing |
| 3 | BFS routing and hop-by-hop forwarding |
| 4 | Node failure and link loss |
| 5 | Self-healing and route recalculation |
| 6 | Network recovery |
| 7 | Fault tolerance theory |

## Going Further

- Try killing multiple nodes to partition the network
- Observe which nodes are critical bridges
- Compare mesh density before and after failures
