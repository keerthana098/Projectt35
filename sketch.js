var dog, happyDog, dog1, dog2,database, foodS, foodStock, updateFoodStock;
var readStock, data;
var feed, addFood, fedTime, lastFed, foodObj, feedDog, addFoods;
var changeState, readState, gameState;
var bedroom, garden, washroom;

function preload()
{
	dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
}

function setup() {
   database=firebase.database();
  
   foodStock = database.ref('Food');
   foodStock.on("value", readStock);

	createCanvas(1000, 500);
  
  dog1=createSprite(700,350,30,20);
  dog1.addImage(dog);
  dog1.scale = 0.15;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  })
}


function draw() {  
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(date){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: "+ lastFed%12 + " PM", 350,30);
  }else if(lastFed==0){
    text("Last Fed : 12 AM", 350,30);
  }else{
    text("Last Fed : "+ lastFed + " AM", 350,30);
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }

  drawSprites();
  fill("white");
  text("Note: Press Up Arrow key to feed the dog", 770,15);
  //add styles here

}
function readStock(){
  foodS=data.val();
}

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
  })
}

function feedDog(){
  dog1.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}