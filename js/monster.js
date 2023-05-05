class Monster {
  constructor(name, baseHealth, skills, imagePath, evolveTo, evolveLevel, learnableSkills, type, level, prob) {
    this.name = name;
    this.nowHealth = baseHealth
    this.level = level;
    this.baseHealth = this.calculateBaseHealth(this.level);
    this.currentHealth = this.baseHealth;
    this.skills = skills;
    this.image = new Image();
    this.image.src = imagePath;
    this.evolveTo = evolveTo;
    this.evolveLevel = evolveLevel;
    this.experience = 0;
    this.maxExperience = this.calculateMaxExperience(this.level);
    this.animationInProgress = false;
    this.animationafterProgress = false;
    this.learnableSkills = learnableSkills;
    this.type = type;
    this.prob = prob;
  }

  calculateBaseHealth(level) {
    // Example: Calculate base health based on the current level
    // You can adjust the formula to control the health curve
    return Math.floor(this.nowHealth * (1 + 0.1 * (level - 1)));
  }


  draw(ctx, x, y, width, height) {
    if (this.evolving) {
      const flashFrequency = 10; // Adjust this value to control the speed of the flashing effect
      if (Math.floor(this.evolutionAnimationCounter / flashFrequency) % 2 === 0) {
        ctx.drawImage(this.image, x, y, width, height);
      }
      this.evolutionAnimationCounter++;
      if (this.evolutionAnimationCounter > this.evolutionAnimationDuration) {
        this.evolving = false;
        this.evolutionAnimationCounter = 0;
      } else if (this.evolutionAnimationCounter > this.evolutionAnimationDuration - 500){
        console.log("check it")
        this.evolve();
        ctx.drawImage(this.image, x, y, width, height);
        this.animationafterProgress = true;
      }
    } else {
      ctx.drawImage(this.image, x, y, width, height);
    }
  }


  evolve() {
    if (this.evolveTo !== null && this.level >= this.evolveLevel) {
      const evolvedMonsterData = monsterDictionary[this.evolveTo];
      this.name = evolvedMonsterData.name;
      this.nowHealth = evolvedMonsterData.baseHealth;
      this.baseHealth = this.calculateBaseHealth(this.level);
      this.currentHealth = evolvedMonsterData.baseHealth;
      this.skills = this.skills;
      this.image.src = evolvedMonsterData.imagePath;
      this.evolveTo = evolvedMonsterData.evolveTo;
      this.evolveLevel = evolvedMonsterData.evolveLevel;
      // console.log(`${this.name} has evolved to ${evolvedMonsterData.name}!`);
    }
  }

  async evolveAnimation() {
    this.evolving = true;
    this.evolutionAnimationCounter = 0;
    this.evolutionAnimationDuration = 700; // Adjust this value to control the duration of the animation
    this.animationInProgress = true;

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.evolving) {
          clearInterval(interval);
          resolve();
        }
      }, 1000 / 60); // 60 FPS
    });

    
    this.animationInProgress = false;
    this.animationafterProgress = false;
  }

  gainExperience(exp) {
    this.experience += exp;
    if (this.experience >= this.maxExperience) {
      this.levelUp();
    }
  }

  hasSkill(skillName) {
    return this.skills.some(skill => skill.name === skillName);
  }

  async levelUp() {
    this.level++;
    this.experience = 0;
    this.maxExperience = this.calculateMaxExperience(this.level);
    this.baseHealth = this.calculateBaseHealth(this.level);

    for (const skill of this.learnableSkills) {
      if (skill.level <= this.level) {
        this.learnSkill(skill.skill);
      }
    }

    if (this.evolveTo !== null && this.level >= this.evolveLevel) {
      await this.evolveAnimation();
    }
  }

  learnSkill(newSkill) {
    if (this.hasSkill(newSkill.name)) {
      return;
    }

    if (this.skills.length < 4) {
      this.skills.push(newSkill);
    } else {
      // You can implement a skill selection menu here for the player to choose which skill to replace
      const skillToReplaceIndex = 0; // Replace this with the player's choice
      this.skills[skillToReplaceIndex] = newSkill;
    }
  }

  calculateMaxExperience(level) {
    // Example: Calculate max experience based on the current level
    // You can adjust the formula to control the experience curve
    return Math.floor(50 * Math.pow(level, 1.2));
  }

  isAlive() {
    return this.currentHealth > 0;
  }
}

