import { ContainerBuilder, ButtonBuilder, ButtonStyle, MessageFlags, Message, ButtonInteraction, ChatInputCommandInteraction } from "discord.js";

const container = (game, label, exit) => {
    return new ContainerBuilder()
    .addTextDisplayComponents(text => text.setContent("```"+game+" (Matchmaking) :```"))
    .addSeparatorComponents(separator => separator)
    .addActionRowComponents(actionRow => actionRow
        .addComponents(new ButtonBuilder().setCustomId("matchmaking").setLabel(label).setDisabled(true).setStyle(ButtonStyle.Primary))
        .addComponents(new ButtonBuilder().setCustomId("exit_morpion").setLabel("❌ Annuler").setDisabled(exit ? exit : false).setStyle(ButtonStyle.Secondary))
    );
}

const errorEmbed = (error) => {
    return [{ title: 'Message :', description: error}]
}

/**
 * Reply
 *
 * @param {ChatInputCommandInteraction} interaction 
 * @param {unknown} components 
 * @param {boolean} 
 * @returns {Promise<void>} 
 */

const reply = (interaction, components, error) => {
    if(error) {
        return interaction.reply({ embeds: components, flags: MessageFlags.Ephemeral});
    } else {
        return interaction.reply({components: [components], flags: MessageFlags.IsComponentsV2})
    }
}

const edit = (interaction, components) => {
    return interaction.edit({components: [components], flags: MessageFlags.IsComponentsV2})
}
        
export class Matchmaking {
    constructor(game, client) {
        this.game = game;
        this.client = client;

        /** @type {Map<UserId, { message: Message }>} */
        this.waitingUsers = new Map();

        /** @type {Map<UserId, { against: UserId, message: Message }>} */
        this.matchedUsers = new Map();
    }

    /**
    * isInQueue
    * @param {UserId} userId 
    * @return {["waitingUser" || "matchedUsers", Message] | false}
    */

    isInQueue(userId) {
        const waitingUser = this.waitingUsers.get(userId);
        const matchedUser = this.matchedUsers.get(userId);
        if(waitingUser) return ["waitingUsers", waitingUser];
        if(matchedUser) return ["matchedUsers", matchedUser];

        return false;
    }

    isUserWaiting(userId) {
        if (this.waitingUsers.size < 1) return undefined;
        return userId ? this.waitingUsers.get(userId) : this.waitingUsers.entries().next().value;
    }

    start(interactions) {
        const command = this.client.commands.get(this.game);
        command.runInteraction(this.client, {1: interactions[0], 2: interactions[1], reply: (interaction, component) => {
            if(!interaction) {
                interactions[0].edit({components: [component], flags: MessageFlags.IsComponentsV2})
                interactions[1].edit({components: [component], flags: MessageFlags.IsComponentsV2})
                return 
            }

            interaction.update({components: [component], flags: MessageFlags.IsComponentsV2})

            if(interactions[0].interaction.user.id == interaction.user.id) {
                interactions[1].edit({components: [component], flags: MessageFlags.IsComponentsV2})
            } else {
                interactions[0].edit({components: [component], flags: MessageFlags.IsComponentsV2})
            }
        }});
    }

    /**
    * multipleReplyCount
    * @param {[Message, Message]} interactions
    */

    multipleReplyCount(interactions, nbCount, condition, users) {
        function editInteractions(container) {
            for(const interaction of interactions) {
                edit(interaction, container)
            }
        } 
        editInteractions(container("Morpion", "❕ Joueur trouvé !"))

        const interval = setInterval(() => {
            const queue = condition()
            if(queue === false) {
                return interval.close()
            }

            if(nbCount === 0) {
                editInteractions(container("Morpion", "✅ Lancement !", true))
                for(const user of users) {
                    this.matchedUsers.delete(user)
                }
                this.start(interactions)
                return interval.close()
            }
    
            editInteractions(container("Morpion", "⏳ Lancement dans : " + nbCount))

            nbCount -= 1
        }, 1500);
    }

    joinMatched(waitingUser, findingUser) {
        if(!findingUser) return false;

        this.matchedUsers
        .set(waitingUser[0], {against: findingUser[0], message: waitingUser[1].message})
        .set(findingUser[0], {against: waitingUser[0], message: findingUser[1].message})


        this.multipleReplyCount([waitingUser[1].message, findingUser[1].message], 3, () => {
            return this.isInQueue(waitingUser[0]) ? this.isInQueue(findingUser[0]) : false
        }, [waitingUser[0], findingUser[0]])

        this.waitingUsers.delete(findingUser[0])

        return true;
    } 
    

   /**
   * JoinWaiting
   * @param {{ userId: string, data: ChatInputCommandInteraction }} 
   */

    async joinWaiting({userId, data}) {
        if (this.isInQueue(userId)) return reply(data, errorEmbed("Vous etes déjà dans le matchmaking !"), true);

        reply(data, container(this.game, "🕒 En attente d’un joueur..."));

        if(this.joinMatched([userId, {message: await data.fetchReply()}], this.isUserWaiting())) return;
        
        return this.waitingUsers.set(userId, {message: await data.fetchReply()});
    }

  /**
   * Leave
   *
   * @param {ButtonInteraction} interaction 
   * @param {number} userId 
   */

    leave(interaction, userId) {

        /** @type {[string, Message] | undefined} */
        const queue = this.isInQueue(userId)

        if(!queue || interaction.message.id != queue[1].message.id) return reply(interaction, errorEmbed("Ce n'est pas ton interaction !"), true);
    
        if(queue[0] == "waitingUsers") {
            this.waitingUsers.delete(userId)
        } else if (queue[0] == "matchedUsers") {
           
            const idAgainst = this.matchedUsers.get(userId).against
            const against = this.matchedUsers.get(idAgainst)

            // Adversaire
            this.waitingUsers.set(idAgainst, {message: against.message})
            this.matchedUsers.delete(idAgainst)

            
            edit(against.message, container(this.game, "🕒 En attente d’un joueur...."));

            // Joueur
            this.matchedUsers.delete(userId)
        }

        reply(interaction, errorEmbed("Vous avez quitté la file d'attente !"), true)
        queue[1].message.delete();
    }
}