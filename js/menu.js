class Menu {
  constructor() {
    this.pages = ['playerMonsters', 'items', 'computerMonsters'];
    this.currentPageIndex = 0;
    this.selectedMonsterIndex = 0;
    this.selectedItemIndex = 0;
    this.selectedCMonsterIndex = 0;
    this.itemSelected = false;
    this.CMonsterSelected = false;
    this.MonsterSelected = false;
    this.tempselectedMonsterIndex = 0
  }

  draw(ctx, playerMonsters, computerMonsters, playerBag) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (this.pages[this.currentPageIndex] === 'playerMonsters') {
      this.drawPlayerMonsters(ctx, playerMonsters);
    } else if (this.pages[this.currentPageIndex] === 'computerMonsters') {
      this.drawComputerMonsters(ctx, computerMonsters);
    } else if (this.pages[this.currentPageIndex] === 'items') {
      this.drawItems(ctx, playerBag);
    }
  }

  drawPlayerMonsters(ctx, playerMonsters) {
    const startY = 100;
    const lineHeight = 40;
    const infoX = ctx.canvas.width / 2;

    ctx.fillStyle = 'blue';
    ctx.font = '30px Arial';
    ctx.fillText(`Player Monster`, 230, 50);


    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';

    playerMonsters.forEach((monster, index) => {
      const y = startY + index * lineHeight;

      // Draw the highlight box
      if (index === this.selectedMonsterIndex) {
        if (this.MonsterSelected){
          ctx.strokeStyle = 'yellow';
          ctx.lineWidth = 2
        } else {
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 2;          
        }
        ctx.strokeRect(10, y - 25, ctx.canvas.width / 2 - 20, lineHeight);
      }

      ctx.fillText(`${monster.name} (Level: ${monster.level})`, 20, y);
    });

    // Draw the selected monster sprite and details
    if (playerMonsters[this.selectedMonsterIndex]) {
      const selectedMonster = playerMonsters[this.selectedMonsterIndex];
      this.drawMonsterSprite(ctx, selectedMonster);

      // Draw type of the monster
      // ctx.fillText(`Type: ${selectedMonster.type}`, infoX, startY + 130);

      // Draw monster's skills
      ctx.fillText('Skills:', infoX, startY + 230);
      selectedMonster.skills.forEach((skill, index) => {
        ctx.fillText(`${index + 1}. ${skill.name}`, infoX, startY + 250 + index * 20);
      });

      // Draw current experience/max experience
      ctx.fillText(`Experience: ${selectedMonster.experience}/${selectedMonster.maxExperience}`, infoX, startY + 270 + selectedMonster.skills.length * 20);
    }
  }

  drawComputerMonsters(ctx, computerMonsters) {
    const startY = 100;
    const lineHeight = 40;
    const infoX = ctx.canvas.width / 2;

    ctx.fillStyle = 'blue';
    ctx.font = '30px Arial';
    ctx.fillText(`Temple Monster`, 230, 50);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';

    computerMonsters.forEach((monster, index) => {
      const y = startY + index * lineHeight;

      // Draw the highlight box
      if (index === this.selectedCMonsterIndex) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, y - 25, ctx.canvas.width / 2 - 20, lineHeight);
      }

      ctx.fillText(`${monster.name} (Level: ${monster.level})`, 20, y);
    });

    // Draw the selected monster sprite and details
    if (computerMonsters[this.selectedCMonsterIndex]) {
      const selectedMonster = computerMonsters[this.selectedCMonsterIndex];
      this.drawMonsterSprite(ctx, selectedMonster);

      // Draw type of the monster
      // ctx.fillText(`Type: ${selectedMonster.type}`, infoX, startY + 130);

      // Draw monster's skills
      ctx.fillText('Skills:', infoX, startY + 230);
      selectedMonster.skills.forEach((skill, index) => {
        ctx.fillText(`${index + 1}. ${skill.name}`, infoX, startY + 250 + index * 20);
      });

      // Draw current experience/max experience
      ctx.fillText(`Experience: ${selectedMonster.experience}/${selectedMonster.maxExperience}`, infoX, startY + 270 + selectedMonster.skills.length * 20);
    }
  }

  drawMonsterSprite(ctx, monster) {
    const spriteX = ctx.canvas.width /2;
    const spriteY = 50;
    const detailsX = ctx.canvas.width /2;

    ctx.drawImage(monster.image, spriteX, spriteY, monster.image.width / 2, monster.image.height / 2);
    ctx.fillText(`Name: ${monster.name}`, detailsX, spriteY + 20 + monster.image.height / 2);
    ctx.fillText(`Health: ${monster.currentHealth}/${monster.baseHealth}`, detailsX, spriteY + 40 + monster.image.height / 2);
    ctx.fillText(`Level: ${monster.level}`, detailsX, spriteY + 60 + monster.image.height / 2);
    ctx.fillText(`Type: ${monster.type}`, detailsX, spriteY + 80 + monster.image.height / 2);
    // ctx.fillText(`Level: ${monster.level}`, detailsX, spriteY + 100 + monster.image.height / 4);
  }

  // drawComputerMonsters(ctx, computerMonsters) {
  //   const startY = 50;
  //   const lineHeight = 40;

  //   ctx.fillStyle = 'black';
  //   ctx.font = '20px Arial';

  //   computerMonsters.forEach((monster, index) => {
  //     const y = startY + index * lineHeight;
  //     ctx.fillText(`${monster.name} (Health: ${monster.currentHealth}/${monster.baseHealth}, Level: ${monster.level})`, ctx.canvas.width / 3, y);
  //   });
  // }

  drawItems(ctx, playerBag) {
    const startY = 100;
    const lineHeight = 40;
    const itemTextX = 30;
    const itemInfoX = ctx.canvas.width / 2;

    ctx.fillStyle = 'blue';
    ctx.font = '30px Arial';
    ctx.fillText(`Items`, 250, 50);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';

    Object.keys(playerBag.items).forEach((itemName, index) => {
      const item = playerBag.items[itemName].item;
      const itemQuantity = playerBag.items[itemName].quantity;
      const y = startY + index * lineHeight;

      // Draw a yellow ">" if the current item is selected
      if (index === this.selectedItemIndex) {
        ctx.fillStyle = 'blue';
        ctx.fillText('>', itemTextX - 20, y);
        ctx.fillStyle = 'black';
      }

      ctx.fillText(`${item.name} (${itemQuantity})`, itemTextX, y);
    });

    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';

    // Draw ancient coins
    const ancientCoinsY = startY + Object.keys(playerBag.items).length * lineHeight;
    ctx.fillText(`Ancient Coins (${playerBag.ancientCoins})`, itemTextX, ancientCoinsY);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    // Draw item information for the selected item
    if (Object.values(playerBag.items)[this.selectedItemIndex]) {
      const selectedItem = Object.values(playerBag.items)[this.selectedItemIndex].item;

      // Load and draw the item sprite
      const itemSprite = new Image();
      itemSprite.src = selectedItem.spriteSrc;
      ctx.drawImage(itemSprite, itemInfoX, startY, 100, 100);


      ctx.fillText('Item information:', itemInfoX, startY + 130);
      ctx.fillText(`${selectedItem.description}`, itemInfoX, startY + 160);
      // ctx.fillText(`Type: ${selectedItem.type}`, itemInfoX, startY + 160);
    } else {
      this.selectedItemIndex = 0;
    }
  }

  navigate(direction) {
    if (this.MonsterSelected || this.CMonsterSelected || this.itemSelected){

    } else {
      if (direction === 'right') {
        this.currentPageIndex = (this.currentPageIndex + 1) % this.pages.length;
      } else if (direction === 'left') {
        this.currentPageIndex = (this.currentPageIndex - 1 + this.pages.length) % this.pages.length;
      }
    }
    
  }
}