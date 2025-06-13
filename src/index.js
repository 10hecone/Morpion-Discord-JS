import { Client, GatewayIntentBits } from 'discord.js';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});


for (const handler of ['EventUtil', 'CommandUtil', 'ComponentsUtil']) {
  await import(`./utils/handlers/${handler}.js`).then((c) => c.handler(client));
}

process.on('exit', (code) => {
  console.log(`EXIT: ${code}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(`UNHANDLED_REJECTION: ${reason} \n`, promise);
});

process.on('uncaughtException', (error) => {
  console.log(error);
});

client.login("");
