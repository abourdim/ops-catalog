# CHANGES — bit-invisible-fence

## v1.0 (2026-03-18)

### Initial Release

- **Perimeter Map Canvas** — Interactive top-down view with grid overlay for placing sensor nodes
- **Sensor Placement** — Click-to-place sensors with detection radius visualization (50px radius)
- **Fence Activation** — Connects sensors in order to form a dashed perimeter fence line with filled coverage area
- **Intruder Simulation** — Moving dot with random direction that bounces off map edges
- **Breach Detection** — Real-time detection when intruder enters sensor radius; triggers BREACH alert with zone identification
- **Sensor States** — Three visual states: active (green), triggered (red pulse animation), offline (gray)
- **Zone Status Display** — SECURE / BREACH indicator with zone number, animated border on breach
- **Breach Counter** — Cumulative count of breach events
- **Sensor List** — Live-updating list of all sensors with status indicators
- **Coverage Visualization** — Semi-transparent circles showing detection coverage; fence polygon fill
- **i18n** — Full trilingual support (English, French, Arabic) for all simulation UI text
- **Section A (How It Works)** — Four-step explanation of perimeter security concepts
- **Section B (Lab)** — Four hands-on activities for perimeter design and testing
- **Section C (Challenge)** — Three progressive challenges (minimum sensors, find the gap, stealth intruder)
- **Help Panel** — FAQ, How-To, and Wiki tabs covering Perimeter Security, Sensor Networks, Zone Mapping, Breach Detection
- **Template Infrastructure** — All Workshop-DIY v1.2 features preserved (themes, log, toast, sound, easter eggs, pixel pet, etc.)
