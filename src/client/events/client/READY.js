import { REST, Routes, Events } from 'discord.js';

export const event = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const rest = new REST({ version: '10' }).setToken("");
    
    const commands = []

    for (const cmd of client.commands) {
      commands.push({name: cmd[1].name, description: cmd[1].description})
    }
    
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
  }
};
