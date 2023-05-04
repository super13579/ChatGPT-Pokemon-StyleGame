class Skill {
  constructor(name, damage, pp, type, effectType, spriteImagePath) {
    this.name = name;
    this.damage = damage;
    this.pp = pp;
    this.type = type;
    this.effectType = effectType;
    this.spriteImage = new Image();
    this.spriteImage.src = spriteImagePath;
  }

  getTypeMultiplier(attackerType, defenderType) {
    if (attackerType === 'fire' && defenderType === 'grass') {
      return 2;
    } else if (attackerType === 'grass' && defenderType === 'water') {
      return 2;
    } else if (attackerType === 'water' && defenderType === 'fire') {
      return 2;
    } else if (attackerType === 'ground' && defenderType === 'electric') {
      return 2;
    } else if (attackerType === 'electric' && defenderType === 'water') {
      return 2;
    } else if (attackerType === 'water' && defenderType === 'ground') {
      return 2;
    } else {
      return 1;
    }
  }

  calculateDamage(attackerLevel, attackerCurrentHealth, defenderType) {
    // Example: Calculate damage based on the attacker's level and current health
    // You can adjust the formula to control the damage calculation
    const levelFactor = 1 + attackerLevel / 10;
    const healthFactor = attackerCurrentHealth / 100;
    const typeMultiplier = this.getTypeMultiplier(this.type , defenderType)
    return Math.floor(this.damage * levelFactor * healthFactor * typeMultiplier);
  }

  drawEffect(ctx, startX, startY, endX, endY, progress, flip) {
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;

    ctx.save();
    if (flip) {
      ctx.translate(x * 2, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.spriteImage, x, y, 40, 40);
    ctx.restore();
  }
}