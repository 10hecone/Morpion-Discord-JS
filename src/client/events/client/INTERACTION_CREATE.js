import { Events, ContainerBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";

export const event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client, data) {
    async function check(interaction) {
      if (!interaction)
      return await data.reply({ embeds: [{ title: 'Error', description: "This interaction doesn't exist!" }]});

      if(interaction.category === "game" & data.type == 2) {
        if(interaction.matchmaking.get(data.user.id)) return await data.reply({ embeds: [{ title: 'Error', description: "Vous etes déjà dans le matchmaking!" }]});

        const container = new ContainerBuilder()
        .addTextDisplayComponents(text => text.setContent("Matchmaking :"))
        .addActionRowComponents(actionRow => actionRow
          .addComponents(new ButtonBuilder().setCustomId("matchmaking").setLabel("En Attente...").setDisabled(true).setStyle(ButtonStyle.Success))
        )

        const message = await data.reply({components: [container], flags: MessageFlags.IsComponentsV2})

        const matchmaking = interaction.matchmaking

        if(matchmaking.size > 0) {
          const [key, value] = matchmaking.entries().next().value;

          matchmaking.delete(key)

          container.components[1].components[0].data.label = "Partie trouvée !"

          value.edit({components: [container], flags: MessageFlags.IsComponentsV2})
          message.edit({components: [container], flags: MessageFlags.IsComponentsV2})

          let i = 3
          const interval = setInterval(() => {
            if(i < 0) {
              interval.close()
              return interaction.runInteraction(client, {1: message, 2: value, reply: (component) => {
                  value.edit({components: [component], flags: MessageFlags.IsComponentsV2})
                  message.edit({components: [component], flags: MessageFlags.IsComponentsV2})
              }});
            }
            
            container.components[1].components[0].data.label = "Lancement dans : " + i
            value.edit({components: [container], flags: MessageFlags.IsComponentsV2})
            message.edit({components: [container], flags: MessageFlags.IsComponentsV2})
            i--
          }, 1000)

          return
        } else return interaction.matchmaking.set(data.user.id, message)
      }
      return interaction.runInteraction(client, data)
      
    }

    switch(data.type) {
      case 2: // Si commandes
         return check(client.commands?.get(data.commandName));
      case 3: // Si boutton
        return check(client.buttons?.get(data.message.interaction.commandName));
      default:
        return check(false)
    }
  }
};
