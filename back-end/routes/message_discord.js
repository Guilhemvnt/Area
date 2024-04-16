// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const get_token_gmail = require('./get_token_gmail');
require('dotenv').config();

module.exports = async function message_discord(msg, l) {
    // Create a new client instance
    const token = process.env.DISCORD_TOKEN;
    const client = new Client({ intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,] });

    // When the client is ready, run this code (only once)
    // We use 'c' for the event parameter to keep it separate from the already defined 'client'
    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });
    client.on('messageCreate', async (message) => {
        console.log(`Received message: ${message.content}`);
        if (message.content.startsWith('!draft')) {
            await get_token_gmail();
            message.channel.send("that's done !");
        }
    });

    // Log in to Discord with your client's token
    client.login(token);
}