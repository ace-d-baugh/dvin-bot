const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Configuration
const CONFIG = {
  API_URL: 'https://api.themeparks.wiki/v1/entity/e957da41-3552-4cf6-b636-5babc5cbc4e5/live',
  SCHEDULE_API_URL: 'https://api.themeparks.wiki/v1/entity/{id}/schedule',
  POLL_INTERVAL: 10000, // 10 seconds
  DATA_FILE: path.join(__dirname, 'parkData.json'),
  MESSAGE_LOG_FILE: path.join(__dirname, 'messageLog.json'),
  PARKS: {
    MK: {
      name: 'Magic Kingdom',
      shortName: 'MK',
      id: '75ea578a-adc8-4116-a54d-dccb60765ef9',
      emoji: '<:mk:1488624463133151323>',
      channelId: process.env.MK_CHANNEL_ID,
      pinnedMsgId: process.env.MK_PINNED_MSG_ID
    },
    EP: {
      name: 'Epcot',
      shortName: 'EP',
      id: '47f90d2c-e191-4239-a466-5892ef59a88b',
      emoji: '<:ep:1488624406912696341>',
      channelId: process.env.EP_CHANNEL_ID,
      pinnedMsgId: process.env.EP_PINNED_MSG_ID
    },
    HS: {
      name: "Disney's Hollywood Studios",
      shortName: 'HS',
      id: '288747d1-8b4f-4a64-867e-ea7c9b27bad8',
      emoji: '<:hs:1488624438772760706>',
      channelId: process.env.HS_CHANNEL_ID,
      pinnedMsgId: process.env.HS_PINNED_MSG_ID
    },
    AK: {
      name: "Disney's Animal Kingdom",
      shortName: 'AK',
      id: '1c84a229-8862-4648-9c71-378ddd2c7693',
      emoji: '<:ak:1488624357633954005>',
      channelId: process.env.AK_CHANNEL_ID,
      pinnedMsgId: process.env.AK_PINNED_MSG_ID
    }
  },
  ALL_PARKS: {
    channelId: process.env.ALL_PARKS_STATUS_CHANNEL_ID,
    pinnedMsgId: process.env.ALL_PARKS_PINNED_MSG_ID
  },
  WAIT_CHANGE_CHANNEL_ID: process.env.WAIT_CHANGE_CHANNEL_ID,
  WAIT_CHANGE_THRESHOLD: 20  // minutes — alert when wait shifts by this amount or more
};

