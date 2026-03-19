# How-To: Pager Decoder — POCSAG Monitor

## Getting Started

1. Open `index.html` in any modern browser.
2. Click **Start Decoder** to begin simulated POCSAG reception.
3. Messages will appear in the feed with decoded content.

## Using the Message Feed

- Each message shows timestamp, baud rate, type (ALPHA/NUM), address, and content.
- Messages scroll automatically; newest appear at the top.
- The feed holds up to 100 messages before old ones are removed.

## Filtering by Address

- Enter a pager address (RIC) in the filter field to isolate a specific device.
- Only messages matching the filter will appear in the feed.
- Clear the filter to see all messages again.

## Switching Frequencies

- Open the **Frequency Settings** section.
- Click a frequency button to switch the receiver.
- Common POCSAG frequencies: 152.0250, 152.0500, 152.4500, 152.8250, 157.9000, 466.0750 MHz.

## Understanding POCSAG Data

- **Address (RIC)**: 7-digit Radio Identity Code assigned to each pager
- **Function (FN)**: 0-3, determines which alert tone the pager plays
- **Baud Rate**: 512, 1200, or 2400 baud transmission speed
- **Type**: ALPHA (alphanumeric text) or NUM (numeric-only)

## Statistics

- **Total Messages**: All decoded messages since start
- **Numeric**: Messages with numbers only
- **Alphanumeric**: Messages containing text
- **Unique Addresses**: Number of distinct pagers seen

## Settings

- Change language (EN/FR/AR) in Settings panel
- Switch between 8 visual themes
- Toggle sound effects
- Activity log tracks all decoded messages

## About POCSAG

POCSAG (Post Office Code Standardisation Advisory Group) is a paging protocol
used worldwide for one-way text messaging. Messages are transmitted unencrypted
on VHF/UHF frequencies. With an RTL-SDR dongle and multimon-ng software, anyone
can receive and decode these signals. This app simulates that experience.
