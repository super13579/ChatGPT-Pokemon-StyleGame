let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let lastRender = 0;

let gameStarted = false;

const backgroundAudio = new Audio('assets/audio/game_background.flac');
backgroundAudio.loop = true; // Enable looping
backgroundAudio.volume = 1; // Set volume to 50%
backgroundAudio.currentTime = 0;

const hitAudio = new Audio('assets/audio/hit.mp3');

const battleAudio = new Audio('assets/audio/battle_background.mp3');

// Set some properties (optional)
battleAudio.loop = true; // Enable looping
battleAudio.volume = 0.5; // Set volume to 50%

const startAudio = new Audio('assets/audio/starter_background.mp3');

// Set some properties (optional)
startAudio.loop = true; // Enable looping
startAudio.volume = 0.5; // Set volume to 50%
startAudio.currentTime = 2;


// Function to play the battle audio
function playBattleAudio() {
  battleAudio.play();
}

const backgroundImage = new Image();
backgroundImage.src = 'assets/images/map-background.png';

let slideshowActive = false;
let slideshowIndex = 0;
const slideshowImages = [
  {src: 'assets/images/slider1.png', text: 'Ancient monsters were once worshipped by the people of the land as deities'},
  {src: 'assets/images/slider2.png', text: 'But over time, they were forgotten and fell into a deep slumber'},
  {src: 'assets/images/slider3.png', text: 'A recent disturbance in the land has awakened these monsters, causing them to wreak havoc throughout the forest.'},
  {src: 'assets/images/slider4.png', text: 'Young adventurer arriving in a small town located in the heart of a vast and mysterious forest'},
  // Add more images here
];

let CurrentStage = 0;
let PreStage = 0;

function drawStartMenu(ctx) {
  // Draw a cycling background

  const backgroundSpeed = 0.05;
  const cycleDuration = 384 / backgroundSpeed;

  const backgroundX = (Date.now() * backgroundSpeed) % (384 * 4);
  const backgroundY = (Date.now() * backgroundSpeed) % (544 * 4);

  let posX = 0;
  let posY = 0;

  if (backgroundX < 384) {
    posX = backgroundX;
  } else if (backgroundX < 384 * 2) {
    posX = 384;
    posY = backgroundX - 384;
  } else if (backgroundX < 384 * 3) {
    posX = 384 * 3 - backgroundX;
    posY = 384;
  } else {
    posX = 0;
    posY = 384 * 4 - backgroundX;
  }

  ctx.drawImage(backgroundImage, posX, posY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(0, 0, 640, 480);

  // Draw the "START" text in the middle of the canvas
  ctx.fillStyle = 'Black';
  ctx.font = '30px Arial';
  ctx.fillText('Press ENTER to start', canvas.width / 2 - 150, canvas.height / 2);

  // Draw the "START" text in the middle of the canvas
  ctx.fillStyle = 'Black';
  ctx.font = '48px Arial';
  ctx.fillText('Ancient Monster', canvas.width / 2 - 170, canvas.height / 2-60);

}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

let zoomFactor = 1;
const zoomSpeed = 0.00005; // Adjust this value to control the speed of the zoom-in animation

async function drawSlideshow(ctx) {
  if (slideshowIndex >= slideshowImages.length) {
    slideshowActive = false;
    gameStarted = true;
    startAudio.pause();
    backgroundAudio.play();
    return;
  }

  const img = await loadImage(slideshowImages[slideshowIndex].src);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const scaleFactor = zoomFactor;
  const scaledWidth = canvas.width * scaleFactor;
  const scaledHeight = canvas.height * scaleFactor;
  ctx.drawImage(img, (canvas.width - scaledWidth) / 2, (canvas.height - scaledHeight) / 2, scaledWidth, scaledHeight);
  zoomFactor += zoomSpeed;

  // Draw text background box
  const textBackgroundHeight = 120; // Adjust this value to control the height of the text background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, canvas.height - textBackgroundHeight, canvas.width, textBackgroundHeight);

  // Draw text
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';

  const text = slideshowImages[slideshowIndex].text;
  const maxLineLength = 55;
  const lines = [];

  for (let i = 0, j = text.length; i < j; i += maxLineLength) {
    const line = text.substr(i, maxLineLength);
    lines.push(line);
  }

  const lineHeight = 35; // Adjust this value to control the spacing between lines
  let yPosition = canvas.height - 30 - (lines.length - 1) * lineHeight;

  lines.forEach((line, index) => {
    ctx.fillText(line, 10, yPosition + index * lineHeight);
  });
}

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastRender;
    lastRender = timestamp;

    update(deltaTime);
    draw(ctx);

    requestAnimationFrame(gameLoop);
    // Draw the collision map
    // drawCollisionMap(ctx, window.map);
    // window.player.updateAnimationFrame();
}

