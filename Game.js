class Sprite
{
	
	
	constructor(x1, y1, w1, h1)
	{
		this.Xval = x1;
        this.Yval = y1;
        this.w = w1;
        this.h = h1;

		this.image = new Image();
		this.scrollpos = 0;
		// this.image.src = image_url;
	}

	 isMario()      { return false; }
     isPipe()      { return false; }
     isGoomba() { return false; }
     isFireball() {return false; }

	// move(dx, dy)
	// {
	// 	this.dest_x = this.x + dx;
	// 	this.dest_y = this.y + dy;
	// }
}

class Pipe extends Sprite
{
	constructor(x, y, w, h)
	{
		super(x, y, w, h);

		
		this.scrollpos = 0;
	}
	
	update() //sit_still
	{
	
	}
	
	onclick(x,y)
	{
	
	}
	draw(ctx, scrollpos){
		let pipeImage = new Image();
		pipeImage.src = 'images/pipe.png';
		ctx.drawImage(pipeImage, this.Xval - scrollpos, this.Yval)
	}
	isPipe()
    {
        return true;
    }
}

class Mario extends Sprite
{
	marios = new Array();
	vertVelocity = 1.2;
	inAir =0;
	currentImage = 0;
	prevX ;
	prevY ;
	rightFacing = true;
	constructor(x, y, w, h)
	{
		super(x, y, w, h);
        
		this.scrollpos = 0;
        this.currentImage = 1;
		// console.log("mario length: " + this.marios.length);
		for(var i=0; i < 5; i++){
			// let num = (i+1);
			this.marios[i] = new Image();
			this.marios[i].src = 'images/mario'+ (i+1) +'.png';
		}
	}

	getOutOfPipe(sprite){
		if(sprite instanceof Pipe){
            if(this.Xval + this.w >= sprite.Xval && this.prevX + this.w <= sprite.Xval){
                
                this.Xval = this.prevX;
            }
            //mario coming from right collision
            if(this.Xval + this.w >= sprite.Xval && this.prevX - this.w>= sprite.Xval ){
                this.Xval = this.prevX;
            }
    
            //collision from top to bottom
            if(this.Yval + this.h >= sprite.Yval && this.prevY  <= sprite.Yval){
                this.Yval = sprite.Yval - this.h;
                this.vertVelocity = 0.0;
                this.inAir = 0;
            }
            //mario colliding from bottom to top
            if(this.Yval <= sprite.Yval + sprite.h && this.prevY >= sprite.Yval + sprite.h ){
                this.Yval = sprite.Yval + sprite.h;
                this.vertVelocity = 0.0;
                this.inAir = 0;
            }

        }
	}

	setPrevPos(){
        this.prevX = this.Xval;
        this.prevY = this.Yval;
        
    }

	update()
	{
		this.vertVelocity += 3.5;//this is gravity
        this.Yval  += this.vertVelocity;
        this.inAir++;
        if(this.Yval > 300 ){ //keep mario on the ground
            this.vertVelocity = 0.0;
            this.Yval = 300; //if mario is on a pipe jumps as if he was in the ground
            this.inAir = 0;
        }
	}
	changeImageState(){
        this.currentImage++;
        if(this.currentImage >= 5){
            this.currentImage = 1;
        }
    }
	// onclick(x, y)
	// {
	// 	this.dest_x = x;
	// 	this.dest_y = y;
	// }
	draw(context, scrollpos){
		let marioImage = new Image();
		// this.index = this.currentImage;
		marioImage.src = 'images/mario'+ this.currentImage +'.png';
		// console.log("mario Index " + this.currentImage);

		// context.drawImage(marioImage, this.Xval - scrollpos, this.Yval)
		if(this.rightFacing){	
			context.drawImage(marioImage, this.Xval - scrollpos, this.Yval);
			
		}
		else{
			// context.drawImage(marioImage, this.Xval - scrollpos + this.w, this.Yval, -this.w, this.h);
			context.save();
			context.translate(this.Xval + this.w, 0);
			context.scale(-1, 1);
			context.drawImage(marioImage, this.Xval - 100, this.Yval); //-100 to not be drawn at the begining of the page
			context.restore();
            
		}
	}
	isMario()
    {
        return true;
    }
}


class Fireball extends Sprite{
	vertVelocity = 3.2;
    ySpeed = 0;
    inAir = 0;
	isActive = false;
	prevX;
    prevY;

	constructor(x,y,w,h)
	{
		super(x,y,w,h);
		this.scrollpos = 0;
		this.isActive = true;
	}
	updateFireballState()
	{
		this.isActive = !this.isActive;
	}

	getFireballState()
	{
		return this.isActive;
	}

	update() {
		this.vertVelocity += 3.5;//this is gravity
		this.Yval  += this.vertVelocity;
		this.Xval += 5;
		this.inAir++;
		if(this.Yval > 350 ){ 
			this.vertVelocity -= 50;
			this.Yval = 350 ; 
			this.inAir = 0;
		}
    }
	
	draw(ctx, scrollpos) {
		let fireballImage = new Image();
		fireballImage.src = 'images/fireball.png';
		ctx.drawImage(fireballImage, this.Xval - scrollpos, this.Yval);

	}
}

