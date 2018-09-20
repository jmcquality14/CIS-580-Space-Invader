//Screen Dimensions//
const WIDTH = 740;
const HEIGHT = 580;

//Screen//
var screen = document.createElement('canvas');
var screenCtx = screen.getContext('2d');
screen.height = HEIGHT;
screen.width = WIDTH;
document.body.appendChild(screen);

//BackBuffer//
var backBuffer = document.createElement('canvas');
var backBufferCtx = screen.getContext('2d');
backBuffer.height = HEIGHT;
backBuffer.width = WIDTH;

//Global Variables//
var start = null;
var gameOverFlag = false;
var score = 0;
var currentInput = {
	space: false,
	left: false,
	right: false,
}
var priorInput = {
	space: false,
	left: false,
	right: false,
}

//Sprites//
var bullets = [];
var aliens = [];
var alienBullets = [];
var player = new Player(WIDTH/2, HEIGHT-40); 

//Spawn Time Interval//
const INTERVAL = 500;

//Conrtols//
/** @function handleKeydown
  * Event handler for keydown events
  * @param {KeyEvent} event - the keydown event
  */
function handleKeydown(event) {
	switch(event.key){
		case ' ':
			currentInput.space = true;
			break;
		case 'a':
			currentInput.left = true;
			break;
		case 'd':
			currentInput.right = true;
			break;
	}
}
window.addEventListener('keydown', handleKeydown ); 

/** @function handleKeyup
  * Event handler for keyup events
  * @param {KeyEvent} event - the keyup event
  */
function handleKeyup(event) {
	switch(event.key){
		case ' ':
			currentInput.space = false;
			break;
		case 'a':
			currentInput.left = false;
			break;
		case 'd':
			currentInput.right = false;
			break;
	}
}
window.addEventListener('keyup', handleKeyup );

/** @function copyInput
  * Copies the current input into the previous input
  */
function copyInput() {
	priorInput = JSON.parse(JSON.stringify(currentInput));
}

/** @function loop
  * The main game loop
  * @param {DomHighResTimestamp} timestamp - the current system time
  */
function loop(timestamp){	
	if(!start) {
		start = timestamp;		
		player.render(backBufferCtx);
	}
	var elaspedTime = timestamp - start;
	start = timestamp;
	update(elaspedTime);
	render(backBufferCtx);
	screenCtx.drawImage(backBuffer, 0, 0);
	copyInput();
	window.requestAnimationFrame(loop);
}

/** @function gameOver
  * Renders endgame screen
  * @param {canvas} Ctx - canvas being drawn to
  * elapsed between frames
  */
function gameOver(Ctx){
	//console.log('GameOver', gameOverFlag); Testing Tool
	Ctx.fillStyle = 'white';
	Ctx.font = '20 px Ariel white'
	Ctx.fillText('GAME OVER! FINAL SCORE: ' + score, 100, 200); 
}

/** @function update
  * Updates the game's state
  * @param {double} elapsedTime - the amount of time elapsed between frames
  */
function update(elaspedTime){
	if(!gameOverFlag) {
		if(currentInput.space && !priorInput.space) {
			bullets.push(new Bullet(player.x, player.y, 5, -0.5));
		}
		if(currentInput.left){
			if(!(player.x<10)) {
				player.update(elaspedTime, -0.4);
			}
		}
		if(currentInput.right){
			if(!(player.x>700)){
				player.update(elaspedTime, 0.4);
			}
		}
		bullets.forEach(function(bullet, index){
			bullet.update(elaspedTime);
			if(bullet.y <= 0) bullets.splice(index, 1);
		});
		aliens.forEach(function(alien,index){
			alien.update(elaspedTime);
			if(alien.y>=540){
				player.lives--;
				aliens.splice(index, 1);
				if(player.lives < 1){
					gameOverFlag= true;
				}
				return;
			}
		});
		detectCollision();
		alienBullets.forEach(function(bullet, index) {
			bullet.update(elaspedTime);
			if(bullet.y <= 540) bullets.splice(index, 1);
		});
		detectAlienBulletCollision();
	}
}

/** @function render
  * Renders the game into the canvas
  * @param {} Ctx - 
  */