const ATTRACTIONS = {
  MK: [
    { name: 'Astro Orbiter', shortName: 'Astro Orbiter', id: 'd9d12438-d999-4482-894b-8955fdb20ccf', channelId: process.env.ASTRO_ORBITER_CHANNEL_ID },
    { name: 'The Barnstormer', shortName: 'Barnstormer', id: '924a3b2c-6b4b-49e5-99d3-e9dc3f2e8a48', channelId: process.env.BARNSTORMER_CHANNEL_ID },
    { name: 'Big Thunder Mountain Railroad', shortName: 'Big Thunder', id: 'de3309ca-97d5-4211-bffe-739fed47e92f', channelId: process.env.BIG_THUNDER_CHANNEL_ID },
    { name: "Buzz Lightyear's Space Ranger Spin", shortName: 'Buzz', id: '72c7343a-f7fb-4f66-95df-c91016de7338', channelId: process.env.BUZZ_LIGHTYEAR_CHANNEL_ID },
    { name: 'The Magic Carpets of Aladdin', shortName: 'Carpets', id: '96455de6-f4f1-403c-9391-bf8396979149', channelId: process.env.MAGIC_CARPETS_CHANNEL_ID },
    { name: 'Prince Charming Regal Carrousel', shortName: 'Carrousel', id: '273ddb8d-e7b5-4e34-8657-1113f49262a5', channelId: process.env.PRINCE_CARROUSEL_CHANNEL_ID },
    { name: "Walt Disney's Carousel of Progress", shortName: 'Carousel of Progress', id: '8183f3f2-1b59-4b9c-b634-6a863bdf8d84', channelId: process.env.CAROUSEL_OF_PROGRESS_CHANNEL_ID },
    { name: 'Country Bear Musical Jamboree', shortName: 'Country Bears', id: '0f57cecf-5502-4503-8bc3-ba84d3708ace', channelId: process.env.COUNTRY_BEARS_CHANNEL_ID },
    { name: 'Dumbo the Flying Elephant', shortName: 'Dumbo', id: '890fa430-89c0-4a3f-96c9-11597888005e', channelId: process.env.DUMBO_CHANNEL_ID },
    { name: 'Enchanted Tales with Belle', shortName: 'Enchanted Tales', id: 'e76c93df-31af-49a5-8e2f-752c76c937c9', channelId: process.env.ENCHANTED_TALES_CHANNEL_ID },
    { name: 'Walt Disney World Railroad - Fantasyland', shortName: 'Fantasyland Station', id: 'e40ac396-cbac-43f4-8752-764ed60ccceb', channelId: process.env.FANTASYLAND_STATION_CHANNEL_ID },
    { name: 'Walt Disney World Railroad - Frontierland', shortName: 'Frontier Station', id: 'd5f61e68-a4ef-4fca-8287-2dcd0b15711c', channelId: process.env.FRONTIERLAND_STATION_CHANNEL_ID },
    { name: 'The Hall of Presidents', shortName: 'Hall of Pres.', id: '2ebfb38c-5cb5-4de1-86c0-f7af14188022', channelId: process.env.HALL_OF_PRESIDENTS_CHANNEL_ID },
    { name: 'Jungle Cruise', shortName: 'Jungle', id: '796b0a25-c51e-456e-9bb8-50a324e301b3', channelId: process.env.JUNGLE_CRUISE_CHANNEL_ID },
    { name: 'Monsters Inc. Laugh Floor', shortName: 'Laugh Floor', id: 'e8f0b426-7645-4ea3-8b41-b94ae7091a41', channelId: process.env.LAUGH_FLOOR_CHANNEL_ID },
    { name: 'Walt Disney World Railroad - Main Street, U.S.A.', shortName: 'Main Street Station', id: 'e39b831b-7731-49bb-815b-289b4f49a9fd', channelId: process.env.MAIN_ST_STATION_CHANNEL_ID },
    { name: 'Haunted Mansion', shortName: 'Mansion', id: '2551a77d-023f-4ab1-9a19-8afec0190f39', channelId: process.env.HAUNTED_MANSION_CHANNEL_ID },
    { name: 'Under the Sea - Journey of The Little Mermaid', shortName: 'Mermaid', id: '3cba0cb4-e2a6-402c-93ee-c11ffcb127ef', channelId: process.env.UNDER_THE_SEA_MERMAID_CHANNEL_ID },
    { name: 'Seven Dwarfs Mine Train', shortName: 'Mine Train', id: '9d4d5229-7142-44b6-b4fb-528920969a2c', channelId: process.env.SEVEN_DWARFS_MINE_TRAIN_CHANNEL_ID },
    { name: "Peter Pan's Flight", shortName: 'Pan', id: '86a41273-5f15-4b54-93b6-829f140e5161', channelId: process.env.PETER_PANS_FLIGHT_CHANNEL_ID },
    { name: 'Tomorrowland Transit Authority PeopleMover', shortName: 'PeopleMover', id: 'ffcfeaa2-1416-4920-a1ed-543c1a1695c4', channelId: process.env.TTA_PEOPLEMOVER_CHANNEL_ID },
    { name: "Mickey's PhilharMagic", shortName: 'Philhar', id: '7c5e1e02-3a44-4151-9005-44066d5ba1da', channelId: process.env.PHILHARMAGIC_CHANNEL_ID },
    { name: 'Pirates of the Caribbean', shortName: 'Pirates', id: '352feb94-e52e-45eb-9c92-e4b44c6b1a9d', channelId: process.env.PIRATES_CARIBBEAN_CHANNEL_ID },
    { name: 'The Many Adventures of Winnie the Pooh', shortName: 'Pooh', id: '0d94ad60-72f0-4551-83a6-ebaecdd89737', channelId: process.env.WINNIE_THE_POOH_CHANNEL_ID },
    { name: "it's a small world", shortName: 'small world', id: 'f5aad2d4-a419-4384-bd9a-42f86385c750', channelId: process.env.ITS_A_SMALL_WORLD_CHANNEL_ID },
    { name: 'Space Mountain', shortName: 'Space Mtn', id: 'b2260923-9315-40fd-9c6b-44dd811dbe64', channelId: process.env.SPACE_MOUNTAIN_CHANNEL_ID },
    { name: 'Tomorrowland Speedway', shortName: 'Speedway', id: 'f163ddcd-43e1-488d-8276-2381c1db0a39', channelId: process.env.TOMORROWLAND_SPEEDWAY_CHANNEL_ID },
    { name: 'Mad Tea Party', shortName: 'Tea Cups', id: '0aae716c-af13-4439-b638-d75fb1649df3', channelId: process.env.MAD_TEA_PARTY_CHANNEL_ID },
    { name: "Tiana's Bayou Adventure", shortName: 'Tiana', id: '73cb9445-0695-47a3-87ce-d08ae36b5f3c', channelId: process.env.TIANAS_BAYOU_ADVENTURE_CHANNEL_ID },
    { name: "Walt Disney's Enchanted Tiki Room", shortName: 'Tiki', id: '6fd1e225-53a0-4a80-a577-4bbc9a471075', channelId: process.env.ENCHANTED_TIKI_CHANNEL_ID },
    { name: 'Swiss Family Treehouse', shortName: 'Treehouse', id: '30fe3c64-af71-4c66-a54b-aa61fd7af177', channelId: process.env.SWISS_FAMILY_TREEHOUSE_CHANNEL_ID },
    { name: 'TRON Lightcycle / Run', shortName: 'TRON', id: '5a43d1a7-ad53-4d25-abfe-25625f0da304', channelId: process.env.TRON_CHANNEL_ID }
  ],
  EP: [
    { name: "The American Adventure", shortName: "America", id: "1f542745-cda1-4786-a536-5fff373e5964", channelId: process.env.AMERICAN_ADVENTURE_CHANNEL_ID },
    { name: "Canada Far and Wide", shortName: "Canada 360", id: "61fb49f8-e62f-4e1c-ae0e-8ab9929037bc", channelId: process.env.CANADA_FAR_WIDE_CHANNEL_ID },
    { name: "Reflections of China", shortName: "China 360", id: "ee070d46-6a64-41c0-9f12-69dcfcca10a0", channelId: process.env.REFLECTIONS_CHINA_CHANNEL_ID },
    { name: "Journey Into Imagination With Figment", shortName: "Figment", id: "75449e85-c410-4cef-a368-9d2ea5d52b58", channelId: process.env.JOURNEY_IMAGINATION_CHANNEL_ID },
    { name: "Frozen Ever After", shortName: "Frozen", id: "8d7ccdb1-a22b-4e26-8dc8-65b1938ed5f0", channelId: process.env.FROZEN_EVER_AFTER_CHANNEL_ID },
    { name: "Gran Fiesta Tour Starring The Three Caballeros", shortName: "Gran Fiesta", id: "22f48b73-01df-460e-8969-9eb2b4ae836c", channelId: process.env.GRAN_FIESTA_TOUR_CHANNEL_ID },
    { name: "Guardians of the Galaxy: Cosmic Rewind", shortName: "Guardians", id: "e3549451-b284-453d-9c31-e3b1207abd79", channelId: process.env.GUARDIANS_OF_GALAXY_CHANNEL_ID },
    { name: "Living with the Land", shortName: "Living W Land", id: "8f353879-d6ac-4211-9352-4029efb47c18", channelId: process.env.LIVING_WITH_LAND_CHANNEL_ID },
    { name: "Mission: SPACE", shortName: "Mission Space", id: "5b6475ad-4e9a-4793-b841-501aa382c9c0", channelId: process.env.MISSION_SPACE_CHANNEL_ID },
    { name: "Journey of Water, Inspired by Moana", shortName: "Moana", id: "dae68dee-dfba-4128-b594-6aa12add1070", channelId: process.env.JOURNEY_OF_WATER_CHANNEL_ID },
    { name: "The Seas with Nemo & Friends", shortName: "Nemo", id: "fb076275-0570-4d62-b2a9-4d6515130fa3", channelId: process.env.SEAS_WITH_NEMO_CHANNEL_ID },
    { name: "Disney and Pixar Short Film Festival", shortName: "Pixar Shorts", id: "35ed719b-f7f0-488f-8346-4fbf8055d373", channelId: process.env.PIXAR_SHORTS_CHANNEL_ID },
    { name: "Remy's Ratatouille Adventure", shortName: "Remys", id: "1e735ffb-4868-47f1-b2cd-2ac1156cd5f0", channelId: process.env.REMYS_RATATOUILLE_CHANNEL_ID },
    { name: "Soarin' Around the World", shortName: "Soarin", id: "81b15dfd-cf6a-466f-be59-3dd65d2a2807", channelId: process.env.SOARIN_CHANNEL_ID },
    { name: "Spaceship Earth", shortName: "Spaceship Earth", id: "480fde8f-fe58-4bfb-b3ab-052a39d4db7c", channelId: process.env.SPACESHIP_EARTH_CHANNEL_ID },
    { name: "Test Track", shortName: "Test Track", id: "37ae57c5-feaf-4e47-8f27-4b385be200f0", channelId: process.env.TEST_TRACK_CHANNEL_ID },
    { name: "Turtle Talk With Crush", shortName: "Turtle Talk", id: "57acb522-a6fc-4aa4-a80e-21f21f317250", channelId: process.env.TURTLE_TALK_CHANNEL_ID }
  ],
  HS: [
    { name: "Rock 'n' Roller Coaster Starring Aerosmith", shortName: "Coaster", id: "e516f303-e82d-4fd3-8fbf-8e6ab624cf89", channelId: process.env.ROCK_N_ROLLERCOASTER_CHANNEL_ID },
    { name: "Walt Disney Presents", shortName: "Disney Presents", id: "d7669edc-eaa1-4af2-bbb5-6e98df564166", channelId: process.env.WALT_DISNEY_PRESENTS_CHANNEL_ID },
    { name: "Toy Story Mania!", shortName: "Mania", id: "20b5daa8-e1ea-436f-830c-2d7d18d929b5", channelId: process.env.TOY_STORY_MANIA_CHANNEL_ID },
    { name: "Mickey & Minnie's Runaway Railway", shortName: "MMRR", id: "6e118e37-5002-408d-9d88-0b5d9cdb5d14", channelId: process.env.MICKEY_MINNIE_RAILWAY_CHANNEL_ID },
    { name: "Star Wars: Rise of the Resistance", shortName: "Rise", id: "1a2e70d9-50d5-4140-b69e-799e950f7d18", channelId: process.env.RISE_OF_RESISTANCE_CHANNEL_ID },
    { name: "Alien Swirling Saucers", shortName: "Saucers", id: "d56506e2-6ad3-443a-8065-fea37987248d", channelId: process.env.ALIEN_SWIRLING_SAUCERS_CHANNEL_ID },
    { name: "Slinky Dog Dash", shortName: "Slinky", id: "399aa0a1-98e2-4d2b-b297-2b451e9665e1", channelId: process.env.SLINKY_DOG_DASH_CHANNEL_ID },
    { name: "Millennium Falcon: Smugglers Run", shortName: "Smugglers", id: "34c4916b-989b-4ff1-a7e3-a6a846a3484f", channelId: process.env.SMUGGLERS_RUN_CHANNEL_ID },
    { name: "Star Tours – The Adventures Continue", shortName: "Star Tours", id: "3b290419-8ca2-44bc-a710-a6c83fca76ec", channelId: process.env.STAR_TOURS_CHANNEL_ID },
    { name: "The Twilight Zone Tower of Terror™", shortName: "Tower", id: "6f6998e8-a629-412c-b964-2cb06af8e26b", channelId: process.env.TOWER_OF_TERROR_CHANNEL_ID },
    { name: "Vacation Fun - An Original Animated Short with Mickey & Minnie", shortName: "Vacation Fun", id: "9211adc9-b296-4667-8e97-b40cf76108e4", channelId: process.env.VACATION_FUN_CHANNEL_ID }
  ],
  AK: [
    { name: "Expedition Everest - Legend of the Forbidden Mountain", shortName: "Everest", id: "64a6915f-a835-4226-ba5c-8389fc4cade3", channelId: process.env.EXPEDITION_EVEREST_CHANNEL_ID },
    { name: "Avatar Flight of Passage", shortName: "Flight", id: "24cf863c-b6ba-4826-a056-0b698989cbf7", channelId: process.env.FLIGHT_OF_PASSAGE_CHANNEL_ID },
    { name: "Gorilla Falls Exploration Trail", shortName: "Gorilla Falls", id: "e7976e25-4322-4587-8ded-fb1d9dcbb83c", channelId: process.env.GORILLA_FALLS_CHANNEL_ID },
    { name: "Kali River Rapids", shortName: "Kali", id: "d58d9262-ec95-4161-80a0-07ca43b2f5f3", channelId: process.env.KALI_RIVER_RAPIDS_CHANNEL_ID },
    { name: "Kilimanjaro Safaris", shortName: "Safari", id: "32e01181-9a5f-4936-8a77-0dace1de836c", channelId: process.env.KILIMANJARO_SAFARI_CHANNEL_ID },
    { name: "Maharajah Jungle Trek", shortName: "Maharaja", id: "1a8ea967-229a-42a0-8290-59b036c84e14", channelId: process.env.MAHARAJA_TREK_CHANNEL_ID },
    { name: "Na'vi River Journey", shortName: "Navi", id: "7a5af3b7-9bc1-4962-92d0-3ea9c9ce35f0", channelId: process.env.NAVI_RIVER_JOURNEY_CHANNEL_ID },
    { name: "Wildlife Express Train", shortName: "Wild Exps", id: "4f391f0e-52be-4f9d-99d6-b3ae0373b43c", channelId: process.env.WILDLIFE_EXPRESS_CHANNEL_ID },
    { name: "Zootopia: Better Zoogether!", shortName: "Zootopia", id: "1b15c77b-0311-4171-8e59-7f38e6d60754", channelId: process.env.ZOOTOPIA_CHANNEL_ID }
  ]
};