class Goomba extends Sprite{
	timeOnFire = 10;
	setFire = false;
	prevX;
	prevY;
	goingRight = false;
    goingLeft = true;
	vertVelocity = 1.2;
    inAir = 0;

	constructor(x, y, w, h){
		super(x, y, w, h);
		this.scrollpos = 0;

	}

	goombaUpdate()
	{
		
		if (this.goombaOnFire == null)
		{
			this.goombaOnFire = ("images/goomba_fire.png");	
		}
	}

	getOutOfPipe(p){
        
        //goomba  left collision
        if(p instanceof Pipe){
            

            if(this.Xval + this.w >= p.Xval && this.prevX + this.w <= p.Xval){
                
                this.Xval = this.prevX;
                this.goingLeft = true;
                this.goingRight = false;
            }
            //goomba coming from right collision
            if(this.Xval + this.w >= p.Xval && this.prevX - this.w>= p.Xval ){
                this.Xval = this.prevX;
                this.goingLeft = false;
                this.goingRight = true;
            }
    
            //collision from top to bottom
            if(this.Yval + this.h >= p.Yval && this.prevY  <= p.Yval){
                this.Yval = p.Yval - this.h;
                this.vertVelocity = 0.0;
                this.inAir = 0;
            }
            //goomba colliding from bottom to top
            if(this.Yval <= p.Yval + p.h && this.prevY >= p.Yval + p.h ){
                this.Yval = p.Yval + p.h;
                this.vertVelocity = 0.0;
                this.inAir = 0;
            }


        }
        
    }
	setPrevPosGoomba(){
        this.prevX = this.Xval;
        this.prevY = this.Yval;
        
    }


	update() {
        // TODO Auto-generated method stub
		this.setPrevPosGoomba();
	   	this.vertVelocity += 3.5;//this is gravity
	   	this.Yval  += this.vertVelocity;
	   	this.inAir++;
        if(this.Yval > 350 ){ ///
            this.vertVelocity = 0.0;
            this.Yval = 350; //is on a pipe jumps as if he was in the ground
            this.inAir = 0;
        }

        if (this.goingLeft)
            {
                this.Xval -= 4;
                this.goingRight = false;
            }
             if (this.goingRight)
            {
                this.goingLeft = false;
                this.Xval += 4;
            }

    }


	draw(context, scrollpos){
		let goombaImage = new Image();
		goombaImage.src = 'images/goomba.png';
		let goombaOnFireImage = new Image();
		goombaOnFireImage.src = 'images/goomba_fire.png';
		if(this.setFire){
            context.drawImage(goombaOnFireImage, this.Xval - scrollpos, this.Yval);
        }
        else{
            context.drawImage(goombaImage, this.Xval - scrollpos, this.Yval);

        }
	}


}


class Model
{
	constructor()
	{
		this.index =0;
		this.sprites = [];
		// this.sprites.push(new Pipe(200, 100, 51, "pipe.png"));
		// console.log()
		this.mario = new Mario(100, 60, 60, 95);
		this.sprites.push(this.mario);
		this.pipe1 = new Pipe(200, 200, 55, 400);
		this.pipe2 = new Pipe(500, 300, 55, 400);
		this.pipe3 = new Pipe(700, 350, 55, 400);
		this.sprites.push(this.pipe1);
		this.sprites.push(this.pipe2);
		this.sprites.push(this.pipe3);
		this.goomba1 = new Goomba(270,300,37, 45);
		this.goomba2 = new Goomba(350,300,37, 45);
		this.goomba3 = new Goomba(300,300,37, 45);
		this.sprites.push(this.goomba1);
		this.sprites.push(this.goomba2);
		this.sprites.push(this.goomba3);

	}

	update()
	{
		let pipecolision = false;
		// console.log("sprites length: " + this.sprites.length)
		for(let i = 0; i < this.sprites.length; i++)
		{
			this.sprites[i].update();
			if(this.sprites[i] instanceof Mario)//INTERACTION MARIO->PIPE
			{
				for(let j=0; j < this.sprites.length; j++)
				{
					if(this.sprites[j] instanceof Pipe)
					{
						if(this.isThereACollision(this.mario, this.sprites[j]) == true)
						{
							this.mario.getOutOfPipe(this.sprites[j]);
							// console.log("mario out of pipe ");
						}
					
					}
				}
			}
		
			if (this.sprites[i] instanceof Goomba){//GOOMBA
				
				for (let k = 0; k < this.sprites.length; k++)
				{
					if ( this.sprites[k] instanceof Pipe)
					{
						pipecolision = this.isThereACollision(this.sprites[i] , this.sprites[k]);
					}
						if (pipecolision) 
						{
							
							(this.sprites[i]).getOutOfPipe(this.sprites[k]);
							
						}
					
					pipecolision = false;
				}


				if( ( this.sprites[i]).setFire)
				{
					(this.sprites[i]).timeOnFire--;
				}
				if( ( (this.sprites[i]).setFire) && (this.sprites[i]).timeOnFire == 0)
				{
					// this.sprites.remove(i);
					this.sprites.splice(i, 1);
					break;
				}
			}


			if(this.sprites[i] instanceof Fireball)
			{
				
				for(let j=0; j < this.sprites.length; j++)
				{
					//j is the goomba sprite
					if(this.sprites[j] instanceof Goomba)
					{
					
						if(this.isThereACollision(this.sprites[i], this.sprites[j]))
						{
							(this.sprites[j]).setFire = true;
							// this.sprites.remove(this.sprites[i]);
							this.sprites.splice(i, 1);
							break;
						
						}
						pipecolision = false;
					}
					
					
				}
					
				
			}
		}
	}
	
