# VINNY WDW

**Disney's Very Important Notifications** — A Discord bot that monitors Walt Disney World attraction statuses and wait times in real-time.

Built by [Ace Baugh](https://github.com/AceBaugh)

---

## Features

- Monitors all four Walt Disney World theme parks — Magic Kingdom, Epcot, Hollywood Studios, and Animal Kingdom
- Polls live attraction data every 10 seconds via the [ThemeParks.wiki API](https://themeparks.wiki/)
- Sends notifications for:
  - Park opening (`🚀🚀🚀` Code 108)
  - Park closing (`🚫🚫🚫` Code 107)
  - Attraction breakdown during operating hours (`❌❌❌` Code 101)
  - Attraction reopening during operating hours (`🟢🟢🟢` Code 102)
  - Attraction early close during operating hours (`⬛️⬛️⬛️` Code 107)
  - Significant wait time changes (±20 minutes or more)
- Displays live wait times as 3-digit emoji in pinned messages (e.g. `0️⃣4️⃣5️⃣` = 45 min)
- Maintains pinned messages in each park channel and an all-parks overview channel
- Per-attraction dedicated channels with full status history for the day
- Wait time change alerts posted to a general `#wait-change` channel and each attraction's own channel
- Uses Disney's own internal cast member status codes (101, 102, 107, 108) for authenticity
- Persistent message log (`messageLog.json`) for intelligent cleanup on restart
- Silent restart — on reboot, syncs current state and updates pinned messages without spamming notifications (101 re-alerts for any currently down attractions)
- All messages self-delete or are cleaned up at end of each park's operating day

---

## Status Codes

These are the same codes used by Walt Disney World cast members in the parks.

| Display | Code | Meaning |
|---|---|---|
| `❌❌❌` | **101** | Attraction is **DOWN** — unexpected closure during operating hours |
| `0️⃣0️⃣5️⃣` *(example)* | **102** | Attraction is **OPERATING** — number shown is current wait time in minutes |
| `🔧🔧🔧` | **103** | Attraction is under **REFURBISHMENT** — planned extended closure |
| `⬛️⬛️⬛️` | **107** | **Park or attraction CLOSED** — outside of operating hours or early close |
| `🚀🚀🚀` | **108** | Park is **OPENING** — attractions coming online |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16.9.0 or higher
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- A Discord server set up with the channel structure described below

---

## Discord Server Setup

### Required Channel Structure

Before configuring the bot, your Discord server needs the following channels created. The bot will post to these channels but cannot create them itself.

**Overview**
- One "all parks" status channel with a pinned message
- One "wait change" channel for wait time shift alerts

**Per Park (×4 — MK, EP, HS, AK)**
- One park status channel with a pinned message

**Per Attraction**
- One dedicated channel per attraction (see full list below)

### Bot Permissions

When inviting the bot to your server, grant the following permissions:
- Read Messages / View Channels
- Send Messages
- Manage Messages
- Read Message History

### Required Discord Intents

In the [Discord Developer Portal](https://discord.com/developers/applications), navigate to your bot's settings and enable:
- **Message Content Intent**

### Creating Pinned Messages

Each park channel and the all-parks channel needs a pre-existing pinned message that the bot will edit in place.

1. Enable **Developer Mode** in Discord: `Settings → Advanced → Developer Mode`
2. In each channel, send any placeholder message (e.g. `VINNY loading...`)
3. Pin that message
4. Right-click the message → **Copy Message ID**
5. Add the message ID to your `.env` file (see Configuration below)

### Custom Park Emojis

The bot uses custom server emojis for each park. Upload your own artwork to your Discord server, then update the emoji codes in the `CONFIG.PARKS` section of `index.js`.

Placeholder names used in the code:
- `:mk:` — Magic Kingdom
- `:ep:` — Epcot
- `:hs:` — Hollywood Studios
- `:ak:` — Animal Kingdom

---

## Installation

**1. Clone the repository**
```bash
git clone https://github.com/AceBaugh/VINNY-WDW.git
cd VINNY-WDW
```

**2. Install dependencies**
```bash
npm install
```

**3. Create your `.env` file**

Copy the template below and fill in your values. All IDs are obtained from Discord with Developer Mode enabled (right-click any channel or message → Copy ID).

```env
# ── Bot Token ─────────────────────────────────────────────
DISCORD_TOKEN=your_discord_bot_token_here

# ── Park Status Channels ──────────────────────────────────
MK_CHANNEL_ID=
EP_CHANNEL_ID=
HS_CHANNEL_ID=
AK_CHANNEL_ID=

# ── Park Pinned Message IDs ───────────────────────────────
MK_PINNED_MSG_ID=
EP_PINNED_MSG_ID=
HS_PINNED_MSG_ID=
AK_PINNED_MSG_ID=

# ── All Parks Overview ────────────────────────────────────
ALL_PARKS_STATUS_CHANNEL_ID=
ALL_PARKS_PINNED_MSG_ID=

# ── Wait Change Channel ───────────────────────────────────
WAIT_CHANGE_CHANNEL_ID=

# ── Magic Kingdom Attraction Channels ────────────────────
ASTRO_ORBITER_CHANNEL_ID=
BARNSTORMER_CHANNEL_ID=
BIG_THUNDER_CHANNEL_ID=
BUZZ_LIGHTYEAR_CHANNEL_ID=
CAROUSEL_OF_PROGRESS_CHANNEL_ID=
COUNTRY_BEARS_CHANNEL_ID=
DUMBO_CHANNEL_ID=
ENCHANTED_TALES_CHANNEL_ID=
ENCHANTED_TIKI_CHANNEL_ID=
FANTASYLAND_STATION_CHANNEL_ID=
FRONTIERLAND_STATION_CHANNEL_ID=
HALL_OF_PRESIDENTS_CHANNEL_ID=
HAUNTED_MANSION_CHANNEL_ID=
ITS_A_SMALL_WORLD_CHANNEL_ID=
JUNGLE_CRUISE_CHANNEL_ID=
LAUGH_FLOOR_CHANNEL_ID=
MAD_TEA_PARTY_CHANNEL_ID=
MAGIC_CARPETS_CHANNEL_ID=
MAIN_ST_STATION_CHANNEL_ID=
PETER_PANS_FLIGHT_CHANNEL_ID=
PHILHARMAGIC_CHANNEL_ID=
PIRATES_CARIBBEAN_CHANNEL_ID=
PRINCE_CARROUSEL_CHANNEL_ID=
SEVEN_DWARFS_MINE_TRAIN_CHANNEL_ID=
SPACE_MOUNTAIN_CHANNEL_ID=
SWISS_FAMILY_TREEHOUSE_CHANNEL_ID=
TIANAS_BAYOU_ADVENTURE_CHANNEL_ID=
TOMORROWLAND_SPEEDWAY_CHANNEL_ID=
TRON_CHANNEL_ID=
TTA_PEOPLEMOVER_CHANNEL_ID=
UNDER_THE_SEA_MERMAID_CHANNEL_ID=
WINNIE_THE_POOH_CHANNEL_ID=

# ── Epcot Attraction Channels ─────────────────────────────
AMERICAN_ADVENTURE_CHANNEL_ID=
CANADA_FAR_WIDE_CHANNEL_ID=
FROZEN_EVER_AFTER_CHANNEL_ID=
GRAN_FIESTA_TOUR_CHANNEL_ID=
GUARDIANS_OF_GALAXY_CHANNEL_ID=
JOURNEY_IMAGINATION_CHANNEL_ID=
JOURNEY_OF_WATER_CHANNEL_ID=
LIVING_WITH_LAND_CHANNEL_ID=
MISSION_SPACE_CHANNEL_ID=
PIXAR_SHORTS_CHANNEL_ID=
REFLECTIONS_CHINA_CHANNEL_ID=
REMYS_RATATOUILLE_CHANNEL_ID=
SEAS_WITH_NEMO_CHANNEL_ID=
SOARIN_CHANNEL_ID=
SPACESHIP_EARTH_CHANNEL_ID=
TEST_TRACK_CHANNEL_ID=
TURTLE_TALK_CHANNEL_ID=

# ── Hollywood Studios Attraction Channels ─────────────────
ALIEN_SWIRLING_SAUCERS_CHANNEL_ID=
MICKEY_MINNIE_RAILWAY_CHANNEL_ID=
RISE_OF_RESISTANCE_CHANNEL_ID=
ROCK_N_ROLLERCOASTER_CHANNEL_ID=
SLINKY_DOG_DASH_CHANNEL_ID=
SMUGGLERS_RUN_CHANNEL_ID=
STAR_TOURS_CHANNEL_ID=
TOWER_OF_TERROR_CHANNEL_ID=
TOY_STORY_MANIA_CHANNEL_ID=
VACATION_FUN_CHANNEL_ID=
WALT_DISNEY_PRESENTS_CHANNEL_ID=

# ── Animal Kingdom Attraction Channels ────────────────────
EXPEDITION_EVEREST_CHANNEL_ID=
FLIGHT_OF_PASSAGE_CHANNEL_ID=
GORILLA_FALLS_CHANNEL_ID=
KALI_RIVER_RAPIDS_CHANNEL_ID=
KILIMANJARO_SAFARI_CHANNEL_ID=
MAHARAJA_TREK_CHANNEL_ID=
NAVI_RIVER_JOURNEY_CHANNEL_ID=
WILDLIFE_EXPRESS_CHANNEL_ID=
ZOOTOPIA_CHANNEL_ID=
```

---

## Running the Bot

### On your personal computer

**Start normally:**
```bash
npm start
```

**Start in development mode** (auto-restarts on file changes, requires `nodemon`):
```bash
npm run dev
```

---

### On a VPS with PM2 (recommended for always-on hosting)

[PM2](https://pm2.keymetrics.io/) is a process manager for Node.js that keeps the bot running, restarts it on crashes, and survives server reboots.

**1. Install PM2 globally on your server**
```bash
npm install -g pm2
```

**2. Start VINNY with PM2**
```bash
pm2 start index.js --name "vinny-wdw"
```

**3. Save the PM2 process list so it survives reboots**
```bash
pm2 save
```

**4. Enable PM2 to start on system boot**
```bash
pm2 startup
```
Run the command PM2 outputs from the above step to complete the setup.

**Common PM2 commands:**
```bash
pm2 status              # View all running processes
pm2 logs vinny-wdw      # Tail live logs
pm2 restart vinny-wdw   # Restart the bot
pm2 stop vinny-wdw      # Stop the bot
pm2 delete vinny-wdw    # Remove from PM2
```

---

## Data Storage

The bot creates and manages two local JSON files automatically:

| File | Purpose |
|---|---|
| `parkData.json` | Current status, wait times, and park hours for all attractions. Updated every 10 seconds. |
| `messageLog.json` | Discord message IDs and timestamps for all sent notifications. Used to clean up messages correctly on restart or at end of park day. |

Neither file should be edited manually. Both are safe to delete if you need to reset state — the bot will recreate them on next start.

> ⚠️ Add both files to your `.gitignore` to avoid committing live state or stale message IDs to your repository.

---

## How Messages Are Managed

| Message Type | Location | Lifetime |
|---|---|---|
| 101 (DOWN) | Park status channel | Deleted when attraction reopens (102) or at park close |
| 102 / 107 / 108 | Park status channel | Auto-deleted after 5 minutes |
| Status history (101, 102, 108) | Per-attraction channel | Persist all day, deleted at park close |
| Wait time change alerts | `#wait-change` + per-attraction channel | Persist all day, deleted at park close |

On restart, the bot reads `messageLog.json` and:
- Deletes any messages that should have expired while it was offline
- Re-registers any active 101 messages so they can still be deleted when the attraction recovers
- Sends fresh 101 notifications for any attractions that are currently down

---

## Troubleshooting

**Bot not sending messages**
- Verify `DISCORD_TOKEN` is correct and hasn't been regenerated
- Confirm the bot has Send Messages permission in all relevant channels

**Pinned messages not updating**
- Check that `*_PINNED_MSG_ID` values are message IDs (not channel IDs)
- Confirm the bot has Manage Messages permission
- Make sure the pinned messages still exist in their channels

**API errors / stale data**
- The bot will skip a poll cycle if the ThemeParks.wiki API is unavailable and retry on the next interval
- Check [ThemeParks.wiki](https://themeparks.wiki/) for any known outages

**Missing attraction channels**
- Ensure every `*_CHANNEL_ID` variable in `.env` is populated
- A missing channel ID will cause that attraction to be silently skipped

**Bot floods notifications on startup**
- This is expected only for attractions currently showing as DOWN — the bot intentionally re-alerts on 101 status at startup
- All other notification types (102, 107, 108) are suppressed during the startup sync

---

## API Credit

Live park data is provided by the **[ThemeParks.wiki API](https://themeparks.wiki/)** — a community-maintained, real-time data source for theme parks worldwide. Thank you to the ThemeParks.wiki team for making this possible.

WDW Resort entity endpoint used:
```
https://api.themeparks.wiki/v1/entity/e957da41-3552-4cf6-b636-5babc5cbc4e5/live
```

---

## License

ISC

---

*VINNY WDW is not affiliated with, endorsed by, or connected to The Walt Disney Company in any way. This is an independent fan-made project.*
