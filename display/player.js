let MAXFALL=20;
let MAXSPEED=15;

var x;
var y;
var jumping;
var momentumU;
var momentumD;
var momentumH;
var player_size;

function start(){
	x=100;
	y=125;
	jumping=false;
	momentumH=0;
	momentumD=0;
	momentumU=0;
	player_size=50;
	add_item(draw_player);
	setInterval(update,40);
}

function update(){
	if(key_down("w")) jump();
	move();
	physics();
	x+=momentumH;
	y-=momentumU;
	y+=momentumD;
}

function jump(){
	if(!hit("down")) return;
	jumping=true;
	momentumU=30;
}

function physics(){
	if(momentumD==0) momentumD=2;
		momentumD*=1.4;
	if(momentumD>MAXFALL) momentumD=MAXFALL;
	momentumU*=0.85;
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
		momentumH-=2;
		if(momentumH>0){
			momentumH-=1.5;
		}
		if(momentumH<MAXSPEED*-1){
			momentumH=MAXSPEED*-1;
		}
	}
	if(key_down("d")){
		momentumH+=2;
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
	let lib_1={"up":[-0.95,-1],"down":[-0.95,1],"left":[-1,-0.95],"right":[1,-0.95]};
	let lib_2={"up":[0.95,-1],"down":[0.95,1],"left":[-1,0.95],"right":[1,0.95]};
	var r=player_size/2;
	if(collide(add(add([x_,y_],scale(lib[dir],r)),lib[dir]))||
		collide(add(add([x_,y_],scale(lib_1[dir],r)),lib_1[dir]))||
		collide(add(add([x_,y_],scale(lib_2[dir],r)),lib_2[dir]))){
		if(!pos){
			while(collide(add([x,y],scale(lib[dir],r)))||collide(add([x,y],scale(lib[dir],r)))){
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
	ctx.fillRect(x-(player_size/2),y-(player_size/2),player_size,player_size);
}

document.onload=start();