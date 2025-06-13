import { ContainerBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";

export class MorpionBuilder {
  constructor(id, player) {
    this.id = id;
    this.player = player;
    this.tour = 1;
    this.map;
    this.buttonMap = [];
  }

  getIndex(x, y) {
    return x * 3 + y;
  }

  getPosition(index) {
    return { x: Math.floor(index / 3), y: index % 3 };
  }

  getPlayerOnPosition(x, y) {
    return this.map.components[x].components[y].data.custom_id.split("_")[2];
  }

  create() {
    const morpionBuilder = new ContainerBuilder();

    for (let x = 0; x < 3; x++) {
      morpionBuilder.addActionRowComponents((actionRow) => actionRow).setId(1);

      for (let y = 0; y < 3; y++) {
        const index = this.getIndex(x, y);

        morpionBuilder.components[x].addComponents(
          new ButtonBuilder()
            .setCustomId("morpion_" + index)
            .setLabel("‎")
            .setStyle(ButtonStyle.Primary)
        );
      }
    }

    morpionBuilder.addActionRowComponents((actionRow) =>
      actionRow.addComponents(
        new ButtonBuilder()
          .setCustomId("coup" + this.id)
          .setLabel(
            "Tour à " +
              Object.values(this.player)[this.tour - 1].user.displayName
          )
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      )
    );
    morpionBuilder.addTextDisplayComponents((text) =>
      text.setContent("Id:" + this.id)
    );
    return (this.map = morpionBuilder);
  }

  hasWinner(player) {
    for (let i = 0; i < 3; i++) {
      if (
        this.getPlayerOnPosition(i, 0) == player &&
        this.getPlayerOnPosition(i, 1) == player &&
        this.getPlayerOnPosition(i, 2) == player
      ) {
        return true;
      }

      if (
        this.getPlayerOnPosition(0, i) == player &&
        this.getPlayerOnPosition(1, i) == player &&
        this.getPlayerOnPosition(2, i) == player
      ) {
        return true;
      }
    }

    if (
      this.getPlayerOnPosition(0, 0) == player &&
      this.getPlayerOnPosition(1, 1) == player &&
      this.getPlayerOnPosition(2, 2) == player
    ) {
      return true;
    }

    if (
      this.getPlayerOnPosition(0, 2) == player &&
      this.getPlayerOnPosition(1, 1) == player &&
      this.getPlayerOnPosition(2, 0) == player
    ) {
      return true;
    }

    return false;
  }

  /**
   * Désactive le bouton (x, y) du tableau
   *
   * @param {Object} position La position dans le tableau
   * @param {number} position.x Position X
   * @param {number} position.y Position Y
   */

  block({ x, y }) {
    this.map.components[x].components[y].data.disabled = true;
  }

    /**
   * Joue le coup
   *
   * @param {1 | 2} player Joueur 1 ou 2 (1: X, 2: O)
   * @param {number} index Index du tableau
   * @return {Object} Le jeu
   */

  play(player, index) {
    const pos = this.getPosition(index);
    const button = this.map.components[pos.x].components[pos.y].data;

    button.custom_id += `_${player}`;
    button.label = player == 1 ? "X" : "O";
    button.disabled = true;

    const winner = this.hasWinner(player);

    this.tour = player == 1 ? 2 : 1;

    this.map.components[
      this.map.components.length - 2
    ].components[0].data.label =
      (winner ? "Partie gagnée par " : "Tour à ") +
      Object.values(this.player)[winner ? player - 1 : this.tour - 1].user
        .displayName;

    return {
      components: this.map,
      winner: winner,
      position: [pos.x, pos.y],
    };
  }
}