	isThereACollision(spriteA, sprite){
		
			
		if(spriteA.Xval + spriteA.w < sprite.Xval ){
			//mario not colliding from left to right
			
			return false;
		}

		else if(spriteA.Xval > sprite.Xval + sprite.w){
			//mario not colliding from right to left
			return false;
		}

		else if(spriteA.Yval + spriteA.h < sprite.Yval){
			//colliding from top to bottom
			return false;
		} // assumes bigger is downward
		else if(spriteA.Yval > sprite.Yval + sprite.h){
			return false;
		} // assumes bigger is downward
		// System.out.println("mario coliding");
		else{
			return true;
		}
	}

	addFireball(x, y){
		let fireball = new Fireball(x, y, 47, 47);
		fireball.isActive = true;
		this.sprites.push(fireball);
		// console.log("fireball added")
	}
}




class View
{
	
	constructor(model)
	{
		this.model = model;
		this.canvas = document.getElementById("myCanvas");
	}
	
	
	update()
	{
		
		let ctx = this.canvas.getContext("2d");
		let scrollpos = this.model.mario.Xval - 100;
		ctx.clearRect(0, 0, 1000, 500);
		ctx.fillStyle = "#00FFFF";
		ctx.fillRect(0, 0, 1000, 500);


		ctx.beginPath(); // Start a new path
		ctx.moveTo(0, 400); // Move the pen to (30, 50)
		ctx.lineTo(1000, 400); // Draw a line to (150, 100)
		ctx.stroke();
		for(let i = 0; i < this.model.sprites.length; i++)
		{
			this.model.sprites[i].draw(ctx, scrollpos);
		}
	}
}







class Controller
{
	constructor(model, view)
	{
		this.model = model;
		this.view = view;
		this.key_right = false;
		this.key_left = false;
		this.key_up = false;
		this.key_down = false;
		this.key_space = false;
		this.key_ctrl = false;
		let self = this;
		// view.canvas.addEventListener("click", function(event) { self.onClick(event); });
		document.addEventListener('keydown', function(event) { self.keyDown(event); }, false);
		document.addEventListener('keyup', function(event) { self.keyUp(event); }, false);
	}

	// onClick(event)
	// {
	// 	this.model.onclick(event.pageX - this.view.canvas.offsetLeft, event.pageY - this.view.canvas.offsetTop);
	// }

	keyDown(event)
	{
		if(event.keyCode == 39) this.key_right = true;
		else if(event.keyCode == 37) this.key_left = true;
		else if(event.keyCode == 38) this.key_up = true;
		else if(event.keyCode == 40) this.key_down = true;
		else if(event.keyCode == 32) this.key_space = true;
		// else if(event.keyCode == 17) this.key_ctrl = true;

		else if(event.keyCode == 17){
			this.model.addFireball(this.model.mario.Xval , this.model.mario.Yval );
			// console.log("ctrl presses")
		}
	}

	keyUp(event)
	{
		if(event.keyCode == 39) this.key_right = false;
		else if(event.keyCode == 37) this.key_left = false;
		else if(event.keyCode == 38) this.key_up = false;
		else if(event.keyCode == 40) this.key_down = false;
		else if(event.keyCode == 32) this.key_space = false;
		// else if(event.keyCode == 17) this.key_ctrl = false;

		
	}

	update()
	{
		let dx = 0;
		let dy = 0;
		this.model.mario.setPrevPos();
		if(this.key_right) 
		{	
			this.model.mario.changeImageState();
			this.model.mario.Xval += 10;
			this.model.mario.rightFacing = true;
			// dx+=4;
		}
		if(this.key_left)
		{
			this.model.mario.changeImageState();
			this.model.mario.Xval -= 10;
			this.model.mario.rightFacing = false;
			// dx-=4;
		}
		if(this.key_space && this.model.mario.inAir < 5)
		{
			this.model.mario.vertVelocity -= 10;
			// dx-=4;
		}
		if(this.key_up) dy-=4;
		if(this.key_down) dy+=4;
		if(dx != 0 || dy != 0)
			this.model.move(dx, dy);


		
	}
}





class Game
{
	constructor()
	{
		this.model = new Model();
		this.view = new View(this.model);
		this.controller = new Controller(this.model, this.view);
	}

	onTimer()
	{
		this.view.update();
		this.model.update();
		this.controller.update();
	}
}

let game = new Game();
let timer = setInterval(function() { game.onTimer(); }, 40);