// Track last sent status for each attraction to prevent duplicate messages
const lastAttractionStatus = {};

// Track active down messages per attraction for deletion
const activeDownMessages = {};

// Track the last wait time that was used as a baseline for threshold comparisons.
// Null means no valid baseline (attraction was down, just recovered, or never seen).
// Reset to null when attraction goes DOWN; set to new wait on first reading after recovery.
const lastReportedWaitTime = {};

// Flag: true during the initial startup data sync — suppresses most notifications
let isStartup = true;

// Mutex: prevents processData() and fetchAllParkSchedules() from running concurrently,
// which would cause last-write-wins clobbering of saved data (duplicate close notifications,
// lost schedule updates, etc.)
let isProcessing = false;

// Initialize data storage
async function initializeData() {
  const initialData = {
    parks: {},
    attractions: {}
  };

  // Initialize parks
  for (const [key, park] of Object.entries(CONFIG.PARKS)) {
    initialData.parks[park.id] = {
      name: park.name,
      shortName: park.shortName,
      id: park.id,
      status: 'closed',
      code: 107,
      lastChanged: new Date('2000-01-01T00:00:00Z').toISOString(),
      hours: { segments: [] }  // [{type, open, close}] — Early Entry, OPERATING, TICKETED_EVENT
    };
  }

  // Initialize all attractions
  for (const [parkKey, attractions] of Object.entries(ATTRACTIONS)) {
    for (const attr of attractions) {
      initialData.attractions[attr.id] = {
        name: attr.name,
        shortName: attr.shortName,
        id: attr.id,
        park: parkKey,
        status: 'closed',
        code: 107,
        lastChanged: new Date('2000-01-01T00:00:00Z').toISOString()
      };
      // Initialize last status tracking
      lastAttractionStatus[attr.id] = null;
      lastReportedWaitTime[attr.id] = null;
    }
  }

  return initialData;
}

