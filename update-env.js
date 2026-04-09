const fs = require('fs').promises;
const path = require('path');
 
async function updateEnvFile() {
  try {
    // Read the new message IDs
    const newIds = JSON.parse(await fs.readFile('new-message-ids.json', 'utf8'));
    
    // Read current .env file
    const envPath = path.join(__dirname, '.env');
    let envContent = await fs.readFile(envPath, 'utf8');
    
    // Update each pinned message ID
    for (const [key, value] of Object.entries(newIds)) {
      if (value) {
        const regex = new RegExp(`${key}=.*`, 'g');
        envContent = envContent.replace(regex, `${key}=${value}`);
      }
    }
    
    // Write back to .env
    await fs.writeFile(envPath, envContent);
    
    console.log('✅ .env file updated successfully!');
    console.log('\nUpdated values:');
    console.log(`MK_PINNED_MSG_ID=${newIds.MK_PINNED_MSG_ID}`);
    console.log(`EP_PINNED_MSG_ID=${newIds.EP_PINNED_MSG_ID}`);
    console.log(`HS_PINNED_MSG_ID=${newIds.HS_PINNED_MSG_ID}`);
    console.log(`AK_PINNED_MSG_ID=${newIds.AK_PINNED_MSG_ID}`);
    console.log('\nYou can now run: npm start');
    
    // Clean up
    await fs.unlink('new-message-ids.json');
    
  } catch (error) {
    console.error('Error updating .env file:', error.message);
    console.log('\nPlease update your .env file manually with the IDs from setup-pins.js output');
  }
}
 
updateEnvFile();
 