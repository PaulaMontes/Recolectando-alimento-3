const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var board1, board2, board3;
var numberOfArrows = 10;
var apple;

var score = 0;

var vx = 0;
var g = 0.05;
var vy = 0;

function preload() {
  backgroundImg = loadImage("./assets/bosque.webp");
  appleImg = loadImage ("./assets/manzana.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, 500, 230, 370);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(
    340,
    playerBase.body.position.y - 180,
    120,
    120,
  );
    
  if (frameCount % 5 === 0){
    board1 = new Board(700, 150,60, 90);
    board2 = new Board(1000, 1, 60, 90);
    board3 = new Board(1300, 50, 60, 90);
  } 

}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  playerBase.display();
  player.display();
  playerArcher.display();
  

  board1.display();
  board2.display();
  board3.display();
  //createApples();

  //apple = createSprite(100,50,30,30);
  //apple.addImage(appleImg);
  //apple.scale = 0.7;

  //vy +=g;
  //apple.position.y+=vy;
  //drawSprites();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );

      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      );

      if (board1Collision.collided || board2Collision.collided) {
        score += 5;
      }

      
      var posX = playerArrows[i].body.position.x;
      var posY = playerArrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          playerArrows[i].remove(i);
        } else {
          playerArrows[i].trajectory = [];
        }
      }
    }
  }

  //Título
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("RECOLECTANDO ALIMENTO", width / 2, 100);

  //Puntuación
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Puntuación: " + score, width - 200, 100);

  //Conteo de flechas
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Flechas restantes: " + numberOfArrows, 200, 100);

  if (numberOfArrows == 0) {
    gameOver();
  }
}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}


function gameOver() {
  swal(
    {
      title: `¡Fin del juego!`,
      text: "¡Gracias por jugar!",
      imageUrl:
        "https://www.pngall.com/wp-content/uploads/11/Vector-Archer-PNG-HD-Image.png",
      imageSize: "150x150",
      confirmButtonText: "Jugar de nuevo"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

/*function createApples (){
  if (frameCount % 80 === 0){
    apple = createSprite(100, 10, 10, 10);
    apple.addImage(appleImg);
    apple.x = Math.round(random(50, 350));
    apple.scale=0.7;
    apple.velocityY = 3;
    apple.lifetime = 150;
  }
}*/