// Load data from file or create new
async function loadData() {
  try {
    const fileContent = await fs.readFile(CONFIG.DATA_FILE, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Ensure all attractions are initialized (handles new attractions added after initial setup)
    for (const [parkKey, attractions] of Object.entries(ATTRACTIONS)) {
      for (const attr of attractions) {
        if (!data.attractions[attr.id]) {
          data.attractions[attr.id] = {
            name: attr.name,
            shortName: attr.shortName,
            id: attr.id,
            park: parkKey,
            status: 'closed',
            code: 107,
            lastChanged: new Date('2000-01-01T00:00:00Z').toISOString()
          };
        }
        // Initialize last status tracking if not present
        if (lastAttractionStatus[attr.id] === undefined) {
          lastAttractionStatus[attr.id] = null;
        }
        if (lastReportedWaitTime[attr.id] === undefined) {
          lastReportedWaitTime[attr.id] = null;
        }
      }
    }
    
    return data;
  } catch (error) {
    console.log('Creating new data file...');
    return await initializeData();
  }
}

// Save data to file
async function saveData(data) {
  await fs.writeFile(CONFIG.DATA_FILE, JSON.stringify(data, null, 2));
}

// ─── Message Log ────────────────────────────────────────────────────────────
// Structure:
// {
//   parkMessages: {
//     "<parkKey>_<attractionId>_<discordMessageId>": { code, discordMessageId, sentAt }
//   },
//   attractionMessages: {
//     "<attractionId>_<discordMessageId>": { code, discordMessageId, sentAt }
//   }
// }

async function loadMessageLog() {
  try {
    const raw = await fs.readFile(CONFIG.MESSAGE_LOG_FILE, 'utf8');
    const log = JSON.parse(raw);
    // Ensure waitChangeMessages key exists for older log files
    if (!log.waitChangeMessages) log.waitChangeMessages = {};
    return log;
  } catch {
    return { parkMessages: {}, attractionMessages: {}, waitChangeMessages: {} };
  }
}

async function saveMessageLog(log) {
  await fs.writeFile(CONFIG.MESSAGE_LOG_FILE, JSON.stringify(log, null, 2));
}

async function logParkMessage(parkKey, attractionId, discordMessageId, code) {
  const log = await loadMessageLog();
  const key = `${parkKey}_${attractionId}_${discordMessageId}`;
  log.parkMessages[key] = { code, discordMessageId, sentAt: new Date().toISOString() };
  await saveMessageLog(log);
}

async function logAttractionMessage(attractionId, discordMessageId, code) {
  const log = await loadMessageLog();
  const key = `${attractionId}_${discordMessageId}`;
  log.attractionMessages[key] = { code, discordMessageId, sentAt: new Date().toISOString() };
  await saveMessageLog(log);
}

// Remove all park message log entries for a given parkKey (and optionally attractionId)
async function clearParkMessageLog(parkKey, attractionId = null) {
  const log = await loadMessageLog();
  const prefix = attractionId ? `${parkKey}_${attractionId}_` : `${parkKey}_`;
  for (const key of Object.keys(log.parkMessages)) {
    if (key.startsWith(prefix)) delete log.parkMessages[key];
  }
  await saveMessageLog(log);
}

// Remove all attraction message log entries for a given attractionId
async function clearAttractionMessageLog(attractionId) {
  const log = await loadMessageLog();
  const prefix = `${attractionId}_`;
  for (const key of Object.keys(log.attractionMessages)) {
    if (key.startsWith(prefix)) delete log.attractionMessages[key];
  }
  await saveMessageLog(log);
}

// Log a wait-change message. Key: attractionId_discordMessageId
// parkKey stored so we know which park closing should clean it up.
async function logWaitChangeMessage(attractionId, parkKey, discordMessageId) {
  const log = await loadMessageLog();
  const key = `${attractionId}_${discordMessageId}`;
  log.waitChangeMessages[key] = { attractionId, parkKey, discordMessageId, sentAt: new Date().toISOString() };
  await saveMessageLog(log);
}

// Remove all wait-change log entries for a given attractionId
async function clearWaitChangeMessages(attractionId) {
  const log = await loadMessageLog();
  const prefix = `${attractionId}_`;
  for (const key of Object.keys(log.waitChangeMessages)) {
    if (key.startsWith(prefix)) delete log.waitChangeMessages[key];
  }
  await saveMessageLog(log);
}

// On startup: process the message log — delete expired/stale messages and re-register
// active 101 down messages into activeDownMessages for runtime tracking.
async function processMessageLogOnStartup(storedData) {
  const log = await loadMessageLog();
  const now = new Date();
  const fiveMinMs = 5 * 60 * 1000;

  // Helper: try to delete a Discord message by channel + message ID
  async function tryDeleteDiscordMessage(channelId, discordMessageId) {
    if (!channelId || !discordMessageId) return;
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) return;
      const msg = await channel.messages.fetch(discordMessageId);
      await msg.delete();
    } catch {
      // Message already deleted or inaccessible — ignore
    }
  }

  // ── Park messages ──────────────────────────────────────────────────────────
  const parkKeysToRemove = [];

  for (const [key, entry] of Object.entries(log.parkMessages)) {
    // Key format: parkKey_attractionId_discordMessageId
    const parts = key.split('_');
    const parkKey = parts[0];
    const attractionId = parts.slice(1, -1).join('_'); // attraction IDs contain hyphens not underscores, but be safe
    const park = CONFIG.PARKS[parkKey];
    if (!park) { parkKeysToRemove.push(key); continue; }

    const sentAt = new Date(entry.sentAt);
    const parkData = storedData.parks[park.id];
    const parkIsClosed = !isWithinParkHours(parkData);

    if (entry.code === 101) {
      // If park is now closed, delete the 101 message and remove from log
      if (parkIsClosed) {
        await tryDeleteDiscordMessage(park.channelId, entry.discordMessageId);
        parkKeysToRemove.push(key);
      } else {
        // Park is still open — re-register into activeDownMessages so runtime can delete it on recovery
        // We store a minimal proxy object with a delete method
        const channelId = park.channelId;
        const discordMsgId = entry.discordMessageId;
        activeDownMessages[attractionId] = {
          delete: async () => {
            await tryDeleteDiscordMessage(channelId, discordMsgId);
          }
        };
        // Do NOT remove from log yet — clearParkMessageLog will be called when deleted at runtime
      }
    } else if (entry.code === 102 || entry.code === 107 || entry.code === 108) {
      // These auto-delete after 5 minutes — if expired, delete from Discord and log
      const age = now - sentAt;
      if (age >= fiveMinMs || parkIsClosed) {
        await tryDeleteDiscordMessage(park.channelId, entry.discordMessageId);
        parkKeysToRemove.push(key);
      } else {
        // Still within 5 min window — schedule the remaining deletion
        const remaining = fiveMinMs - age;
        const channelId = park.channelId;
        const discordMsgId = entry.discordMessageId;
        setTimeout(async () => {
          await tryDeleteDiscordMessage(channelId, discordMsgId);
          const currentLog = await loadMessageLog();
          delete currentLog.parkMessages[key];
          await saveMessageLog(currentLog);
        }, remaining);
      }
    }
  }

  // ── Attraction messages ────────────────────────────────────────────────────
  const attrKeysToRemove = [];

  for (const [key, entry] of Object.entries(log.attractionMessages)) {
    // Key format: attractionId_discordMessageId
    // Find which park this attraction belongs to
    let attrConfig = null;
    let parkKey = null;
    for (const [pk, attrs] of Object.entries(ATTRACTIONS)) {
      const found = attrs.find(a => key.startsWith(a.id + '_'));
      if (found) { attrConfig = found; parkKey = pk; break; }
    }
    if (!attrConfig) { attrKeysToRemove.push(key); continue; }

    const park = CONFIG.PARKS[parkKey];
    const parkData = storedData.parks[park.id];
    const parkIsClosed = !isWithinParkHours(parkData);

    if (parkIsClosed) {
      // Park closed while app was down — delete the attraction channel message
      await tryDeleteDiscordMessage(attrConfig.channelId, entry.discordMessageId);
      attrKeysToRemove.push(key);
    }
    // Otherwise leave in log — it persists until park close
  }

  // Batch remove processed keys from log
  for (const key of parkKeysToRemove) delete log.parkMessages[key];
  for (const key of attrKeysToRemove) delete log.attractionMessages[key];
  await saveMessageLog(log);

  // ── Wait-change messages ───────────────────────────────────────────────────
  // Reload log after prior saves so we're working on fresh data
  const log2 = await loadMessageLog();
  const waitKeysToRemove = [];

  for (const [key, entry] of Object.entries(log2.waitChangeMessages)) {
    const park = CONFIG.PARKS[entry.parkKey];
    if (!park) { waitKeysToRemove.push(key); continue; }

    const parkData = storedData.parks[park.id];
    const parkIsClosed = !isWithinParkHours(parkData);

    if (parkIsClosed) {
      await tryDeleteDiscordMessage(CONFIG.WAIT_CHANGE_CHANNEL_ID, entry.discordMessageId);
      waitKeysToRemove.push(key);
    }
    // Otherwise leave — persists until park close
  }

  for (const key of waitKeysToRemove) delete log2.waitChangeMessages[key];
  await saveMessageLog(log2);

  console.log(`Startup log cleanup: removed ${parkKeysToRemove.length} park message(s), ${attrKeysToRemove.length} attraction message(s), ${waitKeysToRemove.length} wait-change message(s)`);
}

