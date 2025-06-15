import { ContainerBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import { MorpionBuilder } from "../../../Class/MorpionBuilder.js";

export const command = {
  name: 'morpion',
  category: 'game',
  description: 'Pong!',

  async runInteraction(client, data) {
    const gameMap = client.commands.get(data[1].interaction.commandName).game

    const game = new MorpionBuilder(gameMap.size+1, {[data[1].interaction.user.id]: {id: 1, user: data[1].interaction.user}, [data[2].interaction.user.id]: {id: 2, user: data[2].interaction.user}})
  
    game.create()
    
    gameMap.set(gameMap.size+1, {morpion: game, message1: data[1], message2: data[2], reply: data.reply})
    
    data.reply(undefined, game.map)
  }
};
