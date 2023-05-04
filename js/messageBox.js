// messageBox.js
class MessageBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.visible = false;
        this.text = '';
    }

    show(text) {
        this.visible = true;
        this.text = text;
    }

    hide() {
        this.visible = false;
    }

    draw(ctx) {
      if (!this.visible) {
        return;
      }

      // Draw message box background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Draw text
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';

      const lines = this.text.split('\n');
      const lineHeight = 20; // Adjust this value to control the spacing between lines
      let textY = this.y + 25;

      lines.forEach(line => {
        ctx.fillText(line, this.x + 10, textY);
        textY += lineHeight;
      });
    }
}