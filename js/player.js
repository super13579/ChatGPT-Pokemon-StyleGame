// player.js
class Player {

  playerImages = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image(),
  };
  currentFrame = 0;
  currentDirection = 'down';
  frameDuration = 200; // Duration of each frame in ms
  lastFrameUpdate = performance.now();
  constructor() {
    this.image = new Image();
    this.image.src = "assets/images/player-sprite.png";
    this.playerImages.up.src = 'assets/images/player_up.png';
    this.playerImages.down.src = 'assets/images/player_down.png';
    this.playerImages.left.src = 'assets/images/player_left.png';
    this.playerImages.right.src = 'assets/images/player_right.png';
    this.x = 320; // Initial x-coordinate (center of the canvas)
    this.y = 240; // Initial y-coordinate (center of the canvas)
    this.width = 30; // Player sprite width
    this.height = 50; // Player sprite height
  }

  draw(ctx) {
      const centerX = (canvas.width - this.width) / 2;
      const centerY = (canvas.height - this.height) / 2;

      const spriteWidth = this.playerImages[this.currentDirection].width / 4;
      const spriteHeight = this.playerImages[this.currentDirection].height;

      ctx.drawImage(
        this.playerImages[this.currentDirection],
        this.currentFrame * spriteWidth, // Source x position (current frame)
        0, // Source y position
        spriteWidth, // Source width
        spriteHeight, // Source height
        centerX, // Destination x position
        centerY, // Destination y position
        this.width, // Destination width
        this.height, // Destination height
      );
      window.player.updateAnimationFrame();
    }

  move(direction, moveAmount, map) {
      this.currentDirection = direction;
      let newX = this.x;
      let newY = this.y;

      this.isMoving = direction !== '';

      if (direction === "up") {
        newY -= moveAmount;
      } else if (direction === "down") {
        newY += moveAmount;
      } else if (direction === "left") {
        newX -= moveAmount;
      } else if (direction === "right") {
        newX += moveAmount;
      }

      // Calculate the dimensions of each grid cell in the collisionMap
      const cellWidth = map.image.width / collisionMap[0].length;
      const cellHeight = map.image.height / collisionMap.length;

      // Calculate the global x and y coordinates
      const globalX = newX + map.startX;
      const globalY = newY + map.startY;

      // Calculate row and column indices in the collisionMap array based on the global x and y coordinates
      const row = Math.floor(globalY / cellHeight);
      const col = Math.floor(globalX / cellWidth);

      // Check if the new position is within the collision map and if it's not blocked (value 1)
      const canMove =
        row >= 0 &&
        row < collisionMap.length &&
        col >= 0 &&
        col < collisionMap[0].length &&
        collisionMap[row][col] !== 1;

      // Check if the player is within the canvas boundaries and if the position is not blocked
      const withinCanvasBoundaries =
        newX >= 0 &&
        newX <= canvas.width - this.width &&
        newY >= 0 &&
        newY <= canvas.height - this.height &&
        canMove;

      if (withinCanvasBoundaries) {
        if (
          (direction === "up" || direction === "down") &&
          (map.startY > 0 || newY < canvas.height - this.height) &&
          (map.startY < map.image.height - canvas.height || newY > 0)
        ) {
          map.startY += direction === "up" ? -moveAmount : moveAmount;
        } else if (
          (direction === "left" || direction === "right") &&
          (map.startX > 0 || newX < canvas.width - this.width) &&
          (map.startX < map.image.width - canvas.width || newX > 0)
        ) {
          map.startX += direction === "left" ? -moveAmount : moveAmount;
        } else {
          this.x = newX;
          this.y = newY;
        }
      }

      // Limit map boundaries
      map.startX = Math.min(Math.max(0, map.startX), map.image.width - canvas.width);
      map.startY = Math.min(Math.max(0, map.startY), map.image.height - canvas.height);
    }
  updateAnimationFrame() {
  const currentTime = performance.now();
  if (currentTime - this.lastFrameUpdate >= this.frameDuration) {
    this.currentFrame = (this.currentFrame + 1) % 4; // Loop between 0 and 3
    this.lastFrameUpdate = currentTime;
  }
}
}

const player = new Player();
window.player = player;