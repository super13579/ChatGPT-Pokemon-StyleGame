class Item {
  constructor(name, type, description, effect, spriteSrc, cost) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.effect = effect;
    this.spriteSrc = spriteSrc;
    this.cost = cost;
  }

  use(target) {
    this.effect(target);
  }
}

class AncientCoin {
  constructor(name, description, imagePath) {
    this.name = name;
    this.description = description;
    this.image = new Image();
    this.image.src = imagePath;
  }
}

// Define item types
const ItemType = {
  CATCH_MONSTER: 'catch_monster',
  RECOVER_HEALTH: 'recover_health',
  REVIVE_MONSTER: 'revive_monster',
};

// Define items
const items = {
  catchMonster: new Item(
    'Temple Crystal',
    ItemType.CATCH_MONSTER,
    'Catch a wild monster',
    (target) => {
      // Implement the catch monster effect here
    },
    'assets/images/items/catchMonster.png',
    100
  ),

  recoverHealth: new Item(
    'Recover Health',
    ItemType.RECOVER_HEALTH,
    'Recover health of a monster',
    (target) => {
      const recoverAmount = 50;
      if (target.isAlive()){
        target.currentHealth = Math.min(target.baseHealth, target.currentHealth + recoverAmount);
      }
    },
    'assets/images/items/recoverMonster.png',
    50
  ),

  reviveMonster: new Item(
    'Revive Monster',
    ItemType.REVIVE_MONSTER,
    'Revive a fainted monster',
    (target) => {
      if (target.currentHealth === 0) {
        target.currentHealth = Math.floor(target.baseHealth * 0.5);
      }
    },
    'assets/images/items/reviveMonster.png',
    100
  ),

  ancientCoin: new AncientCoin(
    'Ancient Coin',
    'A rare and valuable ancient coin',
    'assets/images/catchMonster.png'
  ),
};
