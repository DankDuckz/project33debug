const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button,blower;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr,rope2;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;
var gameState = "NOT WIN"
function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    canWidth = displayWidth
    canHeight = displayHeight
    createCanvas(displayWidth,displayHeight)
  }
  else {
    canWidth = windowWidth
    canHeight = windowHeight
    createCanvas(windowWidth,windowHeight)
  }

  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(width/2.5,height/3);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(width/3.5,height/2.5);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  // button3 = createImg('cut_btn.png');
  // button3.position(375,210);
  // button3.size(50,50);
  // button3.mouseClicked(drop3);

  // blower = createImg('balloon.png');
  // blower.position(10,250);
  // blower.size(150,100);
  // blower.mouseClicked(airBlow);

  platform = new Ground(width/2,height/4,width/10,height/30)

  mute_btn = createImg('mute.png');
  mute_btn.position(420,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
  
  rope = new Rope(4,{x:width/2.4,y:height/3});
  rope2 = new Rope(4,{x:width/3.4,y:height/2.5});
  // rope3 = new Rope(4,{x:395,y:210});

  ground = new Ground(canWidth/2,canHeight,canWidth,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(width/2,platform.body.position.y-80,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  bubble = createSprite(width/2.2,height/2,50,50)
  
  fruit = Bodies.circle(480,500,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  // fruit_con3 = new Link(rope3,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{

  console.log(fruit.position)
  background(51);
  image(bg_img,0,0,canWidth,canHeight);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();
  // rope3.show();
  platform.show()

  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    eating_sound.play()
    gameState = "WIN"
  }

  if (gameState == "WIN") {
    textSize(50)
    fill("black")
    text("YOU WON!",150,200)
  }

  if(fruit!=null && fruit.position.y>=650)
  {
    bunny.changeAnimation('crying');
    fruit=null;
    sad_sound.play()
    bk_song.stop()
   }
   
}

function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cut_sound.play() 
}

function drop2()
{
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
  cut_sound.play() 
}
// function drop3()
// {
//   rope3.break();
//   fruit_con3.detach();
//   fruit_con3 = null;
//   cut_sound.play() 
// }


function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

function airBlow() {
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
  air.play()
  air.setVolume(0.3)
}

function mute() {
  if (bk_song.isPlaying()) {
    bk_song.stop()
  }
  else {
    bk_song.play()
    bk_song.setVolume(0.3)
  }
}

