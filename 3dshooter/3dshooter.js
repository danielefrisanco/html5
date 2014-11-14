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
	var enemy_array; //an array of cells
	var bullet_array;// array dei colpi sparati
	 var date ;//orario
	var keyPressed;
	var previous ;
var lag ;
var MS_PER_UPDATE;


	function init()
	{
		d = "right"; //default direction
		create_enemy();
		create_wall();  
		//gestione tastiera
		keyPressed=[];
		 //colpi
		 bullet_array=[];
		//finally lets display the score
		score = 0;
		//date mi serve per l'orario
		date = new Date();
		previous = date.getTime();
  lag = 0.0;
  MS_PER_UPDATE=50;//aggiorno ogni 50 millisecondi la logica
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 1000/60);
		offset={x:0,y:0,t:0};
		me={x:(w-cw)/2,y:(h-cw)/2};// la mia posizione
		center={x:(w-cw)/2,y:(h-cw)/2};//centro
		// 
		default_dist=distanza(me.x,me.y,0,0);
	}
	init();
	/*
	
	DA USARE AL POStO del gameloop
;(function () {
  function main( tFrame ) {
    MyGame.stopMain = window.requestAnimationFrame( main );
    //tFrame è l'orario
    update( tFrame ); //Call your update method. In our case, we give it rAF's timestamp.
    render();
  }
  
  
  //INIT
  main(performance.now()); // Start the cycle
})();
	
	
	
	*/
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
	
	 var current = date.getTime();
	 var elapsed = current - previous;
     previous = current;
    lag += elapsed;
  
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		 
		  //processInput();
   if(keyPressed["37"]) { offset.t =(offset.t+6)%360;}
	 if(keyPressed["39"]) { offset.t=(offset.t-6)%360;}
	 if(keyPressed["38"]) {    //mi devo spostare in su rispetto all'area di gioco ma lo converto nel piano cartesiano
										me.y=me.y- Math.cos(gradiToRadianti(360-offset.t));  
										 me.x=me.x+Math.sin(gradiToRadianti(360-offset.t));   
										 offset.y=center.y-me.y;
										 offset.x=center.x-me.x;
										  
										}
	 if(keyPressed["40"]) {  	   //mi devo spostare in giu rispetto all'area di gioco ma lo converto nel piano cartesiano
											me.y=me.y+Math.cos(gradiToRadianti(360-offset.t));
											 me.x=me.x-Math.sin(gradiToRadianti(360-offset.t));   
												offset.y=center.y-me.y;
												offset.x=center.x-me.x;
												
											}

  
  
   
   if(keyPressed["32"]) {//space 
   bullet_array.push({x:me.x/cw,y:me.y/cw,t:offset.t,time:date.getTime()});
   
   //x e y devono essere diversi
								}
   
   
   /////////////FINE processInput();
   
   
     while (lag >= MS_PER_UPDATE)
  {
  
  // eseguo la logica indipendentemente dal rendering
     update();
     lag -= MS_PER_UPDATE;
  }

 
 

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
		
		
	 ////////////// render();
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
		//Lets paint the bullets
		
		for(var i = 0; i < bullet_array.length; i++)
		{
			var c = bullet_array[i];
			//Lets paint 10px wide cells
			 
			paint_cell(c.x, c.y,"green");
		 
		 
		}
		
	//	paint me
		 	 ctx.fillStyle ="black";
			ctx.fillRect(me.x+offset.x -cw/2,me.y+offset.y -cw/2, cw, cw);
			 
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
		
		 
		 /// ctx.fillText("  current"+current+"  previous"+previous   +"    lag"+lag+"  elapsed"+elapsed, 25, 25);
       //  ctx.fillText("OX"+offset.x+" OY"+offset.y+" OT"+offset.t+"   meX"+me.x+"   meY"+me.y, 60, h-60);
         ctx.fillText("mex"+me.x+" mey"+me.y, 60, h-60);
/////////////fine  render();
		 
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
		 var xx=(x*Math.cos(radianti)-y*Math.sin(radianti))+offset.x/cw;
		 y=(x*Math.sin(radianti)+y*Math.cos(radianti)) +offset.y/cw ;
	
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
			
     //	 ctx.fillText("    X"+x*cw+"   Y"+y*cw+"   offset.y/cw"+offset.y/cw+"y-((me.y )/cw)"+(y-((me.y )/cw))+" T"+offset.t, x*cw, y*cw);

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
	
	
	function update( )
	{
		 //aggiorna tutto(movimenti dei nemici collisioni proiettili ecc
		  check_collision(0, 0, bullet_array);
		 

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

	
	/*TODO
	-enemies must move
	-manage collision
	-shooting
	-score(life ecc)
	-respawn
	-ammunition and new weapon
	-sprites//new Image
	 -rifare il gameloop (requestAnimationFrame)
	-Usare il moUse???
	-meta scermo sopra deve avere la prospettiva rispetot a sopra e viceversa il sotto
	- puo essere una specie di galaga o gtalondon e poi ne faccio un'altro che diventa wolfenstein 3d
	
	
	
	
	
	
	
	*/
	
	
	
	/*
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		
		if(key == "37") d = "left";
		else if(key == "38" ) d = "up";
		else if(key == "39" ) d = "right";
		else if(key == "40" ) d = "down";
		 


		//if(d == "right") { offset.x++;}
		//else if(d == "left") { offset.x--;}
		

											
	})
	*/
	
	document.addEventListener('keydown',
											function(e) {  keyPressed[e.keyCode] = true;},
											false);
	document.addEventListener('keyup',
											function(e) {   keyPressed[e.keyCode] = false;},
											false);
  
	
})
