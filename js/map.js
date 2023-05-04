// map.js
let mapImage = new Image();
mapImage.src = "assets/images/map-background2.png";

let wildAreaTileImage = new Image();
wildAreaTileImage.src = "assets/images/wild-area-tile.png";

function generateWildArea(map, tileImage) {
  for (let y = 0; y < map.image.height; y += map.wildArea.tileHeight) {
    for (let x = 0; x < map.image.width; x += map.wildArea.tileWidth) {
      if (conditionForWildArea(x, y)) {
        map.wildArea.tiles.push({ x, y, image: tileImage });
      }
    }
  }
}

const wildAreasBounds = [
  { x: 765, y: 970, width: 85, height: 350,
   minLevel: 4, maxLevel: 8,
  enemyMonsters: [
  { monster: 12, probability: 0.35 },
  { monster: 13, probability: 0.05 },
  { monster: 14, probability: 0.35 },
  { monster: 15, probability: 0.05 },
  { monster: 16, probability: 0.02 },
  { monster: 17, probability: 0.35 },
  { monster: 22, probability: 0.35 },
  { monster: 23, probability: 0.05 },
] },
  { x: 1195, y: 1323, width: 160, height: 90,
  minLevel: 1, maxLevel: 5,
  enemyMonsters: [
  { monster: 1, probability: 0.05 },
  { monster: 4, probability: 0.05 },
  { monster: 7, probability: 0.05 },
  { monster: 10, probability: 0.5 },
  { monster: 19, probability: 0.3 },
  { monster: 27, probability: 0.3 },
  { monster: 30, probability: 0.1 },
  { monster: 32, probability: 0.2 },
  { monster: 11, probability: 0.02 },
] },
  { x: 1430, y: 1470, width: 240, height: 120,
  minLevel: 4, maxLevel: 10,
  enemyMonsters: [
  { monster: 25, probability: 0.35 },
  { monster: 26, probability: 0.01 },
  { monster: 28, probability: 0.01 },
  { monster: 33, probability: 0.25 },
  { monster: 35, probability: 0.1 },
  { monster: 44, probability: 0.2 },
] }, 
  { x: 945, y: 880, width: 100, height: 100,
  minLevel: 9, maxLevel: 15,
  enemyMonsters: [
  { monster: 42, probability: 0.3 },
  { monster: 43, probability: 0.1 },
  { monster: 21, probability: 0.1 },
  { monster: 31, probability: 0.2 },
  { monster: 34, probability: 0.1 },
  { monster: 2, probability: 0.05 },
  { monster: 5, probability: 0.05 },
  { monster: 8, probability: 0.05 },
] },
  { x: 1460, y: 980, width: 220, height: 80,
  minLevel: 13, maxLevel: 18,
  enemyMonsters: [
  { monster: 35, probability: 0.1 },
  { monster: 36, probability: 0.1 },
  { monster: 37, probability: 0.1 },
  { monster: 38, probability: 0.2 },
  { monster: 39, probability: 0.1 },
  { monster: 45, probability: 0.05 },
] }
  // Add more wild areas here
];

function conditionForWildArea(x, y) {
  // Check if the current position (x, y) is inside any of the wild areas
  return wildAreasBounds.some(bounds => 
    x >= bounds.x && x <= bounds.x + bounds.width &&
    y >= bounds.y && y <= bounds.y + bounds.height
  );
}


mapImage.addEventListener('load', function() {
    const map = {
        image: mapImage,
        startX: 680,
        startY: mapImage.height - 720,
        width: 640,
        height: 480,
        wildArea: {
          tiles: [],
          tileWidth: 20,
          tileHeight: 20,
        },
        draw: function (ctx) {
          ctx.drawImage(this.image, this.startX, this.startY, this.width, this.height, 0, 0, this.width, this.height);
          
          // Draw wild area tiles
          this.wildArea.tiles.forEach(tile => {
            ctx.drawImage(tile.image, tile.x - this.startX, tile.y - this.startY, this.wildArea.tileWidth, this.wildArea.tileHeight);
          });
        },
        move: function (dx, dy) {
		    let newX = this.startX + dx;
		    let newY = this.startY + dy;

		    if (newX >= 0 && newX <= this.image.width - this.width) {
		      this.startX = newX;
		    }

		    if (newY >= 0 && newY <= this.image.height - this.height) {
		      this.startY = newY;
		    }
		  },
    };

    window.map = map;

    generateWildArea(window.map, wildAreaTileImage);
});

wildAreaTileImage.addEventListener("load", function () {
  
});