let keysPressed = {};
let wildBattle = null;
let disableMovement = false;
let computerMonsterStorage = [];
let mainMenuActive = false;

// main.js
function handleKeyDown(event) {
  keysPressed[event.key] = true;

  if (monsterSelectionMenu.active) {
      if (event.key === 'ArrowUp') {
        monsterSelectionMenu.moveSelection(-1);
      } else if (event.key === 'ArrowDown') {
        monsterSelectionMenu.moveSelection(1);
      } else if (event.key === ' ') {
        // onSelect callback should be defined where you called showMonsterSelectionMenu
        // monsterSelectionMenu.onSelect(monsterSelectionMenu.monsters[monsterSelectionMenu.selectedIndex]);
        // console.log(monsterSelectionMenu.monsters[monsterSelectionMenu.selectedIndex])
        // newMonster = createMonsterFromDictionary(monsterSelectionMenu.monsters[monsterSelectionMenu.selectedIndex]);
        playerMonsters.push(monsterSelectionMenu.monsters[monsterSelectionMenu.selectedIndex]);
        const interactingNPC = npcs.find(npc => playerIsTouchingNPC(window.player, npc, window.map.startX, window.map.startY));

        // Remove the NPC by its ID
        if (interactingNPC) {
          npcs = npcs.filter(npc => npc.id !== interactingNPC.id);
        }
        npcs.push(battlenpc1)
        npcs.push(firegym)
        monsterSelectionMenu.hide();
        messageBox.show(`You received a ${monsterSelectionMenu.monsters[monsterSelectionMenu.selectedIndex].name} from the old man!`);
      }
      return
    }

  if (itemSelectionMenu.active) {
      if (event.key === 'ArrowUp') {
        itemSelectionMenu.moveSelection(-1);
      } else if (event.key === 'ArrowDown') {
        itemSelectionMenu.moveSelection(1);
      } else if (event.key === ' ' & messageBox.text != "You don't have enough money") {
        console.log(playerBag.ancientCoins)
        // onSelect callback should be defined where you called showMonsterSelectionMenu
        if (playerBag.ancientCoins < itemSelectionMenu.monsters[itemSelectionMenu.selectedIndex].cost){
            messageBox.show("You don't have enough money")
        } else {
            playerBag.removeAncientCoins(itemSelectionMenu.monsters[itemSelectionMenu.selectedIndex].cost)
            playerBag.addItem(itemSelectionMenu.monsters[itemSelectionMenu.selectedIndex],1);
        }

      } else if (event.key === 'Escape'){
        itemSelectionMenu.hide();
      } else if (event.key === ' ' & messageBox.text === "You don't have enough money"){
        itemSelectionMenu.updateMessageBox();
      }
      return
    }

  if (!gameStarted && event.key === 'Enter') {
    slideshowActive = true;
    startAudio.play();
    return;
  }
  if (slideshowActive && !gameStarted && event.key === ' ') {
    zoomFactor = 1;
    slideshowIndex++;
    return
  }

  if (wildBattle && wildBattle.active) {
    wildBattle.handleInput(event.key);
  } else {
  let activeBattle = null;

  npcs.forEach((npc) => {
    if (npc.battle.active) {
      activeBattle = npc.battle;
    }
  });

    if (event.key === 'm' && !activeBattle) {
        mainMenuActive = !mainMenuActive;
        menu.itemSelected = false;
        menu.CMonsterSelected = false;
        menu.MonsterSelected = false;
    } else {    

  if (mainMenuActive){
    if (event.key === 'ArrowRight') {
        menu.navigate('right');
      } else if (event.key === 'ArrowLeft') {
        menu.navigate('left');
      } else if (menu.pages[menu.currentPageIndex] === 'playerMonsters') {
        if (event.key === 'ArrowUp') {
          menu.selectedMonsterIndex = (menu.selectedMonsterIndex - 1 + playerMonsters.length) % playerMonsters.length;
        } else if (event.key === 'ArrowDown') {
          menu.selectedMonsterIndex = (menu.selectedMonsterIndex + 1) % playerMonsters.length;
        } else if (event.key === ' ' && menu.itemSelected) {
            const selectedItem = Object.values(playerBag.items)[menu.selectedItemIndex].item;
            const targetMonster = playerMonsters[menu.selectedMonsterIndex];
            playerBag.useItem(selectedItem.name, targetMonster);
            menu.currentPageIndex = 1; // Switch back to items page after using the item
            menu.itemSelected = false;
        } else if (event.key === ' ' && menu.CMonsterSelected) {
            const selectedPlayerMonster = playerMonsters[menu.selectedMonsterIndex];
            const selectedComputerMonster = computerMonsterStorage[menu.selectedCMonsterIndex];

              // Swap the selected player monster and computer monster
            playerMonsters[menu.selectedMonsterIndex] = selectedComputerMonster;
            computerMonsterStorage[menu.selectedCMonsterIndex] = selectedPlayerMonster;
            menu.currentPageIndex = 2; // Switch back to items page after using the item
            menu.CMonsterSelected = false;
        } else if (event.key === ' ' && !menu.MonsterSelected && playerMonsters.length != 0){
            menu.MonsterSelected = true;
            menu.tempselectedMonsterIndex = menu.selectedMonsterIndex;
        } else if (event.key === ' ' && menu.MonsterSelected && playerMonsters.length != 0){
            const temp = playerMonsters[menu.selectedMonsterIndex];
            const temp2 = playerMonsters[menu.tempselectedMonsterIndex];
            playerMonsters[menu.selectedMonsterIndex] = temp2;
            playerMonsters[menu.tempselectedMonsterIndex] = temp;
            menu.MonsterSelected = false;
          } else if (event.key === 'Escape' && menu.CMonsterSelected) {
            menu.CMonsterSelected = false;
            menu.currentPageIndex = 2;
          } else if (event.key === 'Escape' && menu.itemSelected) {
            menu.itemSelected = false;
            menu.currentPageIndex = 1;
          }
      } else if (menu.pages[menu.currentPageIndex] === 'items') {
        if (event.key === 'ArrowUp') {
          menu.selectedItemIndex = Math.max(0, menu.selectedItemIndex - 1);
        } else if (event.key === 'ArrowDown') {
          menu.selectedItemIndex = Math.min(Object.keys(playerBag.items).length - 1, menu.selectedItemIndex + 1);
        } else if (event.key === ' ' && playerMonsters.length != 0) {
            const selectedItem = Object.values(playerBag.items)[menu.selectedItemIndex].item;
            if (selectedItem.type === ItemType.RECOVER_HEALTH || selectedItem.type === ItemType.REVIVE_MONSTER) {
              menu.currentPageIndex = 0;
              menu.itemSelected = true;
            }
          }
      } else if (menu.pages[menu.currentPageIndex] === 'computerMonsters') {
        if (event.key === 'ArrowUp') {
          menu.selectedCMonsterIndex = (menu.selectedCMonsterIndex - 1 + computerMonsterStorage.length) % computerMonsterStorage.length;
        } else if (event.key === 'ArrowDown') {
          menu.selectedCMonsterIndex = (menu.selectedCMonsterIndex + 1) % computerMonsterStorage.length;
        } else if (event.key === ' ' && computerMonsterStorage.length != 0) {
          // const selectedPlayerMonster = playerMonsters[menu.selectedMonsterIndex];
          // const selectedComputerMonster = computerMonsters[menu.selectedComputerMonsterIndex];
          menu.currentPageIndex = 0;
          menu.CMonsterSelected = true;

        }
      }
  } else {

  if (activeBattle) {
    activeBattle.handleInput(event.key);
  } else if (!disableMovement && !activeBattle && gameStarted &&!monsterSelectionMenu.active &&!itemSelectionMenu.active) {
    if (event.key === ' ' && window.map) {
      let interacting = false;
      npcs.forEach(npc => {
        if (playerIsTouchingNPC(window.player, npc, window.map.startX, window.map.startY)) {
          interacting = true;
          disableMovement = true;
          const interactingNPC = npcs.find(npc => playerIsTouchingNPC(window.player, npc, window.map.startX, window.map.startY));

          switch (npc.interactionType) {
            case 'battle':
                // Handle battle interaction
                messageBox.show(`${npc.dialog}`);
                backgroundAudio.pause()
                playBattleAudio();
                setTimeout(() => {
                    messageBox.hide();
                    // disableMovement = false;
                    if (areAllPlayerMonstersDead(playerMonsters)) {
                        messageBox.show('All your monsters are dead! You cannot start a battle.');
                        battleAudio.pause();
                        battleAudio.currentTime = 0;
                        backgroundAudio.play();
                        setTimeout(() =>{
                            messageBox.hide();
                            disableMovement = false;
                        }, 1000)
                      } else if (areAllPlayerMonstersDead(npc.battle.enemyMonsters)) {
                        // playBattleAudio();
                        messageBox.show('I lose, keep going! bro');
                        battleAudio.pause();
                        battleAudio.currentTime = 0;
                        backgroundAudio.play();
                        setTimeout(() =>{
                            messageBox.hide();
                            disableMovement = false;
                        }, 1000)
                        
                      } else {
                        npc.battle.start();
                      }
                // npc.battle.start();
                    }, 1000);
              // ...
              break;

            case 'battle_nolimit':
                // Handle battle interaction
                messageBox.show(`${npc.dialog}`);
                backgroundAudio.pause()
                playBattleAudio();
                const enemyMonsters = generateRandomEnemyMonsters();

                setTimeout(() => {
                    messageBox.hide();
                    // disableMovement = false;
                    if (areAllPlayerMonstersDead(playerMonsters)) {
                        messageBox.show('All your monsters are dead! You cannot start a battle.');
                        battleAudio.pause();
                        battleAudio.currentTime = 0;
                        backgroundAudio.play();
                        setTimeout(() =>{
                            messageBox.hide();
                            disableMovement = false;
                        }, 1000)
                      } else {
                        wildBattle = new Battle(playerMonsters, enemyMonsters, false, 'assets/images/npc/battle1.png', 1000 );
                        wildBattle.start();
                      }
                // npc.battle.start();
                    }, 1000);
              // ...
              break;

            case 'dialog':
                messageBox.show(`${npc.dialog}`);
                setTimeout(() => {
                    messageBox.hide();
                    disableMovement = false;
                // npc.battle.start();
                }, 1000);

              break;

            case 'give_monster':
              // Handle giving monster interaction
              monsterSelectionMenu.show(npc.availableMonsters, npc.dialog);
              disableMovement = false;

              // showMonsterSelectionMenu(npc.availableMonsters, (selectedIndex) => {
              //   npc.giveMonster(selectedIndex, playerMonsters);
              // });
              // ...
              break;

             case 'lucky_summon':
                messageBox.show(`${npc.dialog}`);
                setTimeout(() => {
                  messageBox.hide();
                  if (playerBag.ancientCoins>= 500){
                    const summonedMonster = summonMonsterByProbability();
                    messageBox.show(`You summoned a ${summonedMonster.name}!`);
                    playerBag.removeAncientCoins(500);
                    if (playerMonsters.length < 6) {
                        playerMonsters.push(summonedMonster);
                      } else {
                        computerMonsterStorage.push(summonedMonster);
                      }
                  } else {
                    messageBox.show(`You don't have enough coins!`);
                  }
                  

                  setTimeout(() => {
                    messageBox.hide();
                    disableMovement = false;
                  }, 1000);
                }, 1000);
                break;

            case 'buy_items':
              // Handle buying items interaction
                itemSelectionMenu.show(npc.availableMonsters, npc.dialog);
                disableMovement = false;
              // ...
              break;

            case 'heal_monsters':
              messageBox.show(`${npc.dialog}`);
              setTimeout(() => {
                healAllPlayerMonsters(playerMonsters);
                messageBox.hide();
                messageBox.show('All your monsters have been healed!');
                setTimeout(() => {
                  messageBox.hide();
                  disableMovement = false;
                }, 1000);
              }, 1000);
              break;

            default:
              console.log('Unknown interaction type:', npc.interactionType);
          }

          // disableMovement = false;
        }
      });

      if (!interacting) {
        messageBox.hide();
      }
      
    } else if (playerIsInWildArea(window.player, window.map)) {
      // const encounterProbability = 0.05; // 10% chance of encountering a wild monster
      const encounterProbability = 0.05; // 5% chance of encountering a wild monster
      if (Math.random() < encounterProbability) {
        const wildArea = playerIsInWildArea(window.player, window.map);
        const randomEnemy = getRandomMonsterByProbability(wildArea.enemyMonsters);
        const randomLevel = Math.floor(Math.random() * (wildArea.maxLevel - wildArea.minLevel + 1)) + wildArea.minLevel;

        disableMovement = true;
        messageBox.show('A wild monster appeared!');
        backgroundAudio.pause()
        playBattleAudio();
        setTimeout(() => {
          messageBox.hide();
          // disableMovement = false;
          if (areAllPlayerMonstersDead(playerMonsters)) {
            messageBox.show('All your monsters are dead! You cannot start a battle.');
            battleAudio.pause();
            battleAudio.currentTime = 0;
            backgroundAudio.play();
            setTimeout(() =>{
                messageBox.hide();
            }, 1000)
            disableMovement = false;
          } else {
              // Start a wild monster battle here
              const enemyMonsters = [createMonsterFromDictionary(randomEnemy, randomLevel, true)]; // You can replace this with actual enemy monster instances
              wildBattle = new Battle(playerMonsters, enemyMonsters, true);
              wildBattle.start();
              // battle.start();
      }
        }, 1000);
      }
    }
  }
}
}
}

}

