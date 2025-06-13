import { ContainerBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import { MorpionBuilder } from "../../../Class/MorpionBuilder.js";

export const component = {
  name: 'morpion',
  category: 'buttons',
  description: 'Pong!',

  async runInteraction(client, interaction) {
    const message = interaction.message

    if(interaction.user.id !== message.interaction.user.id) return interaction.reply({content: "Ce n'est pas ton jeu !", flags: MessageFlags.Ephemeral});

    const components = message.components[0].components
    const id = Number(components[components.length-1].content.split(":")[1])
    
    let gameMap = client.commands.get(message.interaction.commandName).game

    if(!gameMap.has(id)) return interaction.reply({content: "Ce jeu n'existe plus !", flags: MessageFlags.Ephemeral});

    gameMap = gameMap.get(id)

    const morpion = gameMap.morpion
    const [_, index, player] = interaction.customId.split("_")
    const coup = gameMap.morpion.player[interaction.user.id].id

    if(morpion.tour !== coup) return interaction.reply({content: "Ce n'est pas ton tour !", flags: MessageFlags.Ephemeral});

    if(player) return interaction.reply({content: "Coup impossible !", flags: MessageFlags.Ephemeral});

    const play = morpion.play(coup, Number(index));

    if(play.winner) {
      for(let i=0; i<9; i++) {
        morpion.block(morpion.getPosition(i))
      }
    }

    gameMap.reply(play.components);

    interaction.reply({content: `Coup joué en ${String.fromCharCode(65 + play.position[0]) + (play.position[1] + 1)}!`, flags: MessageFlags.Ephemeral})
  }
};
