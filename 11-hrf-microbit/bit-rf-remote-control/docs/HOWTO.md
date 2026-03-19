# How-To Guide — bit-rf-remote-control

> Step-by-step lab instructions for the RF Remote Control learning lab.

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari).
- No installation needed. Just open `index.html`.

---

## Lab 1: Understanding the Frame

### Objective
Learn what each field in a radio frame does.

### Steps

1. Open the app and look at the **Protocol Frame Builder** at the top of the main card.
2. You will see five fields: **Preamble**, **Address**, **Command**, **Payload**, **Checksum**.
3. The **Preamble** (`AA`) is a synchronization marker. The receiver looks for this pattern to know a frame is starting.
4. The **Address** (`01`) identifies which device should listen. Change it to `02` and notice frames are still built the same way.
5. The **Command** field is read-only. It gets filled when you press a command button.
6. The **Payload** (`05`) carries extra data. You can put any hex value here.
7. The **Checksum** is auto-calculated. It is the XOR of all other bytes.

### What to Observe
- Change the Preamble to `55` and press UP. Check the Frame Inspector to see the new hex dump.
- The checksum changes every time you modify any field.

---

## Lab 2: Sending Commands

### Objective
Control the virtual robot using your custom protocol.

### Steps

1. Make sure the **Error Rate** slider is at **0%** (no noise).
2. Press the **UP** button. The robot moves up.
3. Press **LEFT**, **RIGHT**, **DOWN** to move the robot around the arena.
4. Press **A** to see the robot pulse (action command).
5. Press **B** to reset the robot to the center and clear the trail.
6. Check the **Activity Log** (click the scroll icon in the header). You will see TX and RX entries for each command.

### Keyboard Shortcut
- Use the arrow keys and A/B keys on your keyboard for faster control.

---

## Lab 3: Injecting Errors

### Objective
Understand what happens when radio noise corrupts a frame.

### Steps

1. Slide the **Error Rate** to **10%**.
2. Press **UP** several times.
3. Some frames will pass checksum verification; others will fail.
4. When the checksum fails, the robot does NOT move. The log shows an error.
5. Increase the error rate to **30%** or **50%** and observe: most frames get rejected.
6. Look at the **Frame Inspector**: corrupted bytes are shown with strikethrough text.

### Key Insight
- Higher error rates mean more bit flips. The XOR checksum catches most corruptions, but not all. Two bit flips in the right positions can cancel each other out (undetected error).

---

## Lab 4: Checksum Deep Dive

### Objective
Understand how XOR checksum works.

### Steps

1. Set error rate to **0%** and press **UP**.
2. Read the TX line in the Frame Inspector. For example: `AA 01 01 05 AF`.
3. Manually verify: `AA XOR 01 = AB`, `AB XOR 01 = AA`, `AA XOR 05 = AF`. The checksum is `AF`.
4. Now set error rate to **20%** and press UP again.
5. If a byte is corrupted, the receiver XORs all bytes including the checksum. If the result is not `00`, the frame is bad.

### Exercise
- Try to find a frame where two bytes are corrupted but the checksum still passes. This demonstrates the limitation of XOR checksums.

---

## Lab 5: Designing Your Own Protocol

### Objective
Customize the frame format to understand design choices.

### Steps

1. Change the **Preamble** to `FF`. This is your unique sync word.
2. Change the **Address** to `0A`. This is device number 10.
3. Change the **Payload** to `FF`. This is maximum power or speed.
4. Press several commands and watch the Frame Inspector.
5. Consider: what if you wanted to add a second payload byte? You would need to extend the frame format.

### Discussion Questions
- Why do real protocols use longer preambles (e.g., 4 bytes)?
- What happens if two devices share the same address?
- Why might you want different payload lengths for different commands?

---

## Challenge 1: ACK Protocol

### Goal
After sending a command, the device should respond with an acknowledgment.

### Hint
- Define an ACK frame: `[Preamble] [Address] [0xFF] [SeqNum] [Checksum]`.
- After transmitting a command, wait 500ms for the ACK.
- If no ACK arrives, retransmit up to 3 times.
- This is the basis of reliable communication.

---

## Challenge 2: 1-Bit Error Correction

### Goal
Detect AND correct single-bit errors without retransmission.

### Hint
- Add parity bits to each frame using Hamming(7,4) encoding.
- The receiver uses the parity bits to identify which bit flipped.
- This costs extra overhead (more bits per frame) but eliminates the need for retransmission.

---

## Challenge 3: Replay Attack

### Goal
Capture a valid frame and replay it. Then defend against it.

### Hint
- Copy a TX frame from the log (e.g., `AA 01 01 05 AF`).
- Replay it by manually entering those bytes into a custom sender.
- The device will obey because the checksum is valid.
- Defense: add a 1-byte sequence number that increments with each frame. The receiver rejects any frame with a sequence number it has already seen.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Robot does not move | Check the Error Rate slider (set to 0% first) |
| Checksum always fails | Verify your Preamble/Address/Payload are valid hex (0-9, A-F) |
| Keyboard not working | Click outside any input field first |
| Log is empty | Click the scroll icon in the header to open the Activity Log |

---

## Going Further

- Read about CRC-8, CRC-16 for stronger error detection.
- Research Manchester encoding and how it handles clock recovery.
- Look into the nRF24L01 radio module datasheet for a real-world RF protocol.
- Build the protocol on two real micro:bit boards using the radio module.

---

Built with [Workshop-DIY](https://workshop-diy.org) by abourdim.
