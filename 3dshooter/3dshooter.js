$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	var cw = 10 ;
	var d;
	var wall;
	var score;
	var offset;
	var me;
	var center;
	var default_dist;
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
		game_loop = setInterval(paint, 100);
		offset={x:0,y:0,t:0};
		me={x:(w-cw)/2,y:(h-cw)/2};// la mia posizione
		center={x:(w-cw)/2,y:(h-cw)/2};//centro
		// 
		default_dist=distanza(me.x,me.y,0,0);
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
	/*	if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, enemy_array)&& false)
		{
			//restart game
			init();
			//Lets organize the code a bit now.
			return;
		}*/
		
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
		
	//	paint me
		 	 ctx.fillStyle ="black";
			ctx.fillRect(me.x+offset.x -cw/2,me.y+offset.y -cw/2, cw, cw);
			 
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
		
		 
         ctx.fillText("OX"+offset.x+" OY"+offset.y+" OT"+offset.t+"   meX"+me.x+"   meY"+me.y, 60, h-60);

		 
	}
	//Lets first create a generic function to paint cells
	function paint_cell(x, y,color1)
	{
		
		 
		/*// avanti indietro destra sisnistra
		x=x-offset.x;
		y=y-offset.y;
		*/
		 radianti=gradiToRadianti(offset.t);//converto i gradi in radianti
	
		 //traslo da rispetto alla mia posizione a rispetto a (0,0)
	 	x=x-((me.x)/cw );
	 	y=y-((me.y )/cw) ;
		//nel quadrato di gioco 0 gradi stanno al posto dei classici 90 gradi e la y cresce andando in giu 
		 var xx=Math.round((x*Math.cos(radianti)-y*Math.sin(radianti))+offset.x/cw);
		 y=Math.round((x*Math.sin(radianti)+y*Math.cos(radianti)) +offset.y/cw) ;
	
		 //risistemo rispetto alla mia posizione
		x=xx;
	     x=x+((me.x)/cw);
	 	y=y+((me.y )/cw);
	
		////alert((distanza(w/2,h,x,y)));
//Math.round(h/(h/y))*
		// calcolo le dimensioni in base alla prospettiva
		
		
		//trovo la dimensione del punto da disegnare PROPORZIOnale alla distanza da me
		pcw=(1-distanza(center.x,center.y,x*cw,y*cw)/default_dist)*cw;
		 // pcw=cw;
		if (!(x == -1 || x == w/cw || y == -1 || y == h/cw))
		{
		 
			hpcw=pcw/2;//half pcw , x e y sono il centro
			ctx.fillStyle = color1;
			ctx.fillRect(x*cw-hpcw,(y)*cw-hpcw, pcw, pcw);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x*cw-hpcw, y*cw-hpcw, pcw, pcw);
			
	//	 ctx.fillText("    X"+x*cw+"   Y"+y*cw+"   distanza"+distanza(0,0,x*cw-hpcw,y*cw-hpcw), x*cw, y*cw);

		}
		
		//ctx.fillText("   me.y"+me.y+"  me.x"+me.x   +"    offset.t"+ offset.t+"  cos"+Math.cos(gradiToRadianti(360-offset.t)) +"  sin"+Math.sin(gradiToRadianti(360-offset.t)) , 25, 25);
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
	
	
	function distanza(x1,y1,x2,y2)
	{
		// distanza nel piano cartesianop
		return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
	}
	function gradiToRadianti(gradi)
	{
		return gradi/57.3;
	}

	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		
		if(key == "37") d = "left";
		else if(key == "38" ) d = "up";
		else if(key == "39" ) d = "right";
		else if(key == "40" ) d = "down";
		 


		/*if(d == "right") { offset.x++;}
		else if(d == "left") { offset.x--;}*/
		if(d == "right") { offset.t+=6;}
		else if(d == "left") { offset.t-=6;}
		else if(d == "up") {    //mi devo spostare in su rispetto all'area di gioco ma lo converto nel piano cartesiano
										me.y=me.y- Math.cos(gradiToRadianti(360-offset.t));  
										 me.x=me.x+Math.sin(gradiToRadianti(360-offset.t));   
										 offset.y=center.y-me.y;
										 offset.x=center.x-me.x;
										  
										}
		else if(d == "down") {  	   //mi devo spostare in giu rispetto all'area di gioco ma lo converto nel piano cartesiano
											me.y=me.y+Math.cos(gradiToRadianti(360-offset.t));
											 me.x=me.x-Math.sin(gradiToRadianti(360-offset.t));   
												offset.y=center.y-me.y;
												offset.x=center.x-me.x;
												
											}


		//The snake is now keyboard controllable
	})
	
	
	
	
	
	
	
})
