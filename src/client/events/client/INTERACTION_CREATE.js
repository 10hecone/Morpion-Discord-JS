import { Events, ContainerBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ReactionUserManager } from "discord.js";

export const event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client, data) {
    async function check(interaction) {
      if (!interaction)
      return await data.reply({ embeds: [{ title: 'Error', description: "This interaction doesn't exist!" }]});

      if(interaction.category === "game" & data.type == 2) {
        const matchmaking = interaction.matchmaking

        const user = matchmaking.joinWaiting({userId: data.user.id, data})
        return;
      //   if(interaction.matchmaking.get(data.user.id)) return await data.reply({ embeds: [{ title: 'Error', description: "Vous etes déjà dans le matchmaking !"}], flags: MessageFlags.Ephemeral});

      //   const container = new ContainerBuilder()
      //   .addTextDisplayComponents(text => text.setContent("```Morpion (Matchmaking) :```"))
      //   .addSeparatorComponents(separator => separator)
      //   .addActionRowComponents(actionRow => actionRow
      //     .addComponents(new ButtonBuilder().setCustomId("matchmaking").setLabel("🕒 En attente d’un joueur...").setDisabled(true).setStyle(ButtonStyle.Primary))
      //     .addComponents(new ButtonBuilder().setCustomId("exit_morpion").setLabel("❌ Annuler").setDisabled(false).setStyle(ButtonStyle.Secondary))
      //   )

      //   const message = await data.reply({components: [container], flags: MessageFlags.IsComponentsV2})


      //   if(matchmaking.size > 0) {
      //     const [key, value] = matchmaking.entries().next().value;
      //     const button = container.components[2].components[0].data

      //     matchmaking.delete(key)

      //     button.label = "Partie trouvée !"

      //     value.message.edit({components: [container], flags: MessageFlags.IsComponentsV2})
      //     message.edit({components: [container], flags: MessageFlags.IsComponentsV2})

      //     let i = 3

      //     const interval = setInterval(() => {
      //       if(i < 0) {

      //         button.label = "✅ Lancement !"
      //         interval.close()

      //         return interaction.runInteraction(client, {1: message, 2: value.message, reply: (interaction, component) => {
      //           if(!interaction) {
      //             message.edit({components: [component], flags: MessageFlags.IsComponentsV2})
      //             value.message.edit({components: [component], flags: MessageFlags.IsComponentsV2})
      //             return 
      //           }

      //           interaction.update({components: [component], flags: MessageFlags.IsComponentsV2})

      //           if(value.message.interaction.user.id == interaction.user.id) {
      //             message.edit({components: [component], flags: MessageFlags.IsComponentsV2})
      //           } else {
      //             value.message.edit({components: [component], flags: MessageFlags.IsComponentsV2})
      //           }
      //         }});

      //       } else {
      //         button.label = "⏳ Lancement dans : " + i
      //       }

      //       value.message.edit({components: [container], flags: MessageFlags.IsComponentsV2})
      //       message.edit({components: [container], flags: MessageFlags.IsComponentsV2})
      //       i--
      //     }, 1000)

      //     return
      //   } else return interaction.matchmaking.set(data.user.id, {message: message, hasFind: false, against: undefined})
      // }
      }
      return interaction.runInteraction(client, data)
    }

    switch(data.type) {
      case 2: 
         return check(client.commands?.get(data.commandName));
      case 3: 
        return check(client.buttons?.get(data.message.interaction.commandName));
      default:
        return check(false)
    }
  }
};