// Fetch live data from API
async function fetchLiveData() {
  try {
    const response = await fetch(CONFIG.API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching live data:', error.message);
    return null;
  }
}

// Fetch schedule segments for a specific park.
// Returns an array of {type, open, close} covering Early Entry, OPERATING, and late TICKETED_EVENTs.
// "today" is determined in ET so the 2 AM fetch always grabs the correct calendar day.
async function fetchParkSchedule(parkId) {
  try {
    const url = CONFIG.SCHEDULE_API_URL.replace('{id}', parkId);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Schedule API responded with status: ${response.status}`);
    }
    const data = await response.json();
    // Always evaluate "today" in ET so the 2 AM UTC fetch doesn't grab the wrong date
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

    const todayEntries = (data.schedule || []).filter(s => {
      // Include OPERATING and TICKETED_EVENT entries whose *date* field matches today ET
      return s.date === today && (s.type === 'OPERATING' || s.type === 'TICKETED_EVENT');
    });

    if (todayEntries.length === 0) return [];

    // Sort by openingTime so segments are in chronological order
    todayEntries.sort((a, b) => new Date(a.openingTime) - new Date(b.openingTime));

    return todayEntries.map(s => ({
      type: s.type,
      description: s.description || s.type,
      open: s.openingTime,
      close: s.closingTime
    }));
  } catch (error) {
    console.error(`Error fetching schedule for park ${parkId}:`, error);
    return [];
  }
}

// Schedule daily hours fetch at 2:00 AM ET (regardless of server timezone)
// Re-anchors itself each day so it never drifts.
function scheduleDailyHoursUpdate() {
  function scheduleNext() {
    const now = new Date();
    const nowET = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

    const next2amET = new Date(nowET);
    next2amET.setHours(2, 0, 0, 0);
    if (next2amET <= nowET) {
      next2amET.setDate(next2amET.getDate() + 1);
    }

    const ms = next2amET - nowET;
    console.log(`Scheduling daily hours fetch at 2:00 AM ET (in ${Math.round(ms / 60000)} minutes)`);

    setTimeout(async () => {
      console.log('Running scheduled hours fetch at 2:00 AM ET');
      await fetchAllParkSchedules();
      scheduleNext(); // Re-anchor for the next day
    }, ms);
  }

  scheduleNext();
}

// Fetch and store schedule segments for all parks
async function fetchAllParkSchedules() {
  // Wait for any in-progress processData to finish before modifying shared data
  while (isProcessing) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  isProcessing = true;
  try {
    console.log('Fetching park schedules...');
    const storedData = await loadData();
    for (const [parkKey, park] of Object.entries(CONFIG.PARKS)) {
      const segments = await fetchParkSchedule(park.id);
      // Completely overwrite hours so stale segments from the previous day are removed
      storedData.parks[park.id].hours = { segments };
      // Also reset park status to closed so opening logic fires fresh each day
      storedData.parks[park.id].status = 'closed';
      storedData.parks[park.id].code = 107;
      console.log(`Fetched schedule for ${parkKey}: ${segments.length} segment(s)`);
    }
    await saveData(storedData);
  } finally {
    isProcessing = false;
  }
}

// Check if current time falls within any of the park's schedule segments
function isWithinParkHours(parkData) {
  const segments = parkData.hours?.segments;
  if (!segments || segments.length === 0) return false;
  const now = new Date();
  return segments.some(seg => {
    if (!seg.open || !seg.close) return false;
    return now >= new Date(seg.open) && now <= new Date(seg.close);
  });
}

// Format a single time value HH:MM
function formatTimeShort(isoString) {
  if (!isoString) return '??:??';
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/New_York'
  });
}

// Format all schedule segments for the pinned message header
// Output: "07:30 - 08:00 | 08:00 - 22:00 | 22:00 - 01:00"
function formatHoursFromSegments(segments) {
  if (!segments || segments.length === 0) return 'Closed';
  return segments
    .map(seg => `${formatTimeShort(seg.open)} - ${formatTimeShort(seg.close)}`)
    .join(' | ');
}

// Format timestamp
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  });
}

// Status code to emoji mapping
function getStatusEmoji(code) {
  const emojiMap = {
    101: '❌',  // Down
    102: '🟢',  // Operating
    103: '🔧',  // Refurbishment
    107: '⬛️',  // Closed
    108: '🚀'   // Open
  };
  return emojiMap[code] || '❓';
}

// Convert a wait time (integer minutes) to a 3-digit emoji string e.g. 5 -> 0️⃣0️⃣5️⃣
function waitTimeToEmoji(minutes) {
  const digitEmojis = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
  const clamped = Math.min(Math.max(Math.floor(minutes), 0), 999);
  const str = clamped.toString().padStart(3, '0');
  return str.split('').map(d => digitEmojis[parseInt(d)]).join('');
}

// Send notification to park channel
async function sendNotification(parkKey, message, code, attractionId = null) {
  // During startup, only allow 101 (DOWN) notifications — all others are silent
  if (isStartup && code !== 101) return null;

  try {
    const park = CONFIG.PARKS[parkKey];
    if (!park || !park.channelId) return null;
    
    const channel = await client.channels.fetch(park.channelId);
    if (!channel) return null;
    
    const sent = await channel.send(message);
    console.log(`Sent notification to ${parkKey}: ${message}`);

    // Log the message for restart recovery
    if (attractionId) {
      await logParkMessage(parkKey, attractionId, sent.id, code);
    }

    if (code !== 101) {
      // 102, 107, 108 all auto-delete after 5 minutes
      const msgKey = attractionId ? `${parkKey}_${attractionId}_${sent.id}` : null;
      setTimeout(async () => {
        sent.delete().catch(() => {});
        if (msgKey) {
          const log = await loadMessageLog();
          delete log.parkMessages[msgKey];
          await saveMessageLog(log);
        }
      }, 5 * 60 * 1000);
    }

    return sent;
  } catch (error) {
    console.error(`Error sending notification to ${parkKey}:`, error.message);
    return null;
  }
}

// Send status message to individual attraction channel
async function sendAttractionStatus(attractionId, code, parkKey) {
  // During startup, suppress all attraction channel messages
  if (isStartup) return null;

  try {
    // Find the attraction
    let attraction = null;
    for (const [key, attrs] of Object.entries(ATTRACTIONS)) {
      const found = attrs.find(a => a.id === attractionId);
      if (found) {
        attraction = found;
        break;
      }
    }
    
    if (!attraction || !attraction.channelId) return null;
    
    // Check if this is a duplicate status (prevent back-to-back identical codes)
    if (lastAttractionStatus[attractionId] === code) {
      return null; // Skip duplicate
    }
    
    const channel = await client.channels.fetch(attraction.channelId);
    if (!channel) return null;
    
    const emoji = getStatusEmoji(code);
    const time = formatTime(new Date());
    const message = `${emoji} ${code} - ${time}`;
    
    const sentMessage = await channel.send(message);
    
    // Log for restart recovery
    await logAttractionMessage(attractionId, sentMessage.id, code);

    // Update last sent status
    lastAttractionStatus[attractionId] = code;
    
    return sentMessage;
  } catch (error) {
    console.error(`Error sending attraction status for ${attractionId}:`, error.message);
    return null;
  }
}

// Send a wait-time change alert to #wait-change channel and the individual attraction channel
async function sendWaitChangeNotification(parkKey, attr, newWait, oldWait) {
  if (isStartup) return; // Silent on startup
  if (!CONFIG.WAIT_CHANGE_CHANNEL_ID) return;

  try {
    const park = CONFIG.PARKS[parkKey];
    const increased = newWait > oldWait;
    const moodEmoji = increased ? '😡' : '😀';
    const arrowEmoji = increased ? '↗️' : '↘️';
    const newWaitEmoji = waitTimeToEmoji(newWait);
    const oldWaitEmoji = waitTimeToEmoji(oldWait);
    const time = formatTime(new Date());

    // General #wait-change channel — full message with park/attraction context
    const generalChannel = await client.channels.fetch(CONFIG.WAIT_CHANGE_CHANNEL_ID);
    if (generalChannel) {
      const generalMessage = `${moodEmoji}${park.emoji}${park.shortName}-${attr.shortName} wait ${arrowEmoji} from ${oldWaitEmoji} to ${newWaitEmoji} - ${time}`;
      const sent = await generalChannel.send(generalMessage);
      console.log(`Wait change: ${generalMessage}`);
      await logWaitChangeMessage(attr.id, parkKey, sent.id);
    }

    // Individual attraction channel — simplified message
    if (attr.channelId) {
      const attrChannel = await client.channels.fetch(attr.channelId);
      if (attrChannel) {
        const attrMessage = `${moodEmoji} wait ${arrowEmoji} from ${oldWaitEmoji} to ${newWaitEmoji} - ${time}`;
        const sentAttr = await attrChannel.send(attrMessage);
        console.log(`Wait change: ${attrMessage}`);
        await logAttractionMessage(attr.id, sentAttr.id, 'wait');
      }
    }
  } catch (error) {
    console.error(`Error sending wait change notification for ${attr.shortName}:`, error.message);
  }
}

// Delete all messages in an attraction channel (for park close cleanup)
async function deleteAttractionMessages(attractionId) {
  try {
    let attraction = null;
    for (const [key, attrs] of Object.entries(ATTRACTIONS)) {
      const found = attrs.find(a => a.id === attractionId);
      if (found) {
        attraction = found;
        break;
      }
    }
    
    if (!attraction || !attraction.channelId) return;
    
    const channel = await client.channels.fetch(attraction.channelId);
    if (!channel) return;
    
    // Fetch and delete messages
    let deleted = 0;
    let lastId;
    
    while (true) {
      const options = { limit: 100 };
      if (lastId) options.before = lastId;
      
      const messages = await channel.messages.fetch(options);
      if (messages.size === 0) break;
      
      // Delete messages one by one (bulk delete has 14-day limit)
      for (const msg of messages.values()) {
        try {
          await msg.delete();
          deleted++;
        } catch (err) {
          // Continue on error
        }
      }
      
      lastId = messages.last().id;
      
      // Rate limit protection
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (deleted > 0) {
      console.log(`  Deleted ${deleted} messages from ${attraction.shortName} channel`);
    }
    
    // Clear attraction message log entries
    await clearAttractionMessageLog(attractionId);

    // Reset last status tracking
    lastAttractionStatus[attractionId] = null;
    
  } catch (error) {
    console.error(`Error deleting messages for ${attractionId}:`, error.message);
  }
}

// Get the display prefix for an attraction: wait time emojis if operating with a wait, otherwise tripled status emoji
function getAttractionPrefix(attr) {
  if (attr.code === 102 && typeof attr.waitTime === 'number' && attr.waitTime >= 0) {
    return waitTimeToEmoji(attr.waitTime);
  }
  const emoji = getStatusEmoji(attr.code);
  return `${emoji}${emoji}${emoji}`;
}

// Format attractions into two columns
function formatAttractionColumns(attractions) {
  const halfLength = Math.ceil(attractions.length / 2);
  const column1 = attractions.slice(0, halfLength);
  const column2 = attractions.slice(halfLength);
  
  const maxNameLength = Math.max(...column1.map(a => a.shortName.length));
  
  let output = '';
  for (let i = 0; i < halfLength; i++) {
    const attr1 = column1[i];
    const prefix1 = getAttractionPrefix(attr1);
    const name1 = attr1.shortName.padEnd(maxNameLength);
    
    let line = `${prefix1} ${name1}`;
    
    if (column2[i]) {
      const attr2 = column2[i];
      const prefix2 = getAttractionPrefix(attr2);
      line += `  ${prefix2} ${attr2.shortName}`;
    }
    
    output += line + '\n';
  }
  
  return output;
}

// Update individual park pinned message with retry on transient errors
async function updatePinnedMessage(parkKey, park, attractions) {
  const parkConfig = CONFIG.PARKS[parkKey];
  if (!parkConfig || !parkConfig.channelId || !parkConfig.pinnedMsgId) {
    return;
  }

  // Format hours
  const hours = formatHoursFromSegments(park.hours?.segments);

  // Build header
  const statusEmoji = getStatusEmoji(park.code);
  const header = `${parkConfig.emoji}${park.shortName} | ${hours} | ${statusEmoji}`;

  // Format attractions in columns
  const attractionList = formatAttractionColumns(attractions);

  // Combine into final message
  const content = `${header}\n\`\`\`\n${attractionList}\`\`\``;

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const channel = await client.channels.fetch(parkConfig.channelId);
      if (!channel) return;

      const message = await channel.messages.fetch(parkConfig.pinnedMsgId);
      if (!message) return;

      await message.edit(content);
      return; // success
    } catch (error) {
      const isTransient = error.status === 503 || error.status === 502 || error.status === 429 || error.code === 'ECONNRESET';
      console.error(`Error updating pinned message for ${parkKey} (attempt ${attempt}/${maxAttempts}): ${error.message}`);
      if (attempt < maxAttempts && isTransient) {
        // Exponential backoff: 2s, 4s
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      } else {
        return; // Give up after max attempts or non-transient error
      }
    }
  }
}

