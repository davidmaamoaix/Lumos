let MAXFALL=10;
let MAXSPEED=7;

var x;
var y;
var jumping;
var momentumU;
var momentumD;
var momentumH;
var player_size;

function start(){
	x=120;
	y=100;
	jumping=false;
	momentumH=0;
	momentumD=0;
	momentumU=0;
	player_size=50;
	add_item(draw_player);
	window.requestAnimationFrame(update);
}

function update(){
	if(key_down("w")) jump();
	move();
	physics();
	x+=momentumH;
	y-=momentumU;
	y+=momentumD;
	window.requestAnimationFrame(update);
}

function jump(){
	if(!hit("down")) return;
	jumping=true;
	momentumU=15;
}

function physics(){
	if(momentumD==0) momentumD=2;
		momentumD*=1.4;
	if(momentumD>MAXFALL) momentumD=MAXFALL;
	momentumU*=0.93;
	if(momentumU<=3){
		momentumU=0;
		jumping=false;
	}
	if(hit("up")) momentumU=0;
	if(hit("down")||jumping)momentumD=0;
	for(var i=0;i<momentumD;i+=7){
		if(hit("down",[x,y+i])){
			momentumD=i;
			break;
		}
	}
}

function move(){
	if(key_down("a")){
		momentumH-=1;
		if(momentumH>0){
			momentumH-=1.5;
		}
		if(momentumH<MAXSPEED*-1){
			momentumH=MAXSPEED*-1;
		}
	}
	if(key_down("d")){
		momentumH+=1;
		if(momentumH<0){
			momentumH+=1.5;
		}
		if(momentumH>MAXSPEED){
			momentumH=MAXSPEED;
		}
	}
	momentumH*=0.9;
	if(Math.abs(momentumH)<0.1){
		momentumH=0;
	}
	if((hit("left")&&momentumH<0)||(hit("right")&&momentumH>0)) momentumH=0;
	for(var i=0;i<Math.abs(momentumH);i+=7){
		if(hit("left",[x-i,y])&&momentumH<0){
			momentumH=-i;
			break;
		}
		if(hit("right",[x-i,y])&&momentumH>0){
			momentumH=i;
			break;
		}
	}
}

function hit(dir,pos=null){
	var x_=pos?pos[0]:x;
	var y_=pos?pos[1]:y;
	let lib={"up":[0,-1],"down":[0,1],"left":[-1,0],"right":[1,0]};
	var r=player_size/2;
	if(collide(add(add([x_,y_],scale(lib[dir],r)),lib[dir]))){
		if(!pos){
			while(collide(add([x,y],scale(lib[dir],r)))){
				var newPos=add([x,y],scale(lib[dir],-1));
				x=newPos[0];
				y=newPos[1];
			}
		}
		return true;
	}
	return false;
}

function draw_player(ctx,inverse=false){
	ctx.fillStyle=inverse?"#FFF":"#333";
	ctx.beginPath();
	var points=[[x-(player_size/2),y-(player_size/2)],
				[x-(player_size/2),y+(player_size/2)],
				[x+(player_size/2),y+(player_size/2)],
				[x+(player_size/2),y-(player_size/2)]];

	var vStretch=Math.abs(momentumH);
	var mul=player_size/50;
	var xSize=player_size/2-((vStretch/2)+(momentumD/2))*mul;
	var ySize=player_size/2+((vStretch/4)-(momentumU/1.25)+(momentumD/1.5))*mul;
	var rotation=-momentumH/8;
	ctx.ellipse(x,y-(vStretch/4),xSize,ySize,rotation,0,2*Math.PI);
	ctx.fill();
}

document.onload=start();