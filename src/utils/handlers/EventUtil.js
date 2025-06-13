import * as fs from 'node:fs';

export async function handler(client) {
  for (const dir of fs.readdirSync('./src/client/events/')) {
    for (const evnFile of fs.readdirSync(`./src/client/events/${dir}/`)) {
      if (!evnFile.endsWith('.js')) continue;

      const event = await import(`../../client/events/${dir}/` + evnFile);
      if (['name', 'execute', 'once'].some((key) => event.event[key] === undefined))
        return console.log(`Event: ${event.event.name} not loaded, missing field`);
      console.log(`Event: ${event.event.name} loaded!`);

      if (event.event['once']) {
        client.once(event.event['name'], (...args) => event.event['execute'](client, ...args));
      } else {
        client.on(event.event['name'], (...args) => event.event['execute'](client, ...args));
      }
    }
  }
}
