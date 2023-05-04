class Bag {
  constructor() {
    this.items = {};
    this.ancientCoins = 0;
  }

  addAncientCoins(quantity) {
    this.ancientCoins += quantity;
  }

  removeAncientCoins(quantity) {
    if (this.ancientCoins >= quantity) {
      this.ancientCoins -= quantity;
    } else {
      this.ancientCoins = 0;
    }
  }

  addItem(item, quantity) {
    if (!this.items[item.name]) {
      this.items[item.name] = {
        item: item,
        quantity: 0,
      };
    }

    this.items[item.name].quantity += quantity;
  }

  removeItem(item, quantity) {
    if (this.items[item.name] && this.items[item.name].quantity >= quantity) {
      this.items[item.name].quantity -= quantity;

      if (this.items[item.name].quantity === 0) {
        delete this.items[item.name];
      }
    }
  }

  useItem(itemName, target) {
    if (this.items[itemName] && this.items[itemName].quantity > 0) {
      this.items[itemName].item.use(target);
      this.removeItem(this.items[itemName].item, 1);
    }
  }
}
