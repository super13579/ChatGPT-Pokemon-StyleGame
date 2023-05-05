// battle.js
class Battle {
  constructor(playerMonsters, enemyMonsters, isWildBattle, npcSrc, price) {
    this.active = false;
    this.transitionProgress = 0;
    this.transitionDuration = 2000; // Duration of the transition effect in milliseconds
    this.activePlayerMonster = playerMonsters[0];
    this.activeEnemyMonster = enemyMonsters[0];
    this.enemyMonsterIndex = 0;
    this.playerMonsterIndex = 0;
    this.playerSprite = new Image();
    this.playerSprite.src = 'assets/images/npc/player.png'; // Replace with the path to your player sprite
    this.enemySprite = new Image();
    this.enemySprite.src = npcSrc; // Replace with the path to your enemy sprite
    this.playerHealth = 100;
    this.enemyHealth = 100;
    this.moveSelected = null;
    this.battleBackground = new Image();
    this.battleBackground.src = 'assets/images/battle-background2.png'; // Replace with the path to your battle background image
    this.actionSelected = 0;
    this.playerMonsters = playerMonsters;
    this.enemyMonsters = enemyMonsters;
    this.meetingTrainer = true;

    this.isWildBattle = isWildBattle;
    this.itemSelected = 0;
    this.skillEffectProgress = null;
    this.skillEffectUpdateCounter = 0;
    this.enemySkillSelected = null;
    this.enemySkillEffectProgress = null;
    this.enemySkillEffectUpdateCounter = 0;
    this.playerMonsterOpacity = 1;
    this.enemyMonsterOpacity = 1;
    this.currentMessage = '';
    this.setNextAlivePlayerMonster();
    this.setNextAliveEnemyMonster();
    this.price = price;
  }

  setNextAlivePlayerMonster() {
    while (this.playerMonsterIndex < this.playerMonsters.length) {
      if (this.playerMonsters[this.playerMonsterIndex].isAlive()) {
        this.activePlayerMonster = this.playerMonsters[this.playerMonsterIndex];
        return;
      }
      this.playerMonsterIndex++;
    }
  }

  setNextAliveEnemyMonster() {
    while (this.enemyMonsterIndex < this.enemyMonsters.length) {
      if (this.enemyMonsters[this.enemyMonsterIndex].isAlive()) {
        this.activeEnemyMonster = this.enemyMonsters[this.enemyMonsterIndex];
        return;
      }
      this.enemyMonsterIndex++;
    }
  }


  start() {
    this.setNextAlivePlayerMonster();
    this.setNextAliveEnemyMonster();
    this.active = true;
    this.meetingTrainer = true;
    this.transitionProgress = 0;
    this.currentMessage = '';
    setTimeout(() => {
      this.transitionProgress = this.transitionDuration;
    }, this.transitionDuration);

  }

  end() {
    this.active = false;
    this.meetingTrainer = true;
    this.moveSelected = null;
    this.skillSelected = 1;
    this.enemyMonsterIndex = 0;
    this.playerMonsterIndex = 0;
    this.currentMessage = '';
    battleAudio.pause();
    battleAudio.currentTime = 0;
    backgroundAudio.play();
    disableMovement = false;
    this.activePlayerMonster.animationafterProgress = false;
    this.activePlayerMonster.animationInProgress = false;
  }

