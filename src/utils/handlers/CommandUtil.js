import * as fs from 'node:fs';
import { Matchmaking } from '../../Class/Matchmaking.js';

export async function handler(client) {
  client["commands"] = new Map();

  for (const dir of fs.readdirSync('./src/client/commands/')) {
    for (const cmdFile of fs.readdirSync(`./src/client/commands/${dir}/`)) {
      if (!cmdFile.endsWith('js')) continue;

      const cmd = await import(`../../client/commands/${dir}/` + cmdFile);

      if (['name', 'category'].some((key) => cmd.command[key] === undefined))
        return console.error(`Command: ${cmd.default.name} not loaded, missing field`);
      if (cmd.command.category !== dir)
        return console.error(`Command: dir/${cmd.default.name} not loaded, category not match`);

      if (cmd.command.category === "game") {
        cmd.command.matchmaking = new Matchmaking(cmd.command.name, client);
        cmd.command.game = new Map();
      }
      
      client.commands.set(cmd.command.name, cmd.command);

      console.log(`Commande: ${cmd.command.name} loaded!`);
    }
  }
}
