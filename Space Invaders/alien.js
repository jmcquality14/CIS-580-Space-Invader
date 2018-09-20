//Alien Class//
/** @function Alien
  * Constructor to Alien Object
  ** @param {integer} x - x-coordinate of alien
  * @param {integer} y - y-coordinate of alien
  * @param {integer} width - width of alien
  * @param {integer} height - height of alien
  */
function Alien(x,y, width, height){
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	if((this.x / 350) < 1){
		this.direction = 'left';
	} else {
		this.direction = 'right';
	}
	this.drop = 100
}

/** @function update
  * Updates position of Alien on board
  * @param {double} deltaT - the total change in time  
  */
Alien.prototype.update = function(deltaT){
	if(15 < this.x && this.x < 695){
		if(this.direction == 'left'){
			this.x -= deltaT * 0.15;
		} else if(this.direction == 'right') {
			this.x += deltaT * 0.15;
		}
	} else {
		if(this.y < this.drop){
			this.y += deltaT * 0.2;
		} else {
			this.drop += 60;
			if(this.direction == 'left'){
				this.direction = 'right';
				this.x += 5;
			} else {
				this.direction = 'left';
				this.x -= 5; 
			}
		}
	}	
	//Alternative pattern
	/*
	else if (this.x <= 10) {
		this.direction = 'right';
		this.x += 5;
	} else if (this.x >= 700) {
		this.direction = 'left';
		this.x -= 5;
	}
	this.y += deltaT * 0.1;
	*/	
}

/** @function render
  * Draws Alien on canvas
  * @param {canvas} context - canvas being drawn to 
  */
Alien.prototype.render = function(context){
	context.beginPath();   
	var img = document.getElementById('alien');; 
	context.drawImage(img, this.x, this.y, 30, 30);	
	context.closePath();
}