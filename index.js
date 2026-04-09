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
  }
};

const ATTRACTIONS = {
  MK: [
    { name: 'Astro Orbiter', shortName: 'Astro Orbiter', id: 'd9d12438-d999-4482-894b-8955fdb20ccf' },
    { name: 'Big Thunder Mountain Railroad', shortName: 'Big Thunder', id: 'de3309ca-97d5-4211-bffe-739fed47e92f' },
    { name: "Buzz Lightyear's Space Ranger Spin", shortName: 'Buzz', id: '72c7343a-f7fb-4f66-95df-c91016de7338' },
    { name: 'Country Bear Musical Jamboree', shortName: 'Country Bears', id: '0f57cecf-5502-4503-8bc3-ba84d3708ace' },
    { name: 'Dumbo the Flying Elephant', shortName: 'Dumbo', id: '890fa430-89c0-4a3f-96c9-11597888005e' },
    { name: 'Enchanted Tales with Belle', shortName: 'Enchanted Tales', id: 'e76c93df-31af-49a5-8e2f-752c76c937c9' },
    { name: 'Haunted Mansion', shortName: 'Mansion', id: '2551a77d-023f-4ab1-9a19-8afec0190f39' },
    { name: "it's a small world", shortName: 'small world', id: 'f5aad2d4-a419-4384-bd9a-42f86385c750' },
    { name: 'Jungle Cruise', shortName: 'Jungle', id: '796b0a25-c51e-456e-9bb8-50a324e301b3' },
    { name: 'Mad Tea Party', shortName: 'Tea Cups', id: '0aae716c-af13-4439-b638-d75fb1649df3' },
    { name: "Mickey's PhilharMagic", shortName: 'Philhar', id: '7c5e1e02-3a44-4151-9005-44066d5ba1da' },
    { name: 'Monsters Inc. Laugh Floor', shortName: 'Laugh Floor', id: 'e8f0b426-7645-4ea3-8b41-b94ae7091a41' },
    { name: "Peter Pan's Flight", shortName: 'Pan', id: '86a41273-5f15-4b54-93b6-829f140e5161' },
    { name: 'Pirates of the Caribbean', shortName: 'Pirates', id: '352feb94-e52e-45eb-9c92-e4b44c6b1a9d' },
    { name: 'Prince Charming Regal Carrousel', shortName: 'Carrousel', id: '273ddb8d-e7b5-4e34-8657-1113f49262a5' },
    { name: 'Seven Dwarfs Mine Train', shortName: 'Mine Train', id: '9d4d5229-7142-44b6-b4fb-528920969a2c' },
    { name: 'Space Mountain', shortName: 'Space Mtn', id: 'b2260923-9315-40fd-9c6b-44dd811dbe64' },
    { name: 'Swiss Family Treehouse', shortName: 'Treehouse', id: '30fe3c64-af71-4c66-a54b-aa61fd7af177' },
    { name: 'The Barnstormer', shortName: 'Barnstormer', id: '924a3b2c-6b4b-49e5-99d3-e9dc3f2e8a48' },
    { name: 'The Hall of Presidents', shortName: 'Hall of Pres.', id: '2ebfb38c-5cb5-4de1-86c0-f7af14188022' },
    { name: 'The Magic Carpets of Aladdin', shortName: 'Carpets', id: '96455de6-f4f1-403c-9391-bf8396979149' },
    { name: 'The Many Adventures of Winnie the Pooh', shortName: 'Pooh', id: '0d94ad60-72f0-4551-83a6-ebaecdd89737' },
    { name: "Tiana's Bayou Adventure", shortName: 'Tiana', id: '73cb9445-0695-47a3-87ce-d08ae36b5f3c' },
    { name: 'Tomorrowland Speedway', shortName: 'Speedway', id: 'f163ddcd-43e1-488d-8276-2381c1db0a39' },
    { name: 'Tomorrowland Transit Authority PeopleMover', shortName: 'PeopleMover', id: 'ffcfeaa2-1416-4920-a1ed-543c1a1695c4' },
    { name: 'TRON Lightcycle / Run', shortName: 'TRON', id: '5a43d1a7-ad53-4d25-abfe-25625f0da304' },
    { name: 'Under the Sea - Journey of The Little Mermaid', shortName: 'Mermaid', id: '3cba0cb4-e2a6-402c-93ee-c11ffcb127ef' },
    { name: 'Walt Disney World Railroad - Fantasyland', shortName: 'Fantasyland Station', id: 'e40ac396-cbac-43f4-8752-764ed60ccceb' },
    { name: 'Walt Disney World Railroad - Frontierland', shortName: 'Frontier Station', id: 'd5f61e68-a4ef-4fca-8287-2dcd0b15711c' },
    { name: 'Walt Disney World Railroad - Main Street, U.S.A.', shortName: 'Main Street Station', id: 'e39b831b-7731-49bb-815b-289b4f49a9fd' },
    { name: "Walt Disney's Carousel of Progress", shortName: 'Carousel of Progress', id: '8183f3f2-1b59-4b9c-b634-6a863bdf8d84' },
    { name: "Walt Disney's Enchanted Tiki Room", shortName: 'Tiki', id: '6fd1e225-53a0-4a80-a577-4bbc9a471075' }
  ],
  EP: [
    { name: "Canada Far and Wide", shortName: "Canada 360", id: "61fb49f8-e62f-4e1c-ae0e-8ab9929037bc" },
    { name: "Disney and Pixar Short Film Festival", shortName: "Pixar Shorts", id: "35ed719b-f7f0-488f-8346-4fbf8055d373" },
    { name: "Frozen Ever After", shortName: "Frozen", id: "8d7ccdb1-a22b-4e26-8dc8-65b1938ed5f0" },
    { name: "Gran Fiesta Tour Starring The Three Caballeros", shortName: "Gran Fiesta", id: "22f48b73-01df-460e-8969-9eb2b4ae836c" },
    { name: "Guardians of the Galaxy: Cosmic Rewind", shortName: "Guardians", id: "e3549451-b284-453d-9c31-e3b1207abd79" },
    { name: "Journey Into Imagination With Figment", shortName: "Figment", id: "75449e85-c410-4cef-a368-9d2ea5d52b58" },
    { name: "Journey of Water, Inspired by Moana", shortName: "Moana", id: "dae68dee-dfba-4128-b594-6aa12add1070" },
    { name: "Living with the Land", shortName: "Living With The Land", id: "8f353879-d6ac-4211-9352-4029efb47c18" },
    { name: "Mission: SPACE", shortName: "Mission Space", id: "5b6475ad-4e9a-4793-b841-501aa382c9c0" },
    { name: "Remy's Ratatouille Adventure", shortName: "Remys", id: "1e735ffb-4868-47f1-b2cd-2ac1156cd5f0" },
    { name: "Soarin' Around the World", shortName: "Soarin", id: "81b15dfd-cf6a-466f-be59-3dd65d2a2807" },
    { name: "Spaceship Earth", shortName: "Spaceship Earth", id: "480fde8f-fe58-4bfb-b3ab-052a39d4db7c" },
    { name: "Test Track", shortName: "Test Track", id: "37ae57c5-feaf-4e47-8f27-4b385be200f0" },
    { name: "The American Adventure", shortName: "America", id: "1f542745-cda1-4786-a536-5fff373e5964" },
    { name: "The Seas with Nemo & Friends", shortName: "Nemo", id: "fb076275-0570-4d62-b2a9-4d6515130fa3" },
    { name: "Turtle Talk With Crush", shortName: "Turtle Talk", id: "57acb522-a6fc-4aa4-a80e-21f21f317250" },
    { name: "Reflections of China", shortName: "China 360", id: "ee070d46-6a64-41c0-9f12-69dcfcca10a0" }
  ],
  HS: [
    { name: "Alien Swirling Saucers", shortName: "Saucers", id: "d56506e2-6ad3-443a-8065-fea37987248d" },
    { name: "Mickey & Minnie's Runaway Railway", shortName: "MMRR", id: "6e118e37-5002-408d-9d88-0b5d9cdb5d14" },
    { name: "Millennium Falcon: Smugglers Run", shortName: "Smugglers", id: "34c4916b-989b-4ff1-a7e3-a6a846a3484f" },
    { name: "Rock 'n' Roller Coaster Starring Aerosmith", shortName: "Coaster", id: "e516f303-e82d-4fd3-8fbf-8e6ab624cf89" },
    { name: "Slinky Dog Dash", shortName: "Slinky", id: "399aa0a1-98e2-4d2b-b297-2b451e9665e1" },
    { name: "Star Tours – The Adventures Continue", shortName: "Star Tours", id: "3b290419-8ca2-44bc-a710-a6c83fca76ec" },
    { name: "Star Wars: Rise of the Resistance", shortName: "Rise", id: "1a2e70d9-50d5-4140-b69e-799e950f7d18" },
    { name: "The Twilight Zone Tower of Terror™", shortName: "Tower", id: "6f6998e8-a629-412c-b964-2cb06af8e26b" },
    { name: "Toy Story Mania!", shortName: "Mania", id: "20b5daa8-e1ea-436f-830c-2d7d18d929b5" },
    { name: "Vacation Fun - An Original Animated Short with Mickey & Minnie", shortName: "Vacation Fun", id: "9211adc9-b296-4667-8e97-b40cf76108e4" },
    { name: "Walt Disney Presents", shortName: "Disney Presents", id: "d7669edc-eaa1-4af2-bbb5-6e98df564166" }
  ],
  AK: [
    { name: "Avatar Flight of Passage", shortName: "Flight", id: "24cf863c-b6ba-4826-a056-0b698989cbf7" },
    { name: "Expedition Everest - Legend of the Forbidden Mountain", shortName: "Everest", id: "64a6915f-a835-4226-ba5c-8389fc4cade3" },
    { name: "Gorilla Falls Exploration Trail", shortName: "Gorilla Falls", id: "e7976e25-4322-4587-8ded-fb1d9dcbb83c" },
    { name: "Kali River Rapids", shortName: "Kali", id: "d58d9262-ec95-4161-80a0-07ca43b2f5f3" },
    { name: "Kilimanjaro Safaris", shortName: "Safari", id: "32e01181-9a5f-4936-8a77-0dace1de836c" },
    { name: "Maharajah Jungle Trek", shortName: "Maharaja", id: "1a8ea967-229a-42a0-8290-59b036c84e14" },
    { name: "Na'vi River Journey", shortName: "Navi", id: "7a5af3b7-9bc1-4962-92d0-3ea9c9ce35f0" },
    { name: "Wildlife Express Train", shortName: "Wildlife Express", id: "4f391f0e-52be-4f9d-99d6-b3ae0373b43c" },
    { name: "Zootopia: Better Zoogether!", shortName: "Zootopia", id: "1b15c77b-0311-4171-8e59-7f38e6d60754" }
  ]
};

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

  // Initialize attractions
  for (const [parkKey, attractions] of Object.entries(ATTRACTIONS)) {
    for (const attraction of attractions) {
      initialData.attractions[attraction.id] = {
        name: attraction.name,
        shortName: attraction.shortName,
        id: attraction.id,
        parkId: CONFIG.PARKS[parkKey].id,
        parkKey: parkKey,
        status: 'closed',
        code: 107,
        lastChanged: new Date('2000-01-01T00:00:00Z').toISOString()
      };
    }
  }

  // Fetch today's hours for each park at startup
  for (const [parkKey, park] of Object.entries(CONFIG.PARKS)) {
    const segments = await fetchParkSchedule(park.id);
    initialData.parks[park.id].hours.segments = segments;
    console.log(`Fetched initial schedule for ${parkKey}: ${segments.length} segment(s)`);
  }

  try {
    await fs.writeFile(CONFIG.DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('Data file initialized');
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

// Load data from file
async function loadData() {
  try {
    const data = await fs.readFile(CONFIG.DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing data file, initializing...');
    await initializeData();
    return loadData();
  }
}

// Save data to file
async function saveData(data) {
  try {
    await fs.writeFile(CONFIG.DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Fetch live data from API
async function fetchLiveData() {
  try {
    const response = await fetch(CONFIG.API_URL);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching live data:', error);
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

// Fetch and store schedule segments for all parks
async function fetchAllParkSchedules() {
  console.log('Fetching park schedules...');
  const storedData = await loadData();
  for (const [parkKey, park] of Object.entries(CONFIG.PARKS)) {
    const segments = await fetchParkSchedule(park.id);
    storedData.parks[park.id].hours.segments = segments;
    // Also reset park status to closed so opening logic fires fresh each day
    storedData.parks[park.id].status = 'closed';
    storedData.parks[park.id].code = 107;
    console.log(`Fetched schedule for ${parkKey}: ${segments.length} segment(s)`);
  }
  await saveData(storedData);
}

// Schedule daily hours fetch at 2:00 AM ET (regardless of server timezone)
function scheduleDailyHoursUpdate() {
  function getMsUntilNext2AmET() {
    const now = new Date();
    // Get current time components in ET
    const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const etNow = new Date(etString);
    // Build a Date representing 2:00 AM ET today
    const et2AM = new Date(etString);
    et2AM.setHours(2, 0, 0, 0);
    // If we're already past 2 AM ET, target tomorrow
    if (etNow >= et2AM) et2AM.setDate(et2AM.getDate() + 1);
    // Offset: difference between ET wall-clock and UTC for that moment
    const utcOffset = now - etNow; // ms
    const target2AMUTC = et2AM.getTime() + utcOffset;
    return target2AMUTC - now.getTime();
  }

  const ms = getMsUntilNext2AmET();
  console.log(`Next schedule fetch in ${Math.round(ms / 60000)} minutes (2:00 AM ET)`);
  setTimeout(async () => {
    await fetchAllParkSchedules();
    // Repeat every 24 hours (re-anchored each time to stay on ET 2 AM)
    setInterval(fetchAllParkSchedules, 24 * 60 * 60 * 1000);
  }, ms);
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

// Format time for display
function formatTime(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
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

// Get status emoji
function getStatusEmoji(status, code) {
  if (code === 107) return '🚫';
  if (status === 'operating') return '🟢';
  if (status === 'closed') return '❌';
  if (status === 'refurbishment') return '🚧';
  return '❓';
}

// Build pinned message
function buildPinnedMessage(parkKey, parkData, attractionsList) {
  const park = CONFIG.PARKS[parkKey];
  const parkStatus = parkData.code === 108 ? '🚀' : '🚫';
  const hours = formatHoursFromSegments(parkData.hours?.segments);
  
  let message = `${park.emoji} ${park.shortName} | ${hours} | ${parkStatus}\n\`\`\`\n`;
  
  // Sort attractions alphabetically by shortName
  const sortedAttractions = attractionsList.sort((a, b) => 
    a.shortName.localeCompare(b.shortName)
  );
  
  // Split into two columns
  const midpoint = Math.ceil(sortedAttractions.length / 2);
  const leftColumn = sortedAttractions.slice(0, midpoint);
  const rightColumn = sortedAttractions.slice(midpoint);
  
  // Calculate column width: longest left-column shortName + 2 spaces padding + emoji + space
  const maxLeftName = Math.max(...leftColumn.map(a => a.shortName.length));
  // emoji is 2 chars wide in monospace, plus a space = 3 chars before the name
  const colWidth = 3 + maxLeftName + 2; // emoji+space + name + 2 gap

  for (let i = 0; i < leftColumn.length; i++) {
    const left = leftColumn[i];
    const leftEmoji = getStatusEmoji(left.status, left.code);
    const leftCell = `${leftEmoji} ${left.shortName}`;
    // padEnd uses character count; emoji counts as 1 char in JS so pad to colWidth
    const leftText = leftCell.padEnd(colWidth);
    
    let rightText = '';
    if (rightColumn[i]) {
      const right = rightColumn[i];
      const rightEmoji = getStatusEmoji(right.status, right.code);
      rightText = `| ${rightEmoji} ${right.shortName}`;
    }
    
    message += `${leftText}${rightText}\n`;
  }
  
  message += '```';
  return message;
}

// Update pinned message
async function updatePinnedMessage(parkKey, parkData, attractionsList) {
  try {
    const park = CONFIG.PARKS[parkKey];
    const channel = await client.channels.fetch(park.channelId);
    
    if (!channel) {
      console.error(`Channel not found for ${parkKey}`);
      return;
    }
    
    const message = buildPinnedMessage(parkKey, parkData, attractionsList);
    
    try {
      const pinnedMessage = await channel.messages.fetch(park.pinnedMsgId);
      await pinnedMessage.edit(message);
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      console.log(`Updated pinned message for ${parkKey} at ${time}`);
    } catch (error) {
      console.error(`Error updating pinned message for ${parkKey}:`, error);
    }
  } catch (error) {
    console.error(`Error in updatePinnedMessage for ${parkKey}:`, error);
  }
}

// Send notification and return the sent Message object.
// code 101: stays until attraction reopens (immediate delete) or park closes (immediate delete)
// code 102: auto-deletes after 5 minutes
// code 107/108: auto-deletes after 5 minutes
async function sendNotification(parkKey, message, code) {
  try {
    const park = CONFIG.PARKS[parkKey];
    const channel = await client.channels.fetch(park.channelId);
    
    if (!channel) {
      console.error(`Channel not found for ${parkKey}`);
      return null;
    }
    
    const sent = await channel.send(message);
    console.log(`Sent notification to ${parkKey}: ${message}`);

    if (code === 101) {
      // Managed externally — caller stores and deletes at the right time
      return sent;
    } else {
      // 102, 107, 108 all auto-delete after 5 minutes
      setTimeout(() => {
        sent.delete().catch(() => {});
      }, 5 * 60 * 1000);
      return sent;
    }
  } catch (error) {
    console.error(`Error sending notification to ${parkKey}:`, error);
    return null;
  }
}

// In-memory store of active 101 messages: attractionId -> Discord Message object
const activeDownMessages = {};

// Process data and handle updates
async function processData() {
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
      
      // Send park opening notification
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
        }
      }
      
      // Send notification for all opening attractions
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
      
      // Close all attractions
      for (const attr of parkAttractions) {
        storedData.attractions[attr.id].status = 'closed';
        storedData.attractions[attr.id].code = 107;
        storedData.attractions[attr.id].lastChanged = now;
      }
      
      // Delete all lingering 101 messages for this park's attractions immediately at park close
      for (const attr of parkAttractions) {
        if (activeDownMessages[attr.id]) {
          activeDownMessages[attr.id].delete().catch(() => {});
          delete activeDownMessages[attr.id];
        }
      }

      // Send park closing notification
      await sendNotification(parkKey, `🚫 107 - ${park.emoji}${park.shortName} - ${currentTime}`, 107);
    }
    
    // Handle individual attraction changes during park hours
    if (withinHours && storedPark.status === 'operating') {
      for (const attr of parkAttractions) {
        const liveAttr = attr.liveData;
        const storedAttr = storedData.attractions[attr.id];
        
        if (!liveAttr) continue;
        
        // Attraction closed during operating hours
        if (liveAttr.status === 'DOWN' && storedAttr.status === 'operating') {
          storedAttr.status = 'closed';
          storedAttr.code = 101;
          storedAttr.lastChanged = now;
          const downMsg = await sendNotification(parkKey, `❌ 101 - ${attr.shortName} - ${park.emoji}${park.shortName} - ${currentTime}`, 101);
          if (downMsg) activeDownMessages[attr.id] = downMsg;
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
          await sendNotification(parkKey, `🟢 102 - ${attr.shortName} - ${park.emoji}${park.shortName} - ${currentTime}`, 102);
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
    
    // Update pinned message
    const currentAttractions = parkAttractions.map(attr => storedData.attractions[attr.id]);
    await updatePinnedMessage(parkKey, storedPark, currentAttractions);
  }
  
  // Save updated data
  await saveData(storedData);
}

// Bot ready event
client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Initialize data if needed
  await loadData();
  
  // Schedule daily hours fetch at 2:00 AM ET
  scheduleDailyHoursUpdate();
  
  // Start polling
  console.log('Starting park data polling...');
  processData(); // Run immediately
  setInterval(processData, CONFIG.POLL_INTERVAL);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
