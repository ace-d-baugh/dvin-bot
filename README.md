# D'VIN Bot

**Disney's Very Important Notifications** - A Discord bot that monitors Walt Disney World attraction closures in real-time.

## Features

- Monitors all four Walt Disney World parks (Magic Kingdom, Epcot, Hollywood Studios, Animal Kingdom)
- Updates every 10 seconds via the Theme Parks Wiki API
- Sends notifications for:
  - Park opening (🚀 Code 108)
  - Park closing (🚫 Code 107)
  - Attraction closures during operating hours (❌ Code 101)
  - Attraction reopenings during operating hours (🟢 Code 102)
- Maintains pinned messages in each park channel with real-time status
- Two-column format for easy reading

## Prerequisites

- Node.js (v16.9.0 or higher)
- A Discord Bot Token
- Discord Server with 4 channels (one per park)

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Configure your `.env` file with your Discord credentials:
```env
DISCORD_TOKEN=your_discord_bot_token
MK_CHANNEL_ID=magic_kingdom_channel_id
EP_CHANNEL_ID=epcot_channel_id
HS_CHANNEL_ID=hollywood_studios_channel_id
AK_CHANNEL_ID=animal_kingdom_channel_id
MK_PINNED_MSG_ID=magic_kingdom_pinned_message_id
EP_PINNED_MSG_ID=epcot_pinned_message_id
HS_PINNED_MSG_ID=hollywood_studios_pinned_message_id
AK_PINNED_MSG_ID=animal_kingdom_pinned_message_id
```

4. Update the park emojis in `index.js`:
   - Find the `CONFIG.PARKS` section
   - Replace the placeholder emoji codes with your custom Discord emojis

## Setup Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the Bot section and create a bot
4. Enable these Privileged Gateway Intents:
   - Server Members Intent (optional)
   - Message Content Intent
5. Copy the bot token to your `.env` file
6. Invite the bot to your server with these permissions:
   - Read Messages/View Channels
   - Send Messages
   - Manage Messages (for pinning)
   - Read Message History

## Creating Pinned Messages

1. Start the bot once to let it join your server
2. In each park channel, create a message that will become the pinned message
3. Pin that message
4. Copy the message ID (enable Developer Mode in Discord settings)
5. Add the message IDs to your `.env` file

## Running the Bot

Start the bot:
```bash
node index.js
```

For development with auto-restart:
```bash
node index.js npm run dev
```

## Custom Emojis

You'll need to create custom emojis for each park:
- `:mk:` - Magic Kingdom (castle emoji)
- `:ep:` - Epcot (globe emoji)
- `:hs:` - Hollywood Studios (clapperboard emoji)
- `:ak:` - Animal Kingdom (lion emoji)

Upload these to your Discord server, then update the emoji codes in the `CONFIG.PARKS` section.

## Status Codes

- **101** - Attraction closed during park hours
- **102** - Attraction opened during park hours
- **107** - Park/attraction closed for the day
- **108** - Park opened for the day

## Data Storage

The bot stores park and attraction data in `parkData.json`. This file is automatically created on first run and updated every 60 seconds.

## Troubleshooting

- **Bot not responding**: Check your Discord token and channel IDs
- **Pinned messages not updating**: Verify the pinned message IDs are correct
- **API errors**: The bot will skip updates if the API is down and retry on the next interval
- **Missing emojis**: Make sure custom emojis are uploaded to your server and the codes are correct

## API Reference

This bot uses the [Theme Parks Wiki API](https://themeparks.wiki/api):
- Endpoint: `https://api.themeparks.wiki/v1/entity/e957da41-3552-4cf6-b636-5babc5cbc4e5/live`

## License

ISC