function generateRandomEnemyMonsters() {
  const levelRange = getPlayerMonsterLevelRange();
  const numEnemyMonsters = Math.floor(Math.random() * 6) + 1; // Generate a random number of monsters between 1 and 6

  let enemyMonsters = [];

  for (let i = 0; i < numEnemyMonsters; i++) {
    const randomMonsterID = getRandomMonsterByProbability(enemyMonsters_list);
    const randomLevel = Math.floor(Math.random() * (levelRange.maxLevel - levelRange.minLevel + 1)) + levelRange.minLevel - 1;
    const randomEnemyMonster = createMonsterFromDictionary(randomMonsterID, randomLevel, false);
    enemyMonsters.push(randomEnemyMonster);
  }

  return enemyMonsters;
}

function getRandomMonsterByProbability(monsters) {
  const totalProbability = monsters.reduce((sum, monster) => sum + monster.probability, 0);
  const randomNumber = Math.random() * totalProbability;

  let accumulatedProbability = 0;
  for (const monsterData of monsters) {
    accumulatedProbability += monsterData.probability;
    if (randomNumber <= accumulatedProbability) {
      return monsterData.monster;
    }
  }

  return null;
}

function getPlayerMonsterLevelRange() {
  if (playerMonsters.length === 0) {
    return {
      maxLevel: null,
      minLevel: null,
    };
  }

  let maxLevel = playerMonsters[0].level;
  let minLevel = playerMonsters[0].level;

  for (const monster of playerMonsters) {
    if (monster.level > maxLevel) {
      maxLevel = monster.level;
    }

    if (monster.level < minLevel) {
      minLevel = monster.level;
    }
  }

  return {
    maxLevel: maxLevel,
    minLevel: minLevel,
  };
}

