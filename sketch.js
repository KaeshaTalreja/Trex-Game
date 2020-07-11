var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided,trex_duct;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var bird,birdsGroup,birdAni,birdAniStop;

var score=0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_duct=loadAnimation("trex duct.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  birdAni=loadAnimation("bird_1.png","bird_2.png");
  birdAniStop=loadAnimation("bird_1.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3"); 
}

function setup() {
  createCanvas(600, 200);
  localStorage["highScore"]=0;
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("duct", trex_duct);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + score/300);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdsGroup=new Group();
  
  score = 0;
}

function draw() {
  background(180);
  text("Score: "+ score, 500,50);
  text("Highest Score:"+localStorage["highScore"],50,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
    if(keyWentDown("down")){
      trex.changeAnimation("duct");
      trex.scale=1;
    }
    if(keyWentUp("down")){
      trex.changeAnimation("running");
      trex.scale=0.5;
    }
  
    if(keyDown("space") && trex.y >= 159) {
      jumpSound.play();
      trex.velocityY = -14;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
    if(score>200){
      spawnBirds();
    }
    
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }
  
    if(obstaclesGroup.isTouching(trex)||
       birdsGroup.isTouching(trex)){
      dieSound.play();  
      gameState = END;
        
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdsGroup.setLifetimeEach(-1);
    if(bird!=null){
      bird.changeAnimation("birds stop");
    }
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  text("Highest Score:"+localStorage["highScore"],50,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3 + score/300);;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + score/300);;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  ground.velocityX = -(6 + score/300);
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  if(score>localStorage["highScore"]){
    localStorage["highScore"]=score;
  }
  score = 0;
  
}

function spawnBirds() {
  //write code here to spawn the clouds
  if (frameCount % 300 === 0) {
    bird = createSprite(600,160,40,10);
    bird.y = Math.round(random(140,170));
    bird.addAnimation("birds",birdAni);
    bird.addAnimation("birds stop",birdAniStop);
    bird.scale = 0.5;
    bird.velocityX = -5;
    
     //assign lifetime to the variable
    bird.lifetime = Math.round(Math.abs(bird.x/bird.velocityX));
    
    //add each cloud to the group
    birdsGroup.add(bird);
  }
  
}
