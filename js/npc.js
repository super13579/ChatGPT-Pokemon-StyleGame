// npc.js
class NPC {
    constructor(id, src, x, y, width, height, battle, dialog, interactionType, availableMonsters) {
        this.id = id;
        this.image = new Image();
        this.image.src = src;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.battle = battle;
        this.dialog = dialog;
        this.availableMonsters = availableMonsters;
        this.interactionType = interactionType;
    }

    draw(ctx, startX, startY) {
        ctx.drawImage(this.image, this.x - startX, this.y - startY, this.width, this.height);
    }

    giveMonster(selectedIndex, playerMonsters) {
        const selectedMonsterData = this.availableMonsters[selectedIndex];
        const newMonster = new Monster(
          selectedMonsterData.name,
          selectedMonsterData.baseHealth,
          selectedMonsterData.skills,
          selectedMonsterData.imagePath,
          selectedMonsterData.evolveTo,
          selectedMonsterData.evolveLevel
        );
        playerMonsters.push(newMonster);
        // messageBox.show(`You received a ${newMonster.name} from the old man!`);
      }
}