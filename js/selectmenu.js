class SelectMenu {
  constructor(messageBox) {
    this.active = false;
    this.monsters = [];
    this.selectedIndex = 0;
    this.messageBox = messageBox;
    this.message = ''
  }

  show(monsters, message) {
    this.active = true;
    this.monsters = monsters;
    this.message = message;
    this.updateMessageBox();
    
  }

  hide() {
    this.active = false;
    this.messageBox.hide();
  }

  draw(ctx) {
    if (!this.active) {
      return;
    }

    ctx.drawImage(this.monsters[this.selectedIndex].image, 320, 240, this.monsters[this.selectedIndex].image.width, this.monsters[this.selectedIndex].image.height);

  }

  updateMessageBox() {
    if (!this.active || !this.messageBox) {
      return;
    }

    let messageText = this.message + '\n';
    this.monsters.forEach((monster, index) => {
      // Add the monster name and highlight the selected monster
      if (index === this.selectedIndex) {
        messageText += '> ';
      } else {
        messageText += '  ';
      }
      if (monster.cost){
        messageText += monster.name;
        messageText += " " + monster.cost;
      } else {
        messageText += monster.name;
      }
      

      // Add a line break if there's more than one monster
      if (index < this.monsters.length - 1) {
        messageText += '\n';
      }
    });

    this.messageBox.show(messageText);
  }

  moveSelection(direction) {
    this.selectedIndex += direction;
    if (this.selectedIndex < 0) {
      this.selectedIndex = this.monsters.length - 1;
    } else if (this.selectedIndex >= this.monsters.length) {
      this.selectedIndex = 0;
    }

    this.updateMessageBox();
  }
}