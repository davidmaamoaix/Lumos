var key_stats={'W':false,'A':false,'S':false,'D':false,'ArrowLeft':false,'ArrowRight':false,'ArrowUp':false,'ArrowDown':false,};

document.addEventListener("keydown",function(event){
	key_stats[event.key]=true;
});

document.addEventListener("keyup",function(event){
	key_stats[event.key]=false;
});

function key_down(key){
	return key_stats[key];
}