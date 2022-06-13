var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var sal,mor,ck;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");

sal = loadSound("salto.mp3");
mor = loadSound("moricion.mp3");
ck = loadSound("check.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,windowHeight - 180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,50);
  trex.debug=false;
  ground = createSprite(200,windowHeight - 180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,windowHeight - 170,400,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  score = 0;

  gameOver=createSprite(windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.5;

  restart=createSprite(windowWidth/2,windowHeight/2 + 50);
  restart.addImage(restartImage);
  restart.scale=0.5;

  gameOver.visible=false;
  restart.visible=false;
}

function draw() {
  background(180);
  //mostrar la puntuación
  text("Puntuación: "+ score, windowWidth -100,300);
  
  
  
  if(gameState === PLAY){
    //mover el suelo
    ground.velocityX = -4;
    //puntuación
    score = score + Math.round(frameCount/60);
    if(score > 0 && score%500===0){
    ck.play();

    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("space")&& trex.y >= windowHeight - 215) {
        trex.velocityY = -13;
        sal.play();
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        mor.play();
    }
  }
  else if (gameState === END) {
    ground.velocityX = 0;
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    gameOver.visible=true;
    restart.visible=true;
    trex.velocityY=0
    if(mousePressedOver(restart)){
      reiniciar();
    }

  }
  
 
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function reiniciar(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  gameOver.visible=false;
  restart.visible=false;
  trex.changeAnimation("running",trex_running);
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth ,windowHeight - 190,10,40);
   obstacle.velocityX = -(6 + 3*score/1000);
   
    //generar obstáculos al azar
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
   
    //asignar escala y ciclo de vida al obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
   if (frameCount % 60 === 0) {
     cloud = createSprite(windowWidth ,windowHeight - 250,40,10);
    cloud.y = Math.round(random(250, 300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 220;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar nube al grupo
   cloudsGroup.add(cloud);
    }
}

