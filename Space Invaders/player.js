//Player Class
/** @function Player
  * Constructor to Player Object
  * @param {integer} x - x-coordinate of player
  * @param {integer} y - y-coordinate of player
  */
function Player(x, y){
	this.x = x;
	this.y = y;
	this.lives = 3;
	this.img = document.getElementById('spaceship');
}

/** @function 
  * Updates position of Player on canvas
  * @param {double} deltaT - the total change in time
  * @param {double} direction - the direction and speed of player
  */
Player.prototype.update= function(deltaT, direction){
	this.x += deltaT * direction;
}

/** @function render
  * Draws player on canvas
  * @param {canvas} context - canvas being drawn to
  */
Player.prototype.render = function(context){
	context.beginPath();
	context.drawImage(this.img, this.x, this.y, 40, 40);
	context.closePath();
}