const skill1 = new Skill('Fireball', 20, 20, 'fire', 'enemy', 'assets/images/skills/fireball.png');
const skill2 = new Skill('Leaf knife', 20, 20, 'grass', 'enemy', 'assets/images/skills/leafknife.png');
const skill3 = new Skill('Thunder Shock', 25, 20, 'electric', 'enemy', 'assets/images/skills/thundershock.png');
const skill4 = new Skill('Bubble', 20, 20, 'water', 'enemy', 'assets/images/skills/bubble.png');
const skill5 = new Skill('SandAttack', 20, 20, 'ground', 'enemy', 'assets/images/skills/sandattack.png');

const skill6 = new Skill('FirePunch', 40, 10, 'fire', 'enemy', 'assets/images/skills/firepunch.png');
const skill7 = new Skill('Razor Leaf', 40, 10, 'grass', 'enemy', 'assets/images/skills/razorleaf.png');
const skill8 = new Skill('Thunder Punch', 40, 5, 'electric', 'enemy', 'assets/images/skills/thunderpunch.png');
const skill9 = new Skill('Water Gun', 40, 8, 'water', 'enemy', 'assets/images/skills/watergun.png');
const skill10 = new Skill('Sand Tomb', 40, 8, 'ground', 'enemy', 'assets/images/skills/sandtomb.png');

const skill11 = new Skill('Flamethrower', 60, 5, 'fire', 'enemy', 'assets/images/skills/flamethrower.png');
const skill12 = new Skill('Leaf Blade', 60, 8, 'grass', 'enemy', 'assets/images/skills/leafblade.png');
const skill13 = new Skill('Thunderbolt', 60, 8, 'electric', 'enemy', 'assets/images/skills/thunderbolt.png');
const skill14 = new Skill('Water Pulse', 60, 8, 'water', 'enemy', 'assets/images/skills/waterpulse.png');
const skill15 = new Skill('Scorching Sands', 60, 5, 'ground', 'enemy', 'assets/images/skills/scorchingsands.png');

const skill16 = new Skill('Blast Burn', 80, 8, 'fire', 'enemy', 'assets/images/skills/blastburn.png');
const skill17 = new Skill('Leaf Storm', 80, 8, 'grass', 'enemy', 'assets/images/skills/leafstorm.png');
const skill18 = new Skill('Thunder', 80, 5, 'electric', 'enemy', 'assets/images/skills/thunder.png');
const skill19 = new Skill('Wave Crash', 80, 8, 'water', 'enemy', 'assets/images/skills/wavecrash.png');
const skill20 = new Skill('Earthquake', 80, 8, 'ground', 'enemy', 'assets/images/skills/earthquake.png');


