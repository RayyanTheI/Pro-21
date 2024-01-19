var BgImg, Bg;
var CoinImg, Coin, CoinsGroup;
var AsteroidImg, Asteroid, AsteroidsGroup;
var Rocket, RocketImg;
var invisibleBlockGroup, invisibleBlock;
var gameState = "start"; // Initial state is "start"
var spookySound;
var score = 0;
var playerName = "";

function preload() {
  BgImg = loadImage("Bg.jpg");
  CoinImg = loadImage("Coin.png");
  AsteroidImg = loadImage("Asteroid.png");
  RocketImg = loadImage("Rocket.png");
  spookySound = loadSound("spooky.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  spookySound.loop();

  Bg = createSprite(width / 2, height / 2);
  Bg.addImage("Bg", BgImg);
  Bg.velocityY = 1;

  CoinsGroup = new Group();
  AsteroidsGroup = new Group();
  invisibleBlockGroup = new Group();

  // Creating input box for player name
  var input = createInput();
  input.position(width / 2 - 60, height / 2);
  input.attribute("placeholder", "Enter your name");
  var submitButton = createButton("Submit");
  submitButton.position(input.x + input.width, height / 2);
  submitButton.mousePressed(submitName);

  function submitName() {
    playerName = input.value();
    gameState = "play"; // Change game state to "play" after submitting name
    input.hide();
    submitButton.hide();
  }

  Rocket = createSprite(width / 2, height - 100, 50, 50);
  Rocket.scale = 0.3;
  Rocket.addImage("Rocket", RocketImg);
}

function draw() {
  background(0);

  if (Bg.y > height) {
    Bg.y = height / 2;
  }

  if (gameState === "start") {
    // Display instructions
    fill("yellow");
    textSize(20);
    textAlign(CENTER);
    text("Enter your name and press submit to start the game!", width / 2, height / 2 - 50);
  } else if (gameState === "play") {
    if (keyDown("left_arrow")) {
      Rocket.x = Rocket.x - 3;
    }
    if (keyDown("right_arrow")) {
      Rocket.x = Rocket.x + 3;
    }
    if (keyDown("space")) {
      Rocket.velocityY = -10;
    }

    Rocket.velocityY = Rocket.velocityY + 0.8;

    if (AsteroidsGroup.isTouching(Rocket)) {
      Rocket.velocityY = 0;
    }

    // Check for rocket and coin collision
    if (CoinsGroup.isTouching(Rocket)) {
      score += 50; // Increase score by 50
      CoinsGroup[0].destroy(); // Remove the touched coin
    }

    spawnCoins();

    if (invisibleBlockGroup.isTouching(Rocket) || Rocket.y > height) {
      Rocket.destroy();
      gameState = "end";
    }

    drawSprites();

    // Display the score on the screen
    fill("yellow");
    textSize(20);
    text("Score: " + score, width - 150, 30);
    text("Hello " + playerName + "!", 20, 30);
  }

  if (gameState === "end") {
    // Display game over message
    stroke("yellow");
    fill("yellow");
    textSize(30);
    text("Game Over", width / 2 - 100, height / 2 - 50);
  }
}

function spawnCoins() {
  if (frameCount % 240 === 0) {
    var Coin = createSprite(Math.random(round(120,400)));
    var Asteroid = createSprite(200, 10);
    var invisibleBlock = createSprite(200, 15);
    invisibleBlock.width = Asteroid.width;
    invisibleBlock.height = 2;

    Coin.x = Math.round(random(width * 0.1, width * 0.9));
    Coin.addImage(CoinImg);
    Coin.scale = 0.5;
    Asteroid.addImage(AsteroidImg);

    Coin.velocityY = 1;
    Asteroid.velocityY = 1;
    invisibleBlock.velocityY = 1;

    Rocket.depth = Coin.depth;
    Rocket.depth += 1;

    Coin.lifetime = height / Coin.velocityY;
    Asteroid.lifetime = height / Asteroid.velocityY;
    invisibleBlock.lifetime = height / invisibleBlock.velocityY;

    CoinsGroup.add(Coin);
    AsteroidsGroup.add(Asteroid);
    invisibleBlockGroup.add(invisibleBlock);

    invisibleBlock.debug = true;
  }
}