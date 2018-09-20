//Bullet Class//

/** @function Bullet
  * Constructor to the Bullet Object 
  * @param {integer} x - x-coordinate of bullet
  * @param {integer} y - y-coordinate of bullet
  * @param {integer} radius - radius of the bullet
  * @param {float} direction - the direction and speed of bullet
  */
function Bullet(x, y, radius, direction){
	this.x = x+15;
	this.y = y;
	this.radius = radius;
	this.direction = direction
}

/** @function update
  * Updates position of Bullet on canvas
  * @param {double} deltaT - the total change in time 
  */
Bullet.prototype.update = function(deltaT) {
	this.y += deltaT * this.direction;
}

/** @function render
  * Draws bullet on canvas
  * @param {canvas} context - canvas being drawn to
  */
Bullet.prototype.render = function(context){
	context.beginPath();
	context.fillStyle = 'white'
	context.arc(this.x + this.radius, this.y - this.radius, 2*this.radius, 2*this.radius, 0, 2*Math.PI);
	context.fill();
	context.closePath();
}