  drawMoveSelection(ctx) {
    if (this.meetingTrainer) {
     this.drawBattleMessage(ctx);
    } else if (this.currentMessage) { // Add this condition to display the current message
      this.drawTextMessage(ctx, this.currentMessage);
    } else {
      // Always draw the right block
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(320, 369, 320, 111);

      ctx.fillStyle = 'black';
      ctx.font = '18px Arial';
      ctx.fillText('Attack', 360, 399);
      ctx.fillText('Monster', 360, 429);
      ctx.fillText('Item', 510, 399);
      ctx.fillText('Escape', 510, 429);

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(320, 369, 320, 111);

      if (this.moveSelected === null) {
        // Highlight the selected action
        ctx.fillStyle = 'blue';
        ctx.font = '18px Arial';
        ctx.fillText('>', 360 + (this.actionSelected % 2) * 150 - 20, 399 + Math.floor(this.actionSelected / 2) * 30);
        
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(0, 369, 320, 111);

        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';
        ctx.fillText('What do you want to do first?', 20, 399);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 369, 320, 111);

      } else if (this.moveSelected === 'attack') {
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(0, 369, 320, 111);

        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';

        // Display the active player monster's skills
        for (let i = 0; i < this.activePlayerMonster.skills.length; i++) {
          ctx.fillText(`${this.activePlayerMonster.skills[i].name}`, 30, 399 + i * 20);
        }

        // Highlight the selected skill
        ctx.fillStyle = 'blue';
        ctx.font = '18px Arial';
        ctx.fillText('>', 5, 399 + (this.skillSelected - 1) * 20);

        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(320, 369, 320, 111);

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        // ctx.drawImage(this.playerMonsters[this.playerMonsterIndex].image, 360, 390, 50, 50);
        ctx.fillText(`Name: ${this.activePlayerMonster.skills[this.skillSelected-1].name}`, 420, 410);
        ctx.fillText(`Damage: ${this.activePlayerMonster.skills[this.skillSelected-1].damage}`, 420, 430);
        ctx.fillText(`Type: ${this.activePlayerMonster.skills[this.skillSelected-1].type}`, 420, 450);
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 369, 320, 111);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(320, 369, 320, 111);

      } else if (this.moveSelected === 'monster') {
        // Show the list of monsters
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(0, 369, 320, 111);

        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';

        // List the player's monsters
        for (let i = 0; i < this.playerMonsters.length; i++) {
          ctx.fillText(`${this.playerMonsters[i].name}`, 20, 399 + i * 30);
        }

        // Highlight the selected monster
        ctx.fillStyle = 'blue';
        ctx.font = '18px Arial';
        ctx.fillText('>', 5, 399 + this.playerMonsterIndex * 30 );

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 369, 320, 111);

        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(320, 369, 320, 111);

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.drawImage(this.playerMonsters[this.playerMonsterIndex].image, 360, 390, 50, 50);
        ctx.fillText(`Name: ${this.playerMonsters[this.playerMonsterIndex].name}`, 420, 410);
        ctx.fillText(`Health: ${this.playerMonsters[this.playerMonsterIndex].currentHealth}/${this.playerMonsters[this.playerMonsterIndex].baseHealth}`, 420, 430);
        ctx.fillText(`Level: ${this.playerMonsters[this.playerMonsterIndex].level}`, 420, 450);
        // ctx.fillText('${this.playerMonsters[i].name}', 360, 399);
        // ctx.fillText('${this.playerMonsters[i].name}', 360, 429);
        // ctx.fillText('Item', 510, 399);
        // ctx.fillText('Escape', 510, 429);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(320, 369, 320, 111);

      } else if (this.moveSelected === 'item') {
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(0, 369, 320, 111);

        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';

        // List the player's bag items
        let i = 0;
        for (const itemName in playerBag.items) {
          ctx.fillText(`${itemName} (${playerBag.items[itemName].quantity})`, 20, 399 + i * 30);
          i++;
        }

        // Highlight the selected item
        ctx.fillStyle = 'blue';
        ctx.font = '18px Arial';
        ctx.fillText('>', 5, 399 + this.itemSelected * 30);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 369, 320, 111);
      }
    }
  }

  draw(ctx) {
    if (!this.active) {
      return;
    }


    // Draw transition effect
    if (this.transitionProgress < this.transitionDuration) {
      ctx.fillStyle = 'black';
      ctx.fillRect(
        0,
        0,
        640 * (this.transitionProgress / this.transitionDuration),
        480
      );
      this.transitionProgress += 16;
      return;
    }

    this.drawBattleMessage(ctx);

    // Draw battle background
    ctx.drawImage(this.battleBackground, 0, 0, 640, 480);
    if (this.activePlayerMonster.animationInProgress && !this.activePlayerMonster.animationafterProgress){
      this.drawTextMessage(ctx, `Something happening in ${this.activePlayerMonster.name} ...`);
    } else if (this.activePlayerMonster.animationInProgress && this.activePlayerMonster.animationafterProgress){
      this.drawTextMessage(ctx, `Evolve to ${this.activePlayerMonster.name}!`);
    } else {
      this.drawMoveSelection(ctx);
    }
    

    if (this.skillEffectProgress !== null) {
      // console.log("Drawing skill effect, progress:", this.skillEffectProgress);
      const selectedSkill = this.activePlayerMonster.skills[this.skillSelected - 1];
      // console.log(selectedSkill)
      selectedSkill.drawEffect(
        ctx,
        110,
        240,
        450,
        240,
        this.skillEffectProgress
      );
    }

    if (this.enemySkillEffectProgress !== null) {
      // console.log("Drawing enemy skill effect, progress:", this.enemySkillEffectProgress);
      const selectedEnemySkill = this.activeEnemyMonster.skills[this.enemySkillSelected];
      selectedEnemySkill.drawEffect(
        ctx,
        450,
        240,
        150,
        240,
        this.enemySkillEffectProgress,
        true
      );
    }

    if (this.meetingTrainer && this.isWildBattle) {
      ctx.drawImage(this.playerSprite, 110, 130, this.playerSprite.width/2, this.playerSprite.height/2);
      ctx.drawImage(this.activeEnemyMonster.image, 400, 175, this.activeEnemyMonster.image.width/2, this.activeEnemyMonster.image.height/2);
    } else if (this.meetingTrainer && !this.isWildBattle) {
      ctx.drawImage(this.playerSprite, 110, 130, this.playerSprite.width/2, this.playerSprite.height/2);
      ctx.drawImage(this.enemySprite, 400, 130, this.enemySprite.width/2, this.enemySprite.height/2);
    } else {
      // Draw active player and enemy monster sprites
      if (this.activeEnemyMonster) {
        ctx.save();
        ctx.globalAlpha = this.playerMonsterOpacity;
        ctx.translate(110 * 2 + 64, 0);
        ctx.scale(-1, 1);
        this.activePlayerMonster.draw(ctx, 60, 175, this.activeEnemyMonster.image.width/2, this.activeEnemyMonster.image.height/2);
        // ctx.drawImage(this.activePlayerMonster.image, 60, 175, this.activeEnemyMonster.image.width/2, this.activeEnemyMonster.image.height/2);
        ctx.restore();

        ctx.globalAlpha = this.enemyMonsterOpacity;
        ctx.drawImage(this.activeEnemyMonster.image, 400, 175, this.activeEnemyMonster.image.width/2, this.activeEnemyMonster.image.height/2);
        ctx.globalAlpha = 1;
      }

      // Draw a block with health bar, monster name, level, experience, and maxExperience above the player monster
      // Draw a block with health bar, monster name, level, and experience above the player monster
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(60, 175-this.activeEnemyMonster.image.height/2+80, 170, 60);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 175-this.activeEnemyMonster.image.height/2+80, 170, 60);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`${this.activePlayerMonster.name} Lv.${this.activePlayerMonster.level}`, 70, 175-this.activeEnemyMonster.image.height/2+80 + 20);
      ctx.fillStyle = 'red';
      ctx.fillRect(70, 175-this.activeEnemyMonster.image.height/2+80 +30, 128 * (this.activePlayerMonster.currentHealth / this.activePlayerMonster.baseHealth), 10);
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(`Exp: ${this.activePlayerMonster.experience}/${this.activePlayerMonster.maxExperience}`, 70, 175-this.activeEnemyMonster.image.height/2+80+55);

      // Draw a block with health bar, monster name, and level above the enemy monster
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(410, 175-this.activeEnemyMonster.image.height/2+80, 170, 60);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(410, 175-this.activeEnemyMonster.image.height/2+80, 170, 60);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`${this.activeEnemyMonster.name} Lv.${this.activeEnemyMonster.level}`, 420, 175-this.activeEnemyMonster.image.height/2+80+20);
      ctx.fillStyle = 'red';
      ctx.fillRect(420, 175-this.activeEnemyMonster.image.height/2+80 +30, 128 * (this.activeEnemyMonster.currentHealth / this.activeEnemyMonster.baseHealth), 10);
    }

    // // Draw health bars
    // ctx.fillStyle = 'red';
    // ctx.fillRect(70, 220, 128 * (this.playerHealth / 100), 10);
    // ctx.fillRect(420, 220, 128 * (this.enemyHealth / 100), 10);

    
    // TODO: Draw the move selection UI
  }

  drawBattleMessage(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255)';
    ctx.fillRect(0, 369, 640, 111);

    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    if (this.meetingTrainer && this.isWildBattle) {
      ctx.fillText(`A wild ${this.activeEnemyMonster.name} appeared!`, 20, 399);
    } else {
      ctx.fillText('Meet trainer', 20, 399);
      }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 369, 640, 111);
  }

  calculateExperienceGain(level, maxHealth) {
    // Example: Calculate experience based on the monster's level and max health
    // You can adjust the formula to control the experience gain
    const levelFactor = 1 + level / 10;
    const healthFactor = maxHealth / 80;
    return Math.floor(50 * levelFactor * healthFactor);
  }

  countDeadMonsters(monsters) {
    return monsters.filter(monster => !monster.isAlive()).length;
  }

  calculateCatchProbability(monster, itemCatchRate) {
    const healthPercentage = monster.currentHealth / monster.baseHealth;
    const levelFactor = Math.min(1, (100 - monster.level) / 50);
    const catchRate = monster.prob;
    const catchProbability = itemCatchRate * catchRate * levelFactor * (2 - healthPercentage);
    return catchProbability;
  }

  drawTextMessage(ctx, message) {
    ctx.fillStyle = 'rgba(255, 255, 255)';
    ctx.fillRect(0, 369, 640, 111);

    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.fillText(message, 20, 399);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 369, 640, 111);
  }
  

  handleInput(input) {
    if (this.meetingTrainer) {
      if (input === ' ') {
        // console.log("tsetsetse")
        this.meetingTrainer = false;
      }
      return;
    }

    if (this.moveSelected === null && !this.currentMessage && !this.activePlayerMonster.animationInProgress) {
        if (input === 'ArrowRight') {
        this.actionSelected = (this.actionSelected + 1) % 4;
      } else if (input === 'ArrowLeft') {
        this.actionSelected = (this.actionSelected + 3) % 4;
      } else if (input === 'ArrowUp') {
        this.actionSelected = (this.actionSelected + 2) % 4;
      } else if (input === 'ArrowDown') {
        this.actionSelected = (this.actionSelected + 2) % 4;
      } else if (input === ' ') {
        // Select the highlighted action
        if (this.actionSelected === 0) {
          this.moveSelected = 'attack';
          this.skillSelected = 1;
        } else if (this.actionSelected === 2) {
          this.moveSelected = 'monster';
          // Handle 'Monster' action selection
        } else if (this.actionSelected === 1) {
          this.moveSelected = 'item';
          // Handle 'Item' action selection
        } else if (this.actionSelected === 3) {
          if (this.isWildBattle){
            this.end();
          } else {
            this.currentMessage = "You can't escape from trainer battle!!"
            setTimeout(() => {
              this.currentMessage = ''; // Clear the message after a delay
            }, 1500);
          }
          // Handle 'Escape' action selection
        }
      }
    } else if (this.moveSelected === 'attack' && !this.currentMessage && !this.activePlayerMonster.animationInProgress) {
      if (input === 'ArrowUp' || input === 'ArrowDown') {
        // Toggle between attack skills
        if (input === 'ArrowUp') {
          if (this.skillSelected !== undefined && this.skillSelected > 1) {
            this.skillSelected = this.skillSelected - 1;
          }
        } else if (input === 'ArrowDown') {
          if (this.skillSelected !== undefined && this.skillSelected < this.activePlayerMonster.skills.length) {
            this.skillSelected = this.skillSelected + 1;
          }
        }
      } else if (input === ' ') {
        hitAudio.currentTime = 0;
        hitAudio.volume = 0.5; // Reset the audio to the beginning
        hitAudio.play();
          // Perform the selected attack
        const selectedSkill = this.activePlayerMonster.skills[this.skillSelected - 1];
        this.skillEffectProgress = 0;
        this.currentMessage = `${this.activePlayerMonster.name} used ${selectedSkill.name}!`; // Add this line to set the attack message
        setTimeout(() => {
          this.currentMessage = ''; // Clear the message after a delay
        }, 2000);
        setTimeout(() => {
          this.skillEffectProgress = null;
        }, 1000);

        const damage = selectedSkill.calculateDamage(
          this.activePlayerMonster.level,
          this.activePlayerMonster.baseHealth,
          this.activeEnemyMonster.type
        );


        if (selectedSkill.effectType === 'enemy') {
          this.activeEnemyMonster.currentHealth -= damage;
          if (this.activeEnemyMonster.currentHealth < 0) {
              this.activeEnemyMonster.currentHealth = 0;
            }


        } else if (selectedSkill.effectType === 'self') {
          this.activePlayerMonster.currentHealth += damage;
          if (this.activePlayerMonster.currentHealth > this.activePlayerMonster.maxHealth) {
            this.activePlayerMonster.currentHealth = this.activePlayerMonster.maxHealth;
          }
        } // Add more effect types here if needed

        this.enemyMonsterOpacity = 0.5
        setTimeout(() => {
          this.enemyMonsterOpacity = 1;
        }, 100);

        if (this.isWildBattle && this.activeEnemyMonster.currentHealth <= 0) {
          const expGain = this.calculateExperienceGain(
            this.activeEnemyMonster.level,
            this.activeEnemyMonster.baseHealth
          );
          this.activePlayerMonster.gainExperience(expGain);
          this.currentMessage = `${this.activeEnemyMonster.name} is out of health, You earn the ${expGain} exp!!`

          setTimeout(() => {
            this.currentMessage = ''; // Clear the message after a delay
            this.end(); 
          }, 1500);
          
          return;

        } else if (!this.isWildBattle && this.activeEnemyMonster.currentHealth <= 0) {
          const expGain = this.calculateExperienceGain(
            this.activeEnemyMonster.level,
            this.activeEnemyMonster.baseHealth
          );
          this.activePlayerMonster.gainExperience(Math.floor(expGain*1.5));
          // this.currentMessage = `${this.activeEnemyMonster.name} is out of health, You earn the ${expGain} exp!! !!`
          // setTimeout(() => {
          //   this.currentMessage = ''; // Clear the message after a delay
          // }, 1000);

          // Change to the next enemy monster
          this.enemyMonsterIndex++;
          

          if (this.enemyMonsterIndex >= this.enemyMonsters.length) {
            // No more enemy monsters, end the battle
            this.currentMessage = `You Win the Battle !!, win ${this.price} coins`
            const interactingNPC = npcs.find(npc => playerIsTouchingNPC(window.player, npc, window.map.startX, window.map.startY));

            // Remove the NPC by its ID
            if (interactingNPC.id === 1) {
              CurrentStage = 1;
            } else if (interactingNPC.id === 2) {
              CurrentStage = 2;
            } else if (interactingNPC.id === 3) {
              CurrentStage = 3;
            } else if (interactingNPC.id === 4) {
              CurrentStage = 4;
            } else if (interactingNPC.id === 5) {
              CurrentStage = 5;
            } 

            playerBag.addAncientCoins(this.price)
            setTimeout(() => {
              this.currentMessage = '';
              this.end(); // Clear the message after a delay
            }, 2000); 
            return;
          } else {
            this.currentMessage = `${this.activeEnemyMonster.name} is out of health, You earn the ${Math.floor(expGain*1.5)} exp, Trainer call ${this.enemyMonsters[this.enemyMonsterIndex].name}!!`
            setTimeout(() => {
              this.currentMessage = ''; // Clear the message after a delay
            }, 1500);


            this.activeEnemyMonster = this.enemyMonsters[this.enemyMonsterIndex];
            this.moveSelected = null;
            return;
          }
        }

        setTimeout(() => {
          hitAudio.currentTime = 0; // Reset the audio to the beginning
          hitAudio.play();
          // Randomly choose a skill from the enemy monster's skills
          this.enemySkillSelected = Math.floor(Math.random() * this.activeEnemyMonster.skills.length);
          const enemySkill = this.activeEnemyMonster.skills[this.enemySkillSelected];

          const enemyDamage = enemySkill.calculateDamage(
            this.activeEnemyMonster.level,
            this.activeEnemyMonster.baseHealth,
            this.activePlayerMonster.type
          );

          this.enemySkillEffectProgress = 0;
          this.currentMessage = `${this.activeEnemyMonster.name} used ${enemySkill.name}!`; // Add this line to set the enemy attack message
          setTimeout(() => {
            this.currentMessage = ''; // Clear the message after a delay
          }, 1000);
          setTimeout(() => {
            this.enemySkillEffectProgress = null;
          }, 1000);

          // Apply the selected skill's effect
          if (enemySkill.effectType === 'enemy') {
            this.activePlayerMonster.currentHealth -= enemyDamage;
            if (this.activePlayerMonster.currentHealth < 0) {
              this.activePlayerMonster.currentHealth = 0;
            }
          } else if (enemySkill.effectType === 'self') {
            this.activeEnemyMonster.currentHealth += enemyDamage;
            if (this.activeEnemyMonster.currentHealth > this.activeEnemyMonster.maxHealth) {
              this.activeEnemyMonster.currentHealth = this.activeEnemyMonster.maxHealth;
            }
          } // Add more effect types here if needed
          this.playerMonsterOpacity = 0.5;
          setTimeout(() => {
            this.playerMonsterOpacity = 1;
          }, 100);

          if (this.activePlayerMonster.currentHealth <= 0) {
            // this.currentMessage = `${this.activePlayerMonster.name} is out of health !!`
            // setTimeout(() => {
            //   this.currentMessage = ''; // Clear the message after a delay
            // }, 2000);
            // Change to the next player monster
            this.playerMonsterIndex++;

            if (this.countDeadMonsters(this.playerMonsters) >= this.playerMonsters.length) {
              // No more player monsters, end the battle
              if (!this.isWildBattle){
                this.currentMessage = `You Loss the Battle !!, you lose ${this.price/2} coins`
                playerBag.removeAncientCoins(this.price/2)
              } else {
                this.currentMessage = `You Loss the Battle !!`
              }
              
              
              setTimeout(() => {
                this.currentMessage = '';
                this.end(); // Clear the message after a delay
              }, 1500);
              // this.end();
            } else {
              const nextAlivePlayerMonster = this.playerMonsters.find(monster => monster.isAlive());
              this.currentMessage = `Go ! ${nextAlivePlayerMonster.name} to fight !!`
              setTimeout(() => {
                this.currentMessage = ''; // Clear the message after a delay
              }, 1500);
              this.activePlayerMonster = nextAlivePlayerMonster;
            }
          }
        }, 1000);
        this.moveSelected = null;
      } else if (input === 'Escape') {
        this.moveSelected = null;
      }
    } else if (input === 'Escape') {
      this.moveSelected = null;
    } else if (this.moveSelected === 'monster') {
      if (input === 'ArrowUp') {
        if (this.playerMonsterIndex > 0) {
          this.playerMonsterIndex--;
        } else {
          this.playerMonsterIndex = this.playerMonsters.length - 1;
        }
      } else if (input === 'ArrowDown') {
        if (this.playerMonsterIndex < this.playerMonsters.length - 1) {
          this.playerMonsterIndex++;
        } else {
          this.playerMonsterIndex = 0;
        }
      } else if (input === ' ') {
        this.activePlayerMonster = this.playerMonsters[this.playerMonsterIndex];
        this.moveSelected = null;
      }
    } else if (this.moveSelected === 'item') {
      if (input === 'ArrowUp') {
        if (this.itemSelected > 0) {
          this.itemSelected--;
        }
      } else if (input === 'ArrowDown') {
        if (this.itemSelected < Object.keys(playerBag.items).length - 1) {
          this.itemSelected++;
        }
      } else if (input === ' ') {
        // Get the selected item name
        const selectedItemName = Object.keys(playerBag.items)[this.itemSelected];
        if (selectedItemName === 'Temple Crystal' && this.isWildBattle) {
          // Calculate the catch probability
          const itemCatchRate = 1; // Adjust this value for different catching items
          const catchProbability = this.calculateCatchProbability(this.activeEnemyMonster, itemCatchRate);
          console.log(catchProbability)
          // const catchProbability = this.activeEnemyMonster.prob; // Adjust this value according to your game balance
          if (Math.random() < catchProbability) {
            // Successfully caught the monster
            if (playerMonsters.length < 6) {
              playerMonsters.push(this.activeEnemyMonster);
            } else {
              computerMonsterStorage.push(this.activeEnemyMonster);
            }
            const target = this.activePlayerMonster;
            playerBag.useItem(selectedItemName, target);
            this.currentMessage = `You Catch the ${this.activeEnemyMonster.name}!!`
              setTimeout(() => {
                this.currentMessage = '';
                this.end(); // Clear the message after a delay
              }, 1000);
            
          } else {
            this.currentMessage = `${this.activeEnemyMonster.name} don't want to join you !!`
              setTimeout(() => {
                this.currentMessage = '';
                return; // Clear the message after a delay
              }, 1000);
              setTimeout(() => {
              hitAudio.currentTime = 0; // Reset the audio to the beginning
              hitAudio.play();
              // Randomly choose a skill from the enemy monster's skills
              this.enemySkillSelected = Math.floor(Math.random() * this.activeEnemyMonster.skills.length);
              const enemySkill = this.activeEnemyMonster.skills[this.enemySkillSelected];

              const enemyDamage = enemySkill.calculateDamage(
                this.activeEnemyMonster.level,
                this.activeEnemyMonster.baseHealth,
                this.activePlayerMonster.type
              );

              this.enemySkillEffectProgress = 0;
              this.currentMessage = `${this.activeEnemyMonster.name} used ${enemySkill.name}!`; // Add this line to set the enemy attack message
              setTimeout(() => {
                this.currentMessage = ''; // Clear the message after a delay
              }, 1000);
              setTimeout(() => {
                this.enemySkillEffectProgress = null;
              }, 1000);

              // Apply the selected skill's effect
              if (enemySkill.effectType === 'enemy') {
                this.activePlayerMonster.currentHealth -= enemyDamage;
                if (this.activePlayerMonster.currentHealth < 0) {
                  this.activePlayerMonster.currentHealth = 0;
                }
              } else if (enemySkill.effectType === 'self') {
                this.activeEnemyMonster.currentHealth += enemyDamage;
                if (this.activeEnemyMonster.currentHealth > this.activeEnemyMonster.maxHealth) {
                  this.activeEnemyMonster.currentHealth = this.activeEnemyMonster.maxHealth;
                }
              } // Add more effect types here if needed
              this.playerMonsterOpacity = 0.5;
              setTimeout(() => {
                this.playerMonsterOpacity = 1;
              }, 100);

              if (this.activePlayerMonster.currentHealth <= 0) {
                // this.currentMessage = `${this.activePlayerMonster.name} is out of health !!`
                // setTimeout(() => {
                //   this.currentMessage = ''; // Clear the message after a delay
                // }, 2000);
                // Change to the next player monster
                this.playerMonsterIndex++;

                if (this.countDeadMonsters(this.playerMonsters) >= this.playerMonsters.length) {
                  // No more player monsters, end the battle
                  this.currentMessage = `You Loss the Battle !!`
                  setTimeout(() => {
                    this.currentMessage = '';
                    this.end(); // Clear the message after a delay
                  }, 1500);
                  // this.end();
                } else {
                  const nextAlivePlayerMonster = this.playerMonsters.find(monster => monster.isAlive());
                  this.currentMessage = `Go ! ${nextAlivePlayerMonster.name} to fight !!`
                  setTimeout(() => {
                    this.currentMessage = ''; // Clear the message after a delay
                  }, 1500);
                  this.activePlayerMonster = nextAlivePlayerMonster;
                }
              }
            }, 1000);

            // Failed to catch the monster
          }
        } else if (selectedItemName === 'Temple Crystal' && !this.isWildBattle){
            this.currentMessage = `You Can't Catch the trainer's Monster !!`
              setTimeout(() => {
                this.currentMessage = '';
                return; // Clear the message after a delay
              }, 1000);
            // Failed to catch the monster
        } else {
        // Handle other items here
        // Example: The player wants to use the item on the active monster
        const target = this.activePlayerMonster;

        // Use the selected item on the target
        playerBag.useItem(selectedItemName, target);
      }

        

        // Reset moveSelected
        this.moveSelected = null;
      } else if (input === 'Escape') {
        this.moveSelected = null;
      }
    }
  }
  
  // end() {
  //   this.active = false;
  //   this.moveSelected = null;
  //   this.skillSelected = 1;
  //   this.playerHealth = 100;
  //   this.enemyHealth = 100;
  // }
}