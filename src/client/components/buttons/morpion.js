import { ContainerBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import { MorpionBuilder } from "../../../Class/MorpionBuilder.js";

export const component = {
  name: 'morpion',
  category: 'buttons',
  description: 'Pong!',

  async runInteraction(client, interaction) {
    const message = interaction.message

    if(interaction.user.id !== message.interaction.user.id) return interaction.reply({content: "Ce n'est pas ton interaction !", flags: MessageFlags.Ephemeral});

    const [type, index, player] = interaction.customId.split("_")
    const commands = client.commands.get(message.interaction.commandName)

    if(type === "exit") {
      commands.matchmaking.leave(interaction, interaction.user.id)
      return;
    }

    const components = message.components[0].components
    let gameMap = commands.game.get(Number(components[components.length-1].content.split(" : ")[1]))

    if(!gameMap) return interaction.reply({content: "Ce jeu n'existe plus !", flags: MessageFlags.Ephemeral});

    const morpion = gameMap.morpion
    const coup = gameMap.morpion.player[interaction.user.id].id

    if(morpion.tour !== coup) return interaction.reply({content: "Ce n'est pas ton tour !", flags: MessageFlags.Ephemeral});

    if(player) return interaction.reply({content: "Coup impossible !", flags: MessageFlags.Ephemeral});

    const play = morpion.play(coup, Number(index));

    if(play.winner) {
      for(let i=0; i<9; i++) {
        morpion.block(morpion.getPosition(i))
      }
    }

    gameMap.reply(interaction, play.components);
  }
};