const monsterDictionary = {
  1: { name: 'GrassDino', baseHealth: 100, skills: [skill2], imagePath: 'assets/images/monster/1.png', evolveTo: 2, evolveLevel: 10, 
  learnableSkills: [{ level: 5, skill: skill7 }], type: 'grass', level: 1, prob: 0.5},
  2: { name: 'GrassRexy', baseHealth: 115, skills: [skill2, skill7], imagePath: 'assets/images/monster/2.png', evolveTo: 3, evolveLevel: 15, 
  learnableSkills: [{ level: 13, skill: skill12 }], type: 'grass', level: 10, prob: 0.2},
  3: { name: 'GrassRex', baseHealth: 125, skills: [skill2, skill7, skill12], imagePath: 'assets/images/monster/3.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 17, skill: skill17 }], type: 'grass' , level: 15, prob: 0.05},

  4: { name: 'FireDino', baseHealth: 100, skills: [skill1], imagePath: 'assets/images/monster/4.png', evolveTo: 5, evolveLevel: 10, 
  learnableSkills: [{ level: 5, skill: skill6 }], type: 'fire' , level: 1, prob: 0.5},
  5: { name: 'FireRexy', baseHealth: 115, skills: [skill1, skill6], imagePath: 'assets/images/monster/5.png', evolveTo: 6, evolveLevel: 15, 
  learnableSkills: [{ level: 13, skill: skill11 }], type: 'fire'  , level: 10, prob: 0.2},
  6: { name: 'FireRex', baseHealth: 125, skills: [skill1, skill6, skill11], imagePath: 'assets/images/monster/6.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 17, skill: skill16 }], type: 'fire'  , level: 15, prob: 0.05},

  7: { name: 'WaterDino', baseHealth: 100, skills: [skill4], imagePath: 'assets/images/monster/7.png', evolveTo: 8, evolveLevel: 10, 
  learnableSkills: [{ level: 5, skill: skill9 }], type: 'water' , level: 1, prob: 0.5},
  8: { name: 'WaterRexy', baseHealth: 115, skills: [skill4, skill9], imagePath: 'assets/images/monster/8.png', evolveTo: 9, evolveLevel: 15, 
  learnableSkills: [{ level: 13, skill: skill14 }], type: 'water' , level: 10, prob: 0.2},
  9: { name: 'WaterRex', baseHealth: 125, skills: [skill4, skill9, skill14], imagePath: 'assets/images/monster/9.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 17, skill: skill19 }], type: 'water' , level: 15, prob: 0.05},

  10: { name: 'GrassBear', baseHealth: 80, skills: [skill2], imagePath: 'assets/images/monster/10.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 7, skill: skill7 }, { level: 15, skill: skill12 }], type: 'grass' , level: 1, prob: 0.5},
  11: { name: 'ForestWolf', baseHealth: 120, skills: [skill2], imagePath: 'assets/images/monster/11.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 5, skill: skill7 }, { level: 12, skill: skill12 }, { level: 17, skill: skill17 }], type: 'grass' , level: 1, prob: 0.1},

  12: { name: 'FireDevil', baseHealth: 80, skills: [skill1], imagePath: 'assets/images/monster/12.png', evolveTo: 13, evolveLevel: 10, 
  learnableSkills: [{ level: 8, skill: skill6 }], type: 'fire' , level: 1, prob: 0.3},
  13: { name: 'FireLord', baseHealth: 110, skills: [skill1, skill6], imagePath: 'assets/images/monster/13.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 15, skill: skill11 }, { level: 17, skill: skill16 }], type: 'fire' , level: 7, prob: 0.1},

  14: { name: 'RockDino', baseHealth: 80, skills: [skill5], imagePath: 'assets/images/monster/14.png', evolveTo: 15, evolveLevel: 13, 
  learnableSkills: [{ level: 8, skill: skill10 }], type: 'ground' , level: 1, prob: 0.5},
  15: { name: 'RockRex', baseHealth: 110, skills: [skill5, skill10], imagePath: 'assets/images/monster/15.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 15, skill: skill15 }, { level: 20, skill: skill20 }], type: 'ground' , level: 1, prob: 0.1},
  16: { name: 'RockRobot', baseHealth: 120, skills: [skill5, skill10], imagePath: 'assets/images/monster/16.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 12, skill: skill15 },{ level: 15, skill: skill20 }], type: 'ground' , level: 1, prob: 0.1},

  17: { name: 'DevilMan', baseHealth: 85, skills: [skill1], imagePath: 'assets/images/monster/17.png', evolveTo: 18, evolveLevel: 8, 
  learnableSkills: [{ level: 6, skill: skill6 }], type: 'fire' , level: 1, prob: 0.35},
  18: { name: 'DevilBatMan', baseHealth: 110, skills: [skill1, skill6], imagePath: 'assets/images/monster/18.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill11 }, { level: 19, skill: skill16 }], type: 'fire' , level: 1, prob: 0.1},

  19: { name: 'FlashWolf', baseHealth: 90, skills: [skill3], imagePath: 'assets/images/monster/19.png', evolveTo: 20, evolveLevel: 10, 
  learnableSkills: [{ level: 11, skill: skill8 }], type: 'thunder' , level: 1, prob: 0.3},
  20: { name: 'ThunderWolf', baseHealth: 115, skills: [skill3, skill8], imagePath: 'assets/images/monster/20.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill13 }, { level: 16, skill: skill18 }], type: 'thunder' , level: 1, prob: 0.1},

  21: { name: 'ThunderRex', baseHealth: 105, skills: [skill3, skill8], imagePath: 'assets/images/monster/21.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill3 }, { level: 18, skill: skill18 }], type: 'thunder' , level: 1, prob: 0.1},
  22: { name: 'FlashCat', baseHealth: 105, skills: [skill3, skill8], imagePath: 'assets/images/monster/22.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill13 }], type: 'thunder' , level: 1, prob: 0.3},

  23: { name: 'ThunderGhost', baseHealth: 100, skills: [skill3], imagePath: 'assets/images/monster/23.png', evolveTo: 24, evolveLevel: 10, 
  learnableSkills: [{ level: 5, skill: skill8 }, { level: 8, skill: skill13 }], type: 'thunder' , level: 1, prob: 0.1},
  24: { name: 'ThunderKing', baseHealth: 120, skills: [skill3, skill8, skill13], imagePath: 'assets/images/monster/24.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill18 }], type: 'thunder' , level: 1, prob: 0.05},

  25: { name: 'FlashFlamer', baseHealth: 105, skills: [skill1, skill3], imagePath: 'assets/images/monster/25.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 8, skill: skill6 }, { level: 10, skill: skill8 }], type: 'thunder' , level: 1, prob: 0.05},
  26: { name: 'WaterDragon', baseHealth: 120, skills: [skill4, skill9], imagePath: 'assets/images/monster/26.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill14 }, { level: 20, skill: skill19 }], type: 'water' , level: 1, prob: 0.05},
  27: { name: 'WaterDouble', baseHealth: 100, skills: [skill4], imagePath: 'assets/images/monster/27.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 7, skill: skill9 }, { level: 10, skill: skill14 }, { level: 13, skill: skill19 }], type: 'water' , level: 1, prob: 0.3}
  ,
  28: { name: 'FireDragon', baseHealth: 120, skills: [skill1, skill6], imagePath: 'assets/images/monster/28.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill11 }, { level: 20, skill: skill16 }], type: 'fire' , level: 1, prob: 0.5},

  29: { name: 'DragonLord', baseHealth: 130, skills: [skill16, skill17,skill18, skill19], imagePath: 'assets/images/monster/29.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill4 }, { level: 10, skill: skill4 }], type: 'none' , level: 15, prob: 0.01},

  30: { name: 'Ghost', baseHealth: 80, skills: [skill5], imagePath: 'assets/images/monster/30.png', evolveTo: 31, evolveLevel: 6, 
  learnableSkills: [{ level: 5, skill: skill10 }], type: 'ground' , level: 1, prob: 0.5},
  31: { name: 'GhostKing', baseHealth: 100, skills: [skill5, skill10], imagePath: 'assets/images/monster/31.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 8, skill: skill15 }, { level: 13, skill: skill20 }], type: 'ground' , level: 1, prob: 0.1},

  32: { name: 'ForestDino', baseHealth: 90, skills: [skill2, skill7], imagePath: 'assets/images/monster/32.png', evolveTo: 33, evolveLevel: 10, 
  learnableSkills: [{ level: 11, skill: skill12 }], type: 'grass' , level: 1, prob: 0.3},
  33: { name: 'ForestDinoKing', baseHealth: 105, skills: [skill2, skill7], imagePath: 'assets/images/monster/33.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 13, skill: skill12 }, { level: 15, skill: skill17 }], type: 'grass' , level: 1, prob: 0.1},

  34: { name: 'ForestDragon', baseHealth: 110, skills: [skill12,skill7], imagePath: 'assets/images/monster/34.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill12 }, { level: 15, skill: skill17 }], type: 'grass' , level: 1, prob: 0.2},
  35: { name: 'WaterShark', baseHealth: 110, skills: [skill4, skill9], imagePath: 'assets/images/monster/35.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill14 }, { level: 15, skill: skill19 }], type: 'water' , level: 1, prob: 0.2},
  36: { name: 'FireFigheter', baseHealth: 110, skills: [skill1, skill6], imagePath: 'assets/images/monster/36.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 10, skill: skill11 }, { level: 15, skill: skill16 }], type: 'fire' , level: 1, prob: 0.2},
  37: { name: 'GroundRex', baseHealth: 110, skills: [skill5, skill10], imagePath: 'assets/images/monster/37.png', evolveTo: null, evolveLevel: null,  
  learnableSkills: [{ level: 10, skill: skill15 }, { level: 15, skill: skill20 }], type: 'ground' , level: 1, prob: 0.2},

  38: { name: 'GroundDino', baseHealth: 100, skills: [skill2, skill5], imagePath: 'assets/images/monster/38.png', evolveTo: 39, evolveLevel: 10, 
  learnableSkills: [{ level: 12, skill: skill4 }, { level: 13, skill: skill10 }], type: 'none' , level: 1, prob: 0.2},
  39: { name: 'GroundDragon', baseHealth: 115, skills: [skill2, skill5, skill7, skill10], imagePath: 'assets/images/monster/39.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 12, skill: skill7 }, { level: 13, skill: skill10 }], type: 'none' , level: 1, prob: 0.08},

  40: { name: 'ThunderRock', baseHealth: 100, skills: [skill3, skill5], imagePath: 'assets/images/monster/40.png', evolveTo: 41, evolveLevel: 10, 
  learnableSkills: [{ level: 12, skill: skill8 }, { level: 13, skill: skill10 }], type: 'none' , level: 1, prob: 0.2},
  41: { name: 'ThunderRocker', baseHealth: 115, skills: [skill3, skill5], imagePath: 'assets/images/monster/41.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 12, skill: skill8 }, { level: 13, skill: skill10 }], type: 'none' , level: 1, prob: 0.08},

  42: { name: 'FireGDino', baseHealth: 100, skills: [skill1, skill5], imagePath: 'assets/images/monster/42.png', evolveTo: 43, evolveLevel: 10, 
  learnableSkills: [{ level: 12, skill: skill6 }, { level: 13, skill: skill9 }], type: 'none' , level: 1, prob: 0.2},
  43: { name: 'FireGGragon', baseHealth: 115, skills: [skill1, skill5], imagePath: 'assets/images/monster/43.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 12, skill: skill6 }, { level: 13, skill: skill9 }], type: 'none' , level: 1, prob: 0.08},
  
  44: { name: 'WaterGDino', baseHealth: 100, skills: [skill4, skill5], imagePath: 'assets/images/monster/44.png', evolveTo: 45, evolveLevel: 10, 
  learnableSkills: [{ level: 12, skill: skill9 }, { level: 13, skill: skill10 }], type: 'none' , level: 1, prob: 0.2},
  45: { name: 'WaterGGragon', baseHealth: 115, skills: [skill4, skill5], imagePath: 'assets/images/monster/45.png', evolveTo: null, evolveLevel: null, 
  learnableSkills: [{ level: 12, skill: skill9 }, { level: 13, skill: skill10 }], type: 'none' , level: 1, prob: 0.08},
  // ...
};