function healAllPlayerMonsters(monsters) {
  monsters.forEach(monster => {
    monster.currentHealth = monster.baseHealth;
  });
}

function handleKeyUp(event) {
    delete keysPressed[event.key];
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// main.js
function update(deltaTime) {
  if (!window.map || !window.player || disableMovement || mainMenuActive) {
    return;
  }
  if (PreStage === 0 && CurrentStage ===1){
    npcs.push(grassgym);
    PreStage = 1;
  } else if (PreStage === 1 && CurrentStage ===2){
    npcs.push(watergym);
    PreStage = 2;
  } else if (PreStage === 2 && CurrentStage ===3){
    npcs.push(thundergym);
    PreStage = 3;
  } else if (PreStage === 3 && CurrentStage ===4){
    npcs.push(groundgym);
    PreStage = 4;
  } else if (PreStage === 4 && CurrentStage ===5){
    npcs.push(lord);
    PreStage = 5;
  }

  const activeBattle = (wildBattle && wildBattle.active) ||
    npcs.some((npc) => npc.battle.active);


  if (!activeBattle && !messageBox.visible) {
      const moveSpeed = 100; // Pixels per second
      const moveAmount = moveSpeed * (deltaTime / 1000);
        
      if (keysPressed['ArrowUp']) {
        window.player.move("up", moveAmount, window.map);
      }
      if (keysPressed['ArrowDown']) {
        window.player.move("down", moveAmount, window.map);
      }
      if (keysPressed['ArrowLeft']) {
        window.player.move("left", moveAmount, window.map);
      }
      if (keysPressed['ArrowRight']) {
        window.player.move("right", moveAmount, window.map);
      }
    }

}

function summonMonsterByProbability() {
  const sumProbabilities = Object.values(monsterDictionary).reduce((sum, monster) => sum + monster.prob, 0);
  const randomValue = Math.random() * sumProbabilities;
  let currentSum = 0;

  for (const monsterId in monsterDictionary) {
    currentSum += monsterDictionary[monsterId].prob;
    if (randomValue <= currentSum) {
      return createMonsterFromDictionary(monsterId, 1); // Set the level to 1 or any other value as needed
    }
  }
}

function hasActiveBattle() {
  if (wildBattle && wildBattle.active) {
    return true;
  }

  for (const npc of npcs) {
    if (npc.battle.active) {
      return true;
    }
  }

  return false;
}

function areAllPlayerMonstersDead(playerMonsters) {
  for (let monster of playerMonsters) {
    if (monster.isAlive()) {
      return false;
    }
  }
  return true;
}

const FireGymMonsters = [
  new createMonsterFromDictionary(4, 2, false),
  new createMonsterFromDictionary(36, 4, false),
  new createMonsterFromDictionary(5, 4, false),
  new createMonsterFromDictionary(13, 5, false),
  // ...
];

const GrassGymMonsters = [
  new createMonsterFromDictionary(1, 5, false),
  new createMonsterFromDictionary(10, 6, false),
  new createMonsterFromDictionary(34, 6, false),
  new createMonsterFromDictionary(33, 7, false),
  new createMonsterFromDictionary(11, 7, false),
  // ...
];

const WaterGymMonsters = [
  new createMonsterFromDictionary(8, 7, false),
  new createMonsterFromDictionary(27, 7, false),
  new createMonsterFromDictionary(44, 8, false),
  new createMonsterFromDictionary(35, 9, false),
  new createMonsterFromDictionary(26, 9, false),
];


const ThunderGymMonsters = [
  new createMonsterFromDictionary(22, 9, false),
  new createMonsterFromDictionary(25, 9, false),
  new createMonsterFromDictionary(20, 11, false),
  new createMonsterFromDictionary(24, 11, false),
  // ...
];

const GroundGymMonsters = [
  new createMonsterFromDictionary(15, 11, false),
  new createMonsterFromDictionary(31, 11, false),
  new createMonsterFromDictionary(37, 13, false),
  new createMonsterFromDictionary(39, 13, false),
  new createMonsterFromDictionary(43, 14, false),
  new createMonsterFromDictionary(16, 14, false),
];

const enemyMonsters_list =[
  { monster: 10, probability: 0.5 },  { monster: 12, probability: 0.5 },
  { monster: 14, probability: 0.5 },  { monster: 17, probability: 0.5 },  { monster: 19, probability: 0.5 },
  { monster: 23, probability: 0.5 },  { monster: 30, probability: 0.5 },  { monster: 31, probability: 0.5 },
  { monster: 32, probability: 0.5 },  { monster: 38, probability: 0.5 },  { monster: 40, probability: 0.5 },
  { monster: 42, probability: 0.5 },  { monster: 44, probability: 0.5 }]

const enemy2Monsters =[
  { monster: 14, probability: 0.5 },
  { monster: 18, probability: 0.05 },
]

const npc1Monsters = [
  new createMonsterFromDictionary(4, 2),
  new createMonsterFromDictionary(1, 1),
  // ...
];

const npc2Monsters = [
  new createMonsterFromDictionary(4, 2),
  new createMonsterFromDictionary(1, 1),
  // ...
];

const LordMonsters = [
  new createMonsterFromDictionary(29, 20),
  // ...
];

const playerMonsters = [
];


const firegymBattle = new Battle(playerMonsters, FireGymMonsters, false, 'assets/images/npc/fire_gym.png', 1000);
const grassgymBattle = new Battle(playerMonsters, GrassGymMonsters, false, 'assets/images/npc/grass_gym.png', 2000);
const watergymBattle = new Battle(playerMonsters, WaterGymMonsters, false, 'assets/images/npc/water_gym.png', 3000);
const thundergymBattle = new Battle(playerMonsters, ThunderGymMonsters, false, 'assets/images/npc/thunder_gym.png', 4000);
const groundgymBattle = new Battle(playerMonsters, GroundGymMonsters, false, 'assets/images/npc/ground_gym.png', 5000);
const LordBattle = new Battle(playerMonsters, LordMonsters, true, 'assets/images/monster/29.png', 0);
const npc1Battle = new Battle(playerMonsters, npc1Monsters, false, 'assets/images/npc/battle1.png', 1000);
const npc2Battle = new Battle(playerMonsters, npc2Monsters, false, 'assets/images/npc/battle2.png', 1000);


const firegym = new NPC(1,'assets/images/npc-sprite.png', 1257, 1261, 30, 50, firegymBattle, 'I am fire gym boss, can you beat me?', 'battle');
const grassgym = new NPC(2,'assets/images/npc-sprite.png', 628, 1019, 30, 50, grassgymBattle, 'I am grass gym boss, can you beat me?', 'battle');
const watergym = new NPC(3,'assets/images/npc-sprite.png', 1261, 989, 30, 50, watergymBattle, 'I am water gym boss, can you beat me?', 'battle');
const thundergym = new NPC(4,'assets/images/npc-sprite.png', 1552, 1311, 30, 50, thundergymBattle, 'I am thunder gym boss, can you beat me?', 'battle');
const groundgym = new NPC(5,'assets/images/npc-sprite.png',  991, 745, 30, 50, groundgymBattle, 'I am ground gym boss, can you beat me?', 'battle');
const lord = new NPC(11,'assets/images/monster/29.png', 308, 559, 120, 80, LordBattle, 'Catch me if you can', 'battle');
const battlenpc1 = new NPC(6,'assets/images/npc-sprite.png', 990, 1340, 30, 50, npc1Battle, 'You can battle with me anytime', 'battle_nolimit');
const battlenpc2 = new NPC(7,'assets/images/npc-sprite.png', 985, 908, 30, 50, npc2Battle, 'You can battle with me anytime', 'battle_nolimit');
const npc2 = new NPC(8,'assets/images/npc-sprite.png', 987, 1486, 30, 50, npc2Battle, 'Welcome to ancient forests, choose your Monster', 'give_monster',[
    new createMonsterFromDictionary(1,4, true),
    new createMonsterFromDictionary(4,4, true),
    new createMonsterFromDictionary(7,4, true),
  ]);

const npc3 = new NPC(9,'assets/images/npc-sprite.png', 645, 1430, 30, 50, npc2Battle, 'Do you want buy some items?', 'buy_items',[
    items.catchMonster,
    items.recoverHealth,
    items.reviveMonster,
  ]);

const npc4 = new NPC(10,'assets/images/npc-sprite.png', 384, 1400, 30, 50, npc1Battle, 'Let me heal all your monster !!!', 'heal_monsters');
const luckySummonNPC = new NPC(12, 'assets/images/npc-sprite.png', 497, 1447, 30, 50, npc1Battle , "Welcome to Lucky Summon! Spent 500 coins to get luck !!", 'lucky_summon');
const messageBox = new MessageBox(20, 360, 600, 100);
// const monsterSelectionMessageBox = new MessageBox(20, 360, 600, 100);
const monsterSelectionMenu = new SelectMenu(messageBox);
const itemSelectionMenu = new SelectMenu(messageBox);
let npcs = [npc2, npc3, npc4, luckySummonNPC];


const playerBag = new Bag();

// Add some items to the player's bag
playerBag.addItem(items.catchMonster, 30);
playerBag.addItem(items.recoverHealth, 10);
playerBag.addItem(items.reviveMonster, 3);
playerBag.addAncientCoins(500);

const menu = new Menu();

// main.js
function draw(ctx) {
  let activeBattle = null;

  if (!gameStarted) {
    if (slideshowActive) {
      drawSlideshow(ctx);
    } else {
      drawStartMenu(ctx);
    }
  } else {
        // Your existing draw code goes here
      // Find active battles among NPCs
      npcs.forEach((npc) => {
        if (npc.battle.active) {
          activeBattle = npc.battle;
        }
      });

      // Check if there's an active wild battle
      if (wildBattle && wildBattle.active) {
        activeBattle = wildBattle;
      }

      if (activeBattle) {
        // Draw the active battle
        // Draw the active battle
        if (activeBattle && activeBattle.skillEffectProgress !== null) {
          activeBattle.skillEffectUpdateCounter++;

          // Update skillEffectProgress every N frames
          const updateFrequency = 5; // Adjust this value to control the speed of the effect animation

          if (activeBattle.skillEffectUpdateCounter % updateFrequency === 0) {
            activeBattle.skillEffectProgress += 0.05;
          }

          if (activeBattle.skillEffectProgress >= 1) {
            activeBattle.skillEffectProgress = null;
            activeBattle.skillEffectUpdateCounter = 0;
          }
        }

        // Update the enemy's skill effect progress
          if (activeBattle.enemySkillEffectProgress !== null) {
            activeBattle.enemySkillEffectUpdateCounter++;

            // Update enemySkillEffectProgress every N frames
            const updateFrequency = 5; // Adjust this value to control the speed of the effect animation

            if (activeBattle.enemySkillEffectUpdateCounter % updateFrequency === 0) {
              activeBattle.enemySkillEffectProgress += 0.05;
            }

            if (activeBattle.enemySkillEffectProgress >= 1) {
              activeBattle.enemySkillEffectProgress = null;
              activeBattle.enemySkillEffectUpdateCounter = 0;
            }
          }

        activeBattle.draw(ctx);

      } else {
        // Draw the map, player, NPCs, and message box
        if (window.map) {
          window.map.draw(ctx);
        }
        if (window.map) {
          npcs.forEach((npc) => npc.draw(ctx, window.map.startX, window.map.startY));
        }
        if (window.player) {
          window.player.draw(ctx);
        }
        messageBox.draw(ctx);
      }

      if (mainMenuActive) {
        menu.draw(ctx, playerMonsters, computerMonsterStorage, playerBag);
      }

      if (monsterSelectionMenu.active) {
        monsterSelectionMenu.draw(ctx);
      }
    }
}



function createMonsterFromDictionary(id, level, isPlayerMonster = true) {
  const monsterData = monsterDictionary[id];
  const monster = new Monster(monsterData.name, monsterData.baseHealth, [], monsterData.imagePath, monsterData.evolveTo, monsterData.evolveLevel, monsterData.learnableSkills, monsterData.type, level, monsterData.prob);

  if (isPlayerMonster) {
    // Add skills only for the player's monsters
    for (const skill of monsterData.skills) {
      monster.learnSkill(skill);
    }
  } else {
    // Add skills based on the enemy monster's level
    for (const skill of monsterData.skills) {
      monster.learnSkill(skill);
    }

    for (const learnableSkill of monsterData.learnableSkills) {
      if (level >= learnableSkill.level) {
        monster.learnSkill(learnableSkill.skill);
      }
    }
  }

  return monster;
}

function playerIsTouchingNPC(player, npc, startX, startY) {
    const adjustedPlayerX = player.x + startX;
    const adjustedPlayerY = player.y + startY;

    return adjustedPlayerX < npc.x + npc.width &&
        adjustedPlayerX + player.width > npc.x &&
        adjustedPlayerY < npc.y + npc.height &&
        adjustedPlayerY + player.height > npc.y;
}


function playerIsInWildArea(player, map) {
  const playerX = player.x + map.startX;
  const playerY = player.y + map.startY;

  return wildAreasBounds.find(area => {
    return (
      playerX >= area.x &&
      playerX < area.x + area.width &&
      playerY >= area.y &&
      playerY < area.y + area.height
    );
  });
}

function drawCollisionMap(ctx, map) {
  const cellWidth = map.image.width / collisionMap.length;
  const cellHeight = map.image.height / collisionMap[0].length;

  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';

  for (let row = 0; row < collisionMap.length; row++) {
    for (let col = 0; col < collisionMap[row].length; col++) {
      if (collisionMap[row][col] === 1) {
        const x = col * cellWidth - map.startX;
        const y = row * cellHeight - map.startY;
        ctx.fillRect(x, y, cellWidth, cellHeight);
      }
    }
  }
}


requestAnimationFrame(gameLoop);