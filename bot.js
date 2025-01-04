require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const Evaluator = require('./evaluator');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN);

const evaluator = new Evaluator();

client.on('messageCreate', message => {
    if (message.author.bot) return;
    
    if (message.content.startsWith("/atk")) {
        expression = message.content.slice(1);
        
        try {
            replyMessage = evaluator.evaluate(expression)
            message.reply(replyMessage);

        }
        catch (err) {
            message.reply(err.message);
        }

    } 
});