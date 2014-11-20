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
	var bullet_speed;
	var enemy_speed;
	
	 var date ;//orario
	var keyPressed;
	var previous ;
	var lag ;
	var MS_PER_UPDATE;


	function init()
	{
		d = "right"; //default direction
	
		//gestione tastiera
		keyPressed=[];
		 //colpi
		 bullet_array=[];
		 bullet_speed=50;//pixel/second
		 enemy_speed=9 ;
		//finally lets display the score
		score = 0;
		//date mi serve per l'orario
		date = new Date();
		previous = performance.now();
		lag = 0.0;
		MS_PER_UPDATE=50;//aggiorno ogni 50 millisecondi la logica
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms	
		
		
		create_enemy();
		create_wall();  
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 1000/60);
		offset={x:0,y:0,t:0};
		me=new Me( (w-cw)/2, (h-cw)/2,0 ,performance.now());
		
		///////	me={x:(w-cw)/2,y:(h-cw)/2};// la mia posizione
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
			//enemy_array.push({x: Math.round(Math.random()*(w-cw)/cw), y: Math.round(Math.random()*(h-cw)/cw)});
			//	enemy_array.push({x: Math.round(Math.random()*(w-cw)), y: Math.round(Math.random()*(h-cw))});
			enemy_array.push(new Enemy( Math.round(Math.random()*(w-cw)), Math.round(Math.random()*(h-cw)),Math.random()*360,performance.now()));
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
			 
			//wall_array.push({x: Math.round(Math.random()*(w-cw)/cw), y: Math.round(Math.random()*(h-cw)/cw)});
			wall_array.push({x: Math.round(Math.random()*(w-cw)), y: Math.round(Math.random()*(h-cw))});// FARE I MURI come matrice o disegnarli come righe memorizzandoli a coppie di punti
		}
		
		
		
		
		
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	
	 
	
	
	
	
	
	
	/*
	
	vedere se QUESTO MODO DI FARE I PROIETTI LI MI PUO ESSERE UTILE(specialmente le funzioni draw e update direttamente sul bullet)
	 function Bullet(source, dir)
    {
        this.id = "bullet";
        this.width = 10;
        this.height = 3;
        this.dir = dir;

        if (this.dir == 1)
        {
            this.x = source.x + source.width - 5;
            this.y = source.y + 16;
        }
        if (this.dir == -1)
        {
            this.x = source.x;
            this.y = source.y + 16;
        }
    }
    Bullet.prototype.update = function()
    {
        if (this.dir == 1) this.x += 8;
        if (this.dir == -1) this.x -= 8;

        for (var i in game.enemies)
        {
            checkCollisions(this, game.enemies[i]);
        }
        // Check if bullet leaves the viewport
        if (this.x < game.viewX * 32 || this.x > (game.viewX + game.tilesX) * 32)
        {
            removeFromList(game.bullets, this);
        }
    }
    Bullet.prototype.draw = function()
    {
        // bullet flipping uses orientation of the player
        var posX = game.player.scale == 1 ? this.x : (this.x + this.width) * -1;
        game.ctx.scale(game.player.scale, 1); 
        game.ctx.drawImage(gameData.getGfx("bullet"), posX, this.y);
    }
	
	
	 
	

	
	
	
	*/
	
	
	
	//per poter usare questo Bullet CLASSE 
	//bisogna che quando creo il bullet faccio update bullet
	//create_bullet(xpos,ypos,angle,currentTime)
	function Bullet(xpos,ypos,direction,currentTime){
		this.x=xpos;
		this.y=ypos;
		this.t=direction;
		this.time=currentTime;
		this.alive=true;
		this.speed=bullet_speed;
		this.color="green";
	}
	
	
	
	
    Bullet.prototype.update = function()
    {
     //  update_bullet(this);
	   
		var adesso=performance.now();
		var timeDiff=adesso-this.time+1;
		if (timeDiff<1000 && this.alive==true)
		{
			this.x=this.x-Math.sin(gradiToRadianti(this.t))*timeDiff/1000*this.speed;
			this.y=this.y-Math.cos(gradiToRadianti(this.t))*timeDiff/1000*this.speed; 
		}
		else {
			this.alive=false;
			}
	}
	
	
    Bullet.prototype.draw = function()
    {
		//disegno il proiettile
    }
	
	
	
	function Enemy(xpos,ypos,direction,currentTime){
		this.x=xpos;
		this.y=ypos;
		this.t=direction;
		this.time=currentTime;
		this.alive=true;
		this.speed=enemy_speed; 
		this.color="blue";
	}
	
	
	
	
    Enemy.prototype.update = function(x_target,y_target)
    { 
	 
		var rd=relative_direction(this.x,this.y,x_target,y_target);
		this.t=   rnd(rd,40) ;
		var adesso=performance.now();
		var timeDiff=adesso-this.time+1;
		this.time=adesso;
		if (  this.alive==true)
		{
			this.x=this.x-Math.sin(gradiToRadianti(this.t))*timeDiff/1000*	this.speed;
			this.y=this.y 	-Math.cos(gradiToRadianti(this.t))*timeDiff/1000*	this.speed ;  
		}
		else {
			this.alive=false;
			}
		 
    }
	
	
    Enemy.prototype.draw = function()
    {
     //disegno il Enemy
    }
	
	
	
	function Me(xpos,ypos,direction,currentTime){
		this.x=xpos;
		this.y=ypos;
		this.t=direction;
		this.time=currentTime;
		this.alive=true;
		this.speed=enemy_speed; 
		this.color="black";
		this.ammo=50;
		this.life =100;
		this.armor =100;
		this.last_shot_time=currentTime;
	}
	
	
	
    Me.prototype.update = function(x_target,y_target)
    { 
	
	
		
		 
    }
	
    Me.prototype.shoot = function( )
    { 
		var adesso=performance.now();
		if (this.last_shot_time+200<=adesso && 	this.ammo>0)
		{
			this.last_shot_time =adesso;
			bullet_array.push(new Bullet(this.x,this.y,offset.t,adesso));
			this.ammo--;

		}
		
		
		 
    }
	
    Me.prototype.draw = function()
    {
		//disegno il Enemy
    }
	

	
	function Wall(x1,y1,x2,y2  ){
		this.x1=x1;
		this.y1=y1;
		
		this.x2=x2;
		this.y2=y2;
		this.color="red";
	}
	
	
	
	
    Wall.prototype.update = function()
    {
     
	}
	
	
    Wall.prototype.draw = function()
    {
	
	
	
		var tpoint=traslate_point(this.x1,this.y1);
		x1=tpoint.x;
		y1=tpoint.y;
		
		var tpoint=traslate_point(this.x2,this.y2);
		x2=tpoint.x;
		y2=tpoint.y;
		
	 
	  
    }
	
	
	/*non serve piu visto che uso la clase Bullet

	function update_bullet(bullet)
	{ 
		var adesso=performance.now();
		var timeDiff=adesso-bullet.time+1;
		if (timeDiff<1000 && bullet.alive==true)
		{
			bullet.x=bullet.x-Math.sin(gradiToRadianti(bullet.t))*timeDiff/1000*bullet_speed;
			bullet.y=bullet.y-Math.cos(gradiToRadianti(bullet.t))*timeDiff/1000*bullet_speed; 
		}
		else {bullet.alive=false;}
		return bullet;
	}*/
	//Lets paint the snake now
	function paint()
	{
	
	var walll=new Wall(50,20,200,200);
	walll.draw();
		var current = performance.now();
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
										//  bullet_array.push({x:me.x/cw,y:me.y/cw,t:offset.t,time:date.getTime()});
										//bullet_array.push(create_bullet(me.x/cw,me.y/cw,offset.t,current));
										//bullet_array.push(new Bullet(me.x,me.y,offset.t,current));
										me.shoot();
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
		
		 
		// ctx.fillText("  current"+current+"  previous"+previous   +"    lag"+lag+"  elapsed"+elapsed, 25, 25);
		//  ctx.fillText("OX"+offset.x+" OY"+offset.y+" OT"+offset.t+"   meX"+me.x+"   meY"+me.y, 60, h-60);
        ctx.fillText(" LIFE: "+me.life+" ARMOR: "+me.armor+ " AMMO: "+me.ammo , 60, h-60);
		/////////////fine  render();
		 
	}
	//Lets first create a generic function to paint cells
	function paint_cell(x, y,color1)
	{
		  
		var tpoint=traslate_point(x,y);
		x=tpoint.x;
		y=tpoint.y;
	 
		// calcolo le dimensioni in base alla prospettiva
		
		
		//trovo la dimensione del punto da disegnare PROPORZIOnale alla distanza da me
		pcw=(1-distanza(center.x,center.y,x,y)/default_dist)*cw;
		// pcw=cw;
		if (!(x == -1 || x == w || y == -1 || y == h))
		{
		 
			hpcw=pcw/2;//half pcw , x e y sono il centro
		  
			ctx.fillStyle = color1;
			ctx.fillRect(x-hpcw,(y)-hpcw, pcw, pcw);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x-hpcw, y-hpcw, pcw, pcw);
			
			//	 ctx.fillText("    X"+x*cw+"   Y"+y*cw+"   offset.y/cw"+offset.y/cw+"y-((me.y )/cw)"+(y-((me.y )/cw))+" T"+offset.t, x*cw, y*cw);

		}
		
		//ctx.fillText("   me.y"+me.y+"  me.x"+me.x   +"    offset.t"+ offset.t+"  cos"+Math.cos(gradiToRadianti(360-offset.t)) +"  sin"+Math.sin(gradiToRadianti(360-offset.t)) , 25, 25);
	}
	
	function check_collision(x, y, array)//QUESTA FUNZIONE VA AGGIUNTO IL TEMPO e bisogna guardare che 2 array alla volta non si tocchino
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
		//  check_collision(0, 0, bullet_array);
		//    alert("nex");
		for(var i = 0; i < bullet_array.length; i++)
		{
			var c = bullet_array[i];
			//Lets update bullet position
			 
			// c=update_bullet(c);
			c.update();
			if (c.alive==false)
			{
				bullet_array.splice(i,1);//elimino il proiettile
			}
			else{
				bullet_array[i]=c;
				}
		 
		}
		for(var i = 0; i < enemy_array.length; i++)
		{
			var c = enemy_array[i];
			//Lets update bullet position
			 
			 
			c.update(me.x,me.y);
			if (c.alive==false){
				enemy_array.splice(i,1);//elimino il proiettile
				}
			else{
				enemy_array[i]=c;
				}
		 
		}
		

	}
	function relative_position(myx,myy,x,y,direction)
	{
		direction=0;//angolo
		newx=x-myx;
		newy=y-myy;
		return {x: newx, y: newy};
		
		
	}
	
	 function relative_direction(myx,myy,x,y) {
		// calcolo la direzione che devo prendere per andare verso un certo punto
		dy = myy -  y;
		dx = myx -  x;
		theta = Math.atan2(dy, dx);
		theta *= 180/Math.PI // rads to degs
		return -270-theta; 
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
	function rnd_snd() {
		return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
	}
	function rnd(mean, stdev) {
		return Math.round(rnd_snd()*stdev+mean);
		// per una distribuzione normale provare anche ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3
	}



	function traslate_point(x,y){
		//CALCOLO le coordinate del punto dal piano di gioco al piano visuale
		radianti=gradiToRadianti(offset.t);//converto i gradi in radianti
	
		//traslo da rispetto alla mia posizione a rispetto a (0,0)
	 	x=x-((me.x) );
	 	y=y-((me.y )) ;
		//nel quadrato di gioco 0 gradi stanno al posto dei classici 90 gradi e la y cresce andando in giu 
		var xx=(x*Math.cos(radianti)-y*Math.sin(radianti))+offset.x;
		y=(x*Math.sin(radianti)+y*Math.cos(radianti)) +offset.y ;
	
		//risistemo rispetto alla mia posizione
		x=xx;
	    x=x+((me.x));
	 	y=y+((me.y ));
		return{x,y};
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