function render(Ctx){
	Ctx.clearRect(0, 0, WIDTH, HEIGHT);	
	Ctx.moveTo(0,0);
	Ctx.font = '15px Ariel';
	Ctx.fillText("Lives: " + player.lives + " Score: " + score, 20, 50 );	
	Ctx.fillStyle = 'white';
	Ctx.closePath();	
	if(gameOverFlag){
		gameOver(Ctx);
	} else {
		player.render(Ctx);
		bullets.forEach(function(bullet){
			bullet.render(Ctx);
		});
		aliens.forEach(function(alien){
			alien.render(Ctx);
		});
		alienBullets.forEach(function(bullet){
			bullet.render(Ctx);
		})
	}
}

/** @function addAlien
  * Constructs a new Alien object and randomly assigns it a x-position. Then adds Alien to
  * array of Aliens.
  */
function addAlien(){
	var x_pos = Math.floor(Math.random() * (WIDTH - 40) );
	if( x_pos <= 10) x_pos += 10;
	if( x_pos >= WIDTH) x_pos -= 10;
	aliens.push(new Alien(x_pos, 60, 30, 30));
}

/** @function addAlienBullet
  * Constructs a new Bullet object and randomly assigns it to the position of an Alien sprite.
  * Then adds new Bullet to array of Alien Bullets
  */
function addAlienBullet(){
	var index = Math.floor(Math.random() * aliens.length);
	alienBullets.push(new Bullet(aliens[index].x , aliens[index].y, 5, 0.3));
}


/** @function detectCollision
  * Detects a collision between a player's bullet and an alien. Removes bullet and alien from
  * screen if their is a collision detected.
  */
function detectCollision(){
	for(var i = 0; i < aliens.length; i++){
		for(var j = 0; j < bullets.length; j++){
			var rx = bullets[j].x.clamp(aliens[i].x, aliens[i].x + aliens[i].width);//Math.min(bullets[j].x, Math.max(aliens[i].x, aliens[i].x + aliens[i].width) );//Math.clamp(bullets[j].x, aliens[i].x, aliens[i].x + aliens[i].width);
			var ry = bullets[j].y.clamp(aliens[i].y, aliens[i].y + aliens[i].height);//Math.min(bullets[j].y,Math.max(aliens[i].y, aliens[i].y + aliens[i].height) );//Math.clamp(bullets[j].y, aliens[i].y, aliens[i].y + aliens[i].height);
			var distSquared = Math.pow(rx - bullets[j].x, 2) + Math.pow(ry - bullets[j].y, 2);
			if(distSquared < Math.pow(bullets[j].radius, 2)){
				console.log('Collision!');
				aliens.splice(i, 1);
				bullets.splice(j, 1);
				i=0;
				j=0;
				score += 10;
			} 		
		}
	}
}

/** @function detectAlienBulletCollision
  * Detects a collision between a player and an alien's bullet. Removes bullet from
  * screen and decrements player's number of lives by one.
  */
function detectAlienBulletCollision(){
	for(var i = 0; i < alienBullets.length; i++){
		var rx = alienBullets[i].x.clamp(player.x, player.x + 30);//Math.min(bullets[j].x, Math.max(aliens[i].x, aliens[i].x + aliens[i].width) );//Math.clamp(bullets[j].x, aliens[i].x, aliens[i].x + aliens[i].width);
		var ry = alienBullets[i].y.clamp(player.y, player.y + 30);//Math.min(bullets[j].y,Math.max(aliens[i].y, aliens[i].y + aliens[i].height) );//Math.clamp(bullets[j].y, aliens[i].y, aliens[i].y + aliens[i].height);
		var distSquared = Math.pow(rx - alienBullets[i].x, 2) + Math.pow(ry - alienBullets[i].y, 2); 
		if(distSquared < Math.pow(alienBullets[i].radius, 2)){
			console.log('Collision!');
			alienBullets.splice(i, 1);
			player.lives -= 1;
			if(player.lives <= 0){
				gameOverFlag=true;
				return;
			}
			i=0;
			
		} 
	}
}

/** @function clamp
  * Clamps the x and y coordinates of a circle to bounds defined by the sides of a rectangle
  * @Param {integer} min - The lower boundary
  * @Param {integer} max - The upper boundary
  * @returns A number between min and max
  */
Number.prototype.clamp = function(min, max) {	
  return Math.min(Math.max(this, min), max);
};

window.requestAnimationFrame(loop);
//Interval of time when aliens spawn
window.setInterval(addAlien, INTERVAL);
//Interval of time when aliens shoot
window.setInterval(addAlienBullet, INTERVAL/2);