// Update All Parks pinned message (vertical stack of all parks)
async function updateAllParksPinnedMessage(storedData) {
  try {
    if (!CONFIG.ALL_PARKS.channelId || !CONFIG.ALL_PARKS.pinnedMsgId) {
      return;
    }
    
    const channel = await client.channels.fetch(CONFIG.ALL_PARKS.channelId);
    if (!channel) return;
    
    const message = await channel.messages.fetch(CONFIG.ALL_PARKS.pinnedMsgId);
    if (!message) return;
    
    let content = '';
    
    // Build vertical stack for each park
    for (const [parkKey, parkConfig] of Object.entries(CONFIG.PARKS)) {
      const park = storedData.parks[parkConfig.id];
      const parkAttractions = ATTRACTIONS[parkKey].map(attr => storedData.attractions[attr.id]);
      
      // Format hours
      const hours = formatHoursFromSegments(park.hours?.segments);
      
      // Build header
      const statusEmoji = getStatusEmoji(park.code);
      const header = `${parkConfig.emoji}${park.shortName} | ${hours} | ${statusEmoji}`;
      
      // Format attractions in columns
      const attractionList = formatAttractionColumns(parkAttractions);
      
      // Add to content with separator
      content += `${header}\n\`\`\`\n${attractionList}\`\`\``;
    }
    
    await message.edit(content.trim());
  } catch (error) {
    console.error('Error updating All Parks pinned message:', error.message);
  }
}

