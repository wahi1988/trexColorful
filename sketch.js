var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var backgroundImg;
var sun;

var score;
var gameOverImg, restartImg
var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex_1.png","trex_3.png","trex_4.png");
  trex_collided = loadAnimation("trex_collided.png");

  backgroundImg = loadImage("backgroundImg.png");
  
  groundImage = loadImage("ground2.png");

  sunAnimation = loadImage("sun.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(displayWidth-20, displayHeight-20);

  sun = createSprite(displayWidth-20/2-250, displayHeight/2);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1;
  
  ground = createSprite(displayWidth-20, displayHeight-20/2-70);
  ground.addImage("ground", groundImage);
  ground.x = ground.width/2;
  ground.scale = 1.7;
  
  invisibleGround = createSprite(30, displayHeight-20/2);
  invisibleGround.visible = false;

  trex = createSprite(50, displayHeight-20/2-120);    
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);  

  trex.scale = 0.1;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true;
  
  score = 0;
  
}

function draw() {
  background(backgroundImg);

  //displaying score
  textSize(25);
  fill("red");
  textFont("Poppins");
  text("Score: "+ score, 100, 200);
  
  camera.position.x = displayWidth/2;
  camera.position.y = trex[trex - 1];

  if(gameState === PLAY){
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    //using framerate to reset and increment the score properly
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    console.log(trex.y);
    if(keyDown("space") && trex.y > displayHeight-20/2-150) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {

      textSize(40);
      fill("red");
      textFont("Poppins");
      text("GAME OVER", 900, 550);

     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     
     //if reset icon is pressed the game should go to play mode
     if(mousePressedOver(restart)) {
      reset();
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  //destroying obstacles so that trex will move further
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  //reseting the score
  score = 0;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth-20, displayHeight-20/2-90);
   obstacle.velocityX = -(6 + score/100);
   
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
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth-20, displayHeight-20/2-80);
    cloud.y = Math.round(random(displayHeight/2-10,displayHeight/2-100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1; 
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}