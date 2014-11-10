$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	var cw = 20;
	var d;
	var wall;
	var score;
	var offset;
	//Lets create the snake now
	var enemy_array; //an array of cells to make up the snake
	
	function init()
	{
		d = "right"; //default direction
		create_enemy();
		create_wall();  
		//finally lets display the score
		score = 0;
		
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 600);
		offset={x:0,y:0};
	}
	init();
	
	function create_enemy()
	{
		var length = 5; // 
		enemy_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a enemies
			enemy_array.push({x: Math.round(Math.random()*(w-cw)/cw), y: Math.round(Math.random()*(h-cw)/cw)});
		}
	}
	
	//Lets create the wall now
	function create_wall()
	{
		/*wall = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};*/
		var length = 5; // 
		wall_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			 
			wall_array.push({x: Math.round(Math.random()*(w-cw)/cw), y: Math.round(Math.random()*(h-cw)/cw)});
		}
		
		
		
		
		
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	
	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = enemy_array[0].x;
		var ny = enemy_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right")  nx++; 
		else if(d == "left")  nx--; 
		else if(d == "up")  ny--; 
		else if(d == "down")  ny++; 
		 
		 


		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, enemy_array)&& false)
		{
			//restart game
			init();
			//Lets organize the code a bit now.
			return;
		}
		
		//Lets write the code to make the snake eat the wall
		//The logic is simple
		//If the new head position matches with that of the wall,
		//Create a new head instead of moving the tail
		/*if(nx == wall.x && ny == wall.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new wall
			create_wall();
		}
		else
		{
			var tail = enemy_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		*/
		//The snake can now eat the wall.
		
		//enemy_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < enemy_array.length; i++)
		{
			var c = enemy_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y,"blue");
		}
		
		//Lets paint the walls
		
		for(var i = 0; i < wall_array.length; i++)
		{
			var c = wall_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y,"red");
		}
		
		 
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
		
		var rel_pos=relative_position(enemy_array[0].x,enemy_array[0].y,wall.x, wall.y,0);
			ctx.fillText("X"+rel_pos.x+" Y"+rel_pos.y+"", 20, h-20);
ctx.fillText("OX"+offset.x+" OY"+offset.y+"", 60, h-60);
 
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(x, y,color1)
	{
		
		x=x-offset.x;
		y=y-offset.y;
		
		// calcolo le dimensioni in base alla prospettiva
		pcw=Math.round(h/(h/(y)));
		if (!(x == -1 || x == w/cw || y == -1 || y == h/cw))
		{
			ctx.fillStyle = color1;
			ctx.fillRect(x*cw, y*cw, pcw, pcw);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x*cw, y*cw, pcw, pcw);
		}
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	
	function relative_position(myx,myy,x,y,direction)
	{
		direction=0;//angolo
		newx=x-myx;
		newy=y-myy;
		 return {x: newx, y: newy};
		
		
	}

	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		
		if(key == "37") d = "left";
		else if(key == "38" ) d = "up";
		else if(key == "39" ) d = "right";
		else if(key == "40" ) d = "down";
		 


		if(d == "right") { offset.x++;}
		else if(d == "left") { offset.x--;}
		else if(d == "up") {   offset.y--;}
		else if(d == "down") { offset.y++;}


		//The snake is now keyboard controllable
	})
	
	
	
	
	
	
	
})