// Process data and handle updates
async function processData() {
  // Guard against concurrent executions (setInterval fires regardless of prior completion)
  if (isProcessing) return;
  isProcessing = true;
  try {
  const liveData = await fetchLiveData();
  if (!liveData) {
    console.log('Skipping update due to API fetch failure');
    return;
  }
  
  const storedData = await loadData();
  const now = new Date().toISOString();
  const currentTime = formatTime(new Date());
  
  // Process each park
  for (const [parkKey, park] of Object.entries(CONFIG.PARKS)) {
    const liveParkData = liveData.liveData.find(item => item.id === park.id);
    if (!liveParkData) continue;
    
    const storedPark = storedData.parks[park.id];
    const parkAttractions = ATTRACTIONS[parkKey].map(attr => {
      const liveAttr = liveData.liveData.find(item => item.id === attr.id);
      return {
        ...storedData.attractions[attr.id],
        liveData: liveAttr
      };
    });
    
    // NOTE: The live API park entity status is hardcoded OPERATING and never updates.
    // Park open/close state is determined by schedule hours instead.
    const withinHours = isWithinParkHours(storedPark);
    
    // Handle park opening: schedule says we're within hours and park was closed
    if (withinHours && storedPark.status === 'closed') {
      storedPark.status = 'operating';
      storedPark.code = 108;
      storedPark.lastChanged = now;
      
      // Send park opening notification (suppressed on startup)
      await sendNotification(parkKey, `🚀 108 - ${park.emoji}${park.shortName} - ${currentTime}`, 108);
      
      // Open all attractions that are operating
      const openingAttractions = [];
      for (const attr of parkAttractions) {
        const liveAttr = attr.liveData;
        if (liveAttr && liveAttr.status === 'OPERATING') {
          storedData.attractions[attr.id].status = 'operating';
          storedData.attractions[attr.id].code = 102;
          storedData.attractions[attr.id].lastChanged = now;
          openingAttractions.push(attr.shortName);
          
          // Send individual attraction status (suppressed on startup)
          await sendAttractionStatus(attr.id, 108, parkKey);
        }
      }
      
      // Send notification for all opening attractions (suppressed on startup)
      if (openingAttractions.length > 0) {
        const attrMessage = openingAttractions.join(', ');
        await sendNotification(parkKey, `🟢 102 - ${attrMessage} - ${park.emoji}${park.shortName} - ${currentTime}`, 102);
      }
    }
    
    // Handle park closing: schedule says we're outside hours and park was operating
    if (!withinHours && storedPark.status === 'operating') {
      storedPark.status = 'closed';
      storedPark.code = 107;
      storedPark.lastChanged = now;
      
      // Close all attractions and delete their messages
      for (const attr of parkAttractions) {
        storedData.attractions[attr.id].status = 'closed';
        storedData.attractions[attr.id].code = 107;
        storedData.attractions[attr.id].lastChanged = now;
        
        // Delete all messages in attraction channel
        await deleteAttractionMessages(attr.id);
      }
      
      // Delete all lingering 101 messages for this park's attractions immediately at park close
      for (const attr of parkAttractions) {
        if (activeDownMessages[attr.id]) {
          activeDownMessages[attr.id].delete().catch(() => {});
          delete activeDownMessages[attr.id];
        }
        // Clear park message log entries for this attraction
        await clearParkMessageLog(parkKey, attr.id);
        // Delete wait-change Discord messages for this attraction then clear log
        if (CONFIG.WAIT_CHANGE_CHANNEL_ID) {
          const wcLog = await loadMessageLog();
          const wcPrefix = `${attr.id}_`;
          try {
            const wcChannel = await client.channels.fetch(CONFIG.WAIT_CHANGE_CHANNEL_ID);
            for (const [key, entry] of Object.entries(wcLog.waitChangeMessages)) {
              if (key.startsWith(wcPrefix)) {
                try {
                  const wcMsg = await wcChannel.messages.fetch(entry.discordMessageId);
                  await wcMsg.delete();
                } catch {}
              }
            }
          } catch {}
        }
        await clearWaitChangeMessages(attr.id);
        // Reset wait baseline
        lastReportedWaitTime[attr.id] = null;
      }

      // Send park closing notification
      await sendNotification(parkKey, `🚫 107 - ${park.emoji}${park.shortName} - ${currentTime}`, 107);
    }
    
    // Always update wait times from live data (regardless of status change)
    for (const attr of parkAttractions) {
      const liveAttr = attr.liveData;
      if (!liveAttr) continue;
      const standbyWait = liveAttr.queue?.STANDBY?.waitTime;
      const newWait = (typeof standbyWait === 'number') ? standbyWait : null;
      storedData.attractions[attr.id].waitTime = newWait;

      const storedAttr = storedData.attractions[attr.id];
      const baseline = lastReportedWaitTime[attr.id];
      const attrIsOperating = storedAttr.status === 'operating';

      if (attrIsOperating && typeof newWait === 'number') {
        if (typeof baseline === 'number') {
          // Have a valid baseline — check threshold
          if (Math.abs(newWait - baseline) >= CONFIG.WAIT_CHANGE_THRESHOLD) {
            await sendWaitChangeNotification(parkKey, attr, newWait, baseline);
            lastReportedWaitTime[attr.id] = newWait;
          }
        } else {
          // No baseline yet (startup, or first reading after recovery) — set silently
          lastReportedWaitTime[attr.id] = newWait;
        }
      } else if (!attrIsOperating || newWait === null) {
        // Attraction not operating or wait is null — keep baseline as null
        // (recovery baseline is set in the 102 recovery block above)
        if (storedAttr.status !== 'operating') {
          lastReportedWaitTime[attr.id] = null;
        }
      }
    }

    // Handle individual attraction changes during park hours
    if (withinHours && storedPark.status === 'operating') {
      for (const attr of parkAttractions) {
        const liveAttr = attr.liveData;
        const storedAttr = storedData.attractions[attr.id];
        
        if (!liveAttr) continue;
        
        // Attraction breakdown during operating hours (DOWN = 101 ❌)
        if (liveAttr.status === 'DOWN' && storedAttr.status === 'operating') {
          storedAttr.status = 'closed';
          storedAttr.code = 101;
          storedAttr.lastChanged = now;
          // Null out the wait baseline — first wait after recovery is the new baseline
          lastReportedWaitTime[attr.id] = null;
          const downMsg = await sendNotification(parkKey, `❌ 101 - ${attr.shortName} - ${park.emoji}${park.shortName} - ${currentTime}`, 101, attr.id);
          if (downMsg) activeDownMessages[attr.id] = downMsg;
          
          // Send individual attraction status
          await sendAttractionStatus(attr.id, 101, parkKey);
        }
        
        // Attraction closes early before park close (CLOSED = 107 ⬛️)
        if (liveAttr.status === 'CLOSED' && storedAttr.status === 'operating') {
          storedAttr.status = 'closed';
          storedAttr.code = 107;
          storedAttr.lastChanged = now;
          await sendNotification(parkKey, `⬛️ 107 - ${attr.shortName} - ${park.emoji}${park.shortName} - ${currentTime}`, 107, attr.id);
          
          // Send individual attraction status
          await sendAttractionStatus(attr.id, 107, parkKey);
          
          // Delete messages in the attraction channel
          await deleteAttractionMessages(attr.id);
        }
        
        // Attraction opened during operating hours
        if (liveAttr.status === 'OPERATING' && storedAttr.status === 'closed') {
          storedAttr.status = 'operating';
          storedAttr.code = 102;
          storedAttr.lastChanged = now;
          // Delete the corresponding 101 down message if it exists
          if (activeDownMessages[attr.id]) {
            activeDownMessages[attr.id].delete().catch(() => {});
            delete activeDownMessages[attr.id];
          }
          // Clear the 101 park message log entry for this attraction
          await clearParkMessageLog(parkKey, attr.id);
          // First wait after recovery is the new baseline — set it from live data
          const recoveryWait = liveAttr.queue?.STANDBY?.waitTime;
          lastReportedWaitTime[attr.id] = (typeof recoveryWait === 'number') ? recoveryWait : null;
          await sendNotification(parkKey, `🟢 102 - ${attr.shortName} - ${park.emoji}${park.shortName} - ${currentTime}`, 102, attr.id);
          
          // Send individual attraction status
          await sendAttractionStatus(attr.id, 102, parkKey);
        }
        
        // Handle refurbishment status
        if (liveAttr.status === 'REFURBISHMENT') {
          storedAttr.status = 'refurbishment';
          if (storedAttr.code !== 103) {
            storedAttr.code = 103;
            storedAttr.lastChanged = now;
          }
        }
      }
    }
    
    // Update individual park pinned message
    const currentAttractions = parkAttractions.map(attr => storedData.attractions[attr.id]);
    await updatePinnedMessage(parkKey, storedPark, currentAttractions);
  }
  
  // Update All Parks pinned message
  await updateAllParksPinnedMessage(storedData);
  
  // Save updated data
  await saveData(storedData);
  } finally {
    isProcessing = false;
  }
}

// Bot ready event
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Initialize data if needed
  await loadData();

  // FIX: Always fetch schedules on startup so park hours are populated
  // regardless of what time the bot starts. Without this, if the bot
  // restarts during the day the segments array is empty and isWithinParkHours()
  // always returns false, causing attractions to never update.
  await fetchAllParkSchedules();

  // Process the message log: delete expired/stale messages, re-register active 101s
  const storedDataForLog = await loadData();
  await processMessageLogOnStartup(storedDataForLog);
  
  // Schedule daily hours fetch at 2:00 AM ET
  scheduleDailyHoursUpdate();
  
  // Start polling — first call is the silent startup sync
  console.log('Starting park data polling (startup sync — notifications suppressed except 101)...');
  await processData(); // Run immediately and await so isStartup covers it fully
  isStartup = false;   // All subsequent polls send notifications normally
  console.log('Startup sync complete. Notifications now active.');
  setInterval(processData, CONFIG.POLL_INTERVAL);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
