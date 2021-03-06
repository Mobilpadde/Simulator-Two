var c = document.getElementById("canvas"),
ctx = c.getContext("2d"),
map = new Array(),
ctrl = { x: 1, y: 1, type: 7, offset: 0, s: false };

for(var y = 0; y < 15; y++){
	map[y] = new Array();
	for(var x = 0; x < 15; x++){
		map[y][x] = 0;
	}
}

s.sizes.num = { x: map[0].length, y: map.length };
s.sizes.total.width = s.sizes.width * s.sizes.num.x;
s.sizes.total.height = s.sizes.height * s.sizes.num.y;
s.sizes.prices.mall = (s.sizes.maxWage * 0.1);
s.sizes.prices.hospital = (s.sizes.maxWage * 0.8);
s.sizes.prices.bar = (s.sizes.maxWage * 0.3);
c.width = s.sizes.width * (s.sizes.num.x + 4);
c.height = s.sizes.height * (s.sizes.num.y + 1);

if(window.location.hash){
	var hashMap = JSON.parse(decodeURI(window.location.hash.replace("#", "")));
	var map = ((typeof hashMap == "object") ? hashMap : map);
	var eMap = JSON.parse(JSON.stringify(map)).mapify(); // Exported Map syntaxes
	document.getElementById("use").href = "index.html#" + encodeURI(JSON.stringify(eMap));
}

legend = function(){
	var x = (s.sizes.total.width + (s.sizes.width / 2)), y = s.sizes.height;
	
	ctx.fillStyle = "#fff";
	ctx.font = (s.sizes.height / 2) + "px arial";
	ctx.textBaseline = "top";
	ctx.fillText("Types [num]", x, y);
	
	var i = 0;
	for(var type in s.colours.types){
		i++;
		y += s.sizes.height;
		tile(x, y, 2, type, (i == ctrl.type ? true : false));
		ctx.fillStyle = "#fff";

		ctx.fillText(type.capitalize() + " [" + i + "]", (x + s.sizes.width), y);
	}
	y += s.sizes.height;
	ctx.fillText("Remove [0]", (x + s.sizes.width), y);
	if(!ctrl.type){
		ctx.rect((x - .75), (y - .75), ((s.sizes.width / 2) + 1.5), ((s.sizes.height / 2) + 1.5));
		ctx.fillStyle = "rgba(255, 0, 0, .05)";
		ctx.fill();
		ctx.lineWidth = 1.5;
		ctx.lineDashOffset = ctrl.offset;
		ctx.setLineDash([2, 4]);
		ctx.strokeStyle = "rgba(255, 0, 0, .5)";
		ctx.stroke()
	}
}
tile = function(x, y, size, type, selected){
	var selected = selected || false;
	if(typeof type != "string") return false;
	ctx.fillStyle = s.colours.types[type];
	ctx.fillRect(x, y, (s.sizes.width / size), (s.sizes.height / size));

	if(selected){
		ctx.rect((x - .75), (y - .75), ((s.sizes.width / size) + 1.5), ((s.sizes.height / size) + 1.5));
		ctx.fillStyle = "rgba(255, 0, 0, .05)";
		ctx.fill();
		ctx.lineWidth = 1.5;
		ctx.lineDashOffset = ctrl.offset;
		ctx.setLineDash([2, 4]);
		ctx.strokeStyle = "rgba(255, 0, 0, .5)";
		ctx.stroke()
	}
}
cursor = function(size){
	/*if(ctrl.l){ if(ctrl.x > 1){ ctrl.x-- }else{ ctrl.x = map[0].length } }
	if(ctrl.u){ if(ctrl.y > 1){ ctrl.y-- }else{ ctrl.y = map[0].length } }
	if(ctrl.r){ if(ctrl.x < 14){ ctrl.x++ }else{ ctrl.x = 1 } }
	if(ctrl.d){ if(ctrl.y < 14){ ctrl.y++ }else{ ctrl.y = 1 } }*/
	if(ctrl.s){ place() }

	ctx.rect(((ctrl.x * s.sizes.width) + .75), ((ctrl.y * s.sizes.height) + .75), ((s.sizes.width / size) - 1.5), ((s.sizes.height / size) - 1.5));
	ctx.fillStyle = "rgba(255, 0, 0, .05)";
	ctx.fill();
	ctx.lineWidth = 1.5;
	ctx.lineDashOffset = ctrl.offset;
	ctx.setLineDash([2, 4]);
	ctx.strokeStyle = "rgba(255, 0, 0, .5)";
	ctx.stroke()
}
place = function(){
	var i = 0;
	for(var type in s.colours.types){
		i++;
		if(i == ctrl.type){ map[ctrl.y][ctrl.x] = type }
	}
	if(!ctrl.type) map[ctrl.y][ctrl.x] = 0;
	var eMap = JSON.parse(JSON.stringify(map)).mapify(); // Exported Map syntaxes
	document.getElementById("use").href = "index.html#" + encodeURI(JSON.stringify(eMap));
}
draw = function(){
	//ctx.clearRect(0, 0, s.sizes.total.width, s.sizes.total.height);
	c.width = c.width;
	var rgb = s.colours.assets.sky.day;
	ctx.fillStyle = rgb;
	ctx.fillRect(0, 0, c.width, c.height);

	ctx.fillStyle = s.colours.assets.ground;
	ctx.fillRect(s.sizes.width, s.sizes.height, (s.sizes.total.width - s.sizes.width), (s.sizes.total.height - s.sizes.height));

	for(var y in map){
		for(var x in map){
			tile((x * s.sizes.width), (y * s.sizes.height), 1, map[y][x]);
		}
	}
	legend();
	cursor(1);
}

setInterval(function(){ draw() }, 1000/30);
setInterval(function(){ ctrl.offset++; }, 150);
document.addEventListener("keydown", function(e){
	if(e.keyCode == 32){ ctrl.s = true; } // Space
	switch(e.keyCode){
		case 37: // Left
			if(ctrl.x > 1){ ctrl.x-- }else{ ctrl.x = (map[0].length - 1) }
			break;
		case 38: // Up
			if(ctrl.y > 1){ ctrl.y-- }else{ ctrl.y = (map[0].length - 1) }
			break;
		case 39: // Right
			if(ctrl.x < 14){ ctrl.x++ }else{ ctrl.x = 1 }
			break;
		case 40: // Down
			if(ctrl.y < 14){ ctrl.y++ }else{ ctrl.y = 1 };
			break;
		case 32: // Space
			place();
			break;
	}
	if([48, 56].inBetween(e.keyCode)){ ctrl.type = Math.abs(48 - e.keyCode); } // 57 = 9
});
document.addEventListener("keyup", function(e){
	if(e.keyCode == 32){ ctrl.s = false; } // Space
});