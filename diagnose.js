const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('\n=== DIAGNOSTIC REPORT ===\n');
  
  // List all guilds the bot is in
  console.log('Guilds (Servers) the bot is in:');
  client.guilds.cache.forEach(guild => {
    console.log(`  - ${guild.name} (ID: ${guild.id})`);
  });
  
  console.log('\n--- Checking Channel Access ---\n');
  
  const channelsToCheck = {
    MK: process.env.MK_CHANNEL_ID,
    EP: process.env.EP_CHANNEL_ID,
    HS: process.env.HS_CHANNEL_ID,
    AK: process.env.AK_CHANNEL_ID
  };
  
  for (const [parkKey, channelId] of Object.entries(channelsToCheck)) {
    console.log(`Checking ${parkKey} (${channelId}):`);
    
    try {
      const channel = await client.channels.fetch(channelId);
      console.log(`  ✅ Channel found: #${channel.name}`);
      console.log(`     Type: ${channel.type}`);
      console.log(`     Guild: ${channel.guild.name}`);
      
      // Check permissions
      const permissions = channel.permissionsFor(client.user);
      console.log(`     Permissions:`);
      console.log(`       - View Channel: ${permissions.has('ViewChannel')}`);
      console.log(`       - Send Messages: ${permissions.has('SendMessages')}`);
      console.log(`       - Read Message History: ${permissions.has('ReadMessageHistory')}`);
      console.log(`       - Manage Messages: ${permissions.has('ManageMessages')}`);
      
      // Try to fetch the pinned message
      const pinnedMsgIds = {
        MK: process.env.MK_PINNED_MSG_ID,
        EP: process.env.EP_PINNED_MSG_ID,
        HS: process.env.HS_PINNED_MSG_ID,
        AK: process.env.AK_PINNED_MSG_ID
      };
      
      if (pinnedMsgIds[parkKey]) {
        try {
          const message = await channel.messages.fetch(pinnedMsgIds[parkKey]);
          console.log(`  ✅ Pinned message found`);
          console.log(`     Author: ${message.author.tag}`);
          console.log(`     Pinned: ${message.pinned}`);
        } catch (msgError) {
          console.log(`  ❌ Could not fetch pinned message: ${msgError.message}`);
        }
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      if (error.code === 50001) {
        console.log(`     This means the bot cannot see this channel.`);
        console.log(`     Solutions:`);
        console.log(`       1. Make sure the bot has the role assigned`);
        console.log(`       2. Check channel permissions - the bot needs "View Channel" access`);
        console.log(`       3. If it's a private channel, add the bot's role to the channel permissions`);
      }
    }
    console.log('');
  }
  
  console.log('\n--- Available Channels ---\n');
  console.log('Here are all channels the bot CAN see:\n');
  
  client.guilds.cache.forEach(guild => {
    console.log(`${guild.name}:`);
    guild.channels.cache
      .filter(ch => ch.isTextBased())
      .forEach(channel => {
        console.log(`  - #${channel.name} (ID: ${channel.id})`);
      });
    console.log('');
  });
  
  console.log('\n=== END DIAGNOSTIC REPORT ===\n');
  console.log('To fix "Missing Access" errors:');
  console.log('1. Go to your Discord server');
  console.log('2. Right-click each park channel → Edit Channel');
  console.log('3. Go to Permissions tab');
  console.log('4. Click "+" to add a role/member');
  console.log('5. Add the bot or the bot\'s role');
  console.log('6. Enable: View Channel, Send Messages, Read Message History, Manage Messages');
  console.log('7. Save and restart the bot\n');
  
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
