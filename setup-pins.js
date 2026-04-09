const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs').promises;
require('dotenv').config();
 
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});
 
const PARKS = {
  MK: {
    name: 'Magic Kingdom',
    shortName: 'MK',
    emoji: '<:mk:1488624463133151323>',
    channelId: process.env.MK_CHANNEL_ID
  },
  EP: {
    name: 'Epcot',
    shortName: 'EP',
    emoji: '<:ep:1488624406912696341>',
    channelId: process.env.EP_CHANNEL_ID
  },
  HS: {
    name: "Disney's Hollywood Studios",
    shortName: 'HS',
    emoji: '<:hs:1488624438772760706>',
    channelId: process.env.HS_CHANNEL_ID
  },
  AK: {
    name: "Disney's Animal Kingdom",
    shortName: 'AK',
    emoji: '<:ak:1488624357633954005>',
    channelId: process.env.AK_CHANNEL_ID
  }
};
 
client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('\n=== CREATING PINNED MESSAGES ===\n');
  
  const newMessageIds = {};
  
  for (const [parkKey, park] of Object.entries(PARKS)) {
    try {
      console.log(`Creating pinned message for ${park.name}...`);
      
      const channel = await client.channels.fetch(park.channelId);
      if (!channel) {
        console.log(`  ❌ Channel not found for ${parkKey}`);
        continue;
      }
      
      // Create initial message
      const initialMessage = `${park.emoji} ${park.shortName} | Hours Here | 🚫\n\`\`\`\nWaiting for data...\n\`\`\``;
      
      const message = await channel.send(initialMessage);
      console.log(`  ✅ Message created (ID: ${message.id})`);
      
      // Pin the message
      await message.pin();
      console.log(`  📌 Message pinned`);
      
      newMessageIds[parkKey] = message.id;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`  ❌ Error for ${parkKey}: ${error.message}`);
    }
  }
  
  console.log('\n=== SETUP COMPLETE ===\n');
  console.log('New pinned message IDs:');
  console.log(`MK_PINNED_MSG_ID=${newMessageIds.MK || 'FAILED'}`);
  console.log(`EP_PINNED_MSG_ID=${newMessageIds.EP || 'FAILED'}`);
  console.log(`HS_PINNED_MSG_ID=${newMessageIds.HS || 'FAILED'}`);
  console.log(`AK_PINNED_MSG_ID=${newMessageIds.AK || 'FAILED'}`);
  
  console.log('\n📝 UPDATE YOUR .env FILE:');
  console.log('Copy the message IDs above and update your .env file.');
  console.log('\nOr run this command to update automatically:');
  console.log('node update-env.js\n');
  
  // Save to a temporary file for the update script
  const envUpdates = {
    MK_PINNED_MSG_ID: newMessageIds.MK || '',
    EP_PINNED_MSG_ID: newMessageIds.EP || '',
    HS_PINNED_MSG_ID: newMessageIds.HS || '',
    AK_PINNED_MSG_ID: newMessageIds.AK || ''
  };
  
  await fs.writeFile('new-message-ids.json', JSON.stringify(envUpdates, null, 2));
  console.log('Message IDs saved to new-message-ids.json\n');
  
  // Optionally unpin old messages
  console.log('⚠️  OPTIONAL: Unpin the old messages created by "acieffe"');
  console.log('   You can do this manually in Discord by right-clicking each old message → Unpin\n');
  
  process.exit(0);
});
 
client.login(process.env.DISCORD_TOKEN);