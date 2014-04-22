// http://stackoverflow.com/a/3291856/754471
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
// http://stackoverflow.com/a/2532251/754471
function rndmPrprt(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

// Return value from array
Array.prototype.rtrnVl = function(arr){
	var val = arr;
	for(var i = 0; i < this.length; i++){
		val = val[this[i]];
	}
	return val;
}
// Get random value from array
Array.prototype.pckRndm = function(){
    return this[Math.floor(Math.random() * this.length)];
}
// Choose random if
Array.prototype.pckRndmIf = function(){
	var pick = false;
	for(var i = 0; i < homeland.residences.length; i++){
		if(!homeland.residences[i].occupied){
			i = homeland.residences.length;
			pick = true;
		}
	}
	if(!pick){ return false; }else{
		pick = this.pckRndm();
		while(pick.occupied){ pick = this.pckRndm(); }
		return pick;
	}
}
// Random value from two lvl array
Array.prototype.pckRndmX = function(){
	//return this.pckRndm().pckRndm();
	var x = Math.floor(Math.random() * this[0].length), y = Math.floor(Math.random() * this.length),
		info = { x: x, y: y, place: this[y][x] }
	return info;
}
// Return random number between the two in the array;
Array.prototype.rndmNmbr = function(){
	var x = this[0], y = this[1];
	if(x > y){ x = this[1]; y = this[0] }
	return Math.floor(Math.random() * (y - x + 1) + x);
}
// If in bewteen two numbers
Array.prototype.inBetween = function(num){
	if(num >= this[0] && num <= this[1]){
		return true;
	}
	return false;
}
// Fix Map
Array.prototype.redo = function(){
	for(var y in this){
		for(var x in this){
			switch(this[y][x]){
				case "0": this[y][x] = null; break;
				case "b": this[y][x] = "bar"; 		homeland.places.bar.push([x, y]); break;
				case "f": this[y][x] = "factory"; 	homeland.places.factory.push([x, y]); break;
				case "g": this[y][x] = "grass"; 	homeland.places.grass.push([x, y]); break;
				case "h": this[y][x] = "hospital"; 	homeland.places.hospital.push([x, y]); break;
				case "m": this[y][x] = "mall"; 		homeland.places.mall.push([x, y]); break;
				case "p": this[y][x] = "pond"; 		homeland.places.pond.push([x, y]); break;
				case "r": this[y][x] = "road"; 		homeland.places.road.push([x, y]); break;
				case "s": this[y][x] = "shack"; 	homeland.residences.push({"x": x, "y": y, "occupied": false, "food": 50}); break;
				/*
				case "x": 
					this[y][x] = rndmPrprt(s.colours.types);
					while(this[y][x] == "road"){ this[y][x] = rndmPrprt(s.colours.types); }
					//if(this[y][x] == "shack") homeland.residences.push({"x": x, "y": y, "occupied": false, "food": 50});
					switch(this[y][x]){
						case "bar": 		homeland.places.bar.push([x, y]); break;
						case "factory": 	homeland.places.factory.push([x, y]); break;
						case "grass": 		homeland.places.grass.push([x, y]); break;
						case "hospital": 	homeland.places.hospital.push([x, y]); break;
						case "mall": 		homeland.places.mall.push([x, y]); break;
						case "pond": 		homeland.places.pond.push([x, y]); break;
						case "shack": 		homeland.residences.push({"x": x, "y": y, "occupied": false, "food": 50}); break;
					}
					break;
				*/
			}
		}
	}
	return this;
}
// Fix map-maker map
Array.prototype.mapify = function(){
	for(var y in this){
		for(var x in this){
			switch(this[y][x]){
				case "bar": 		this[y][x] = "b"; break;
				case "factory": 	this[y][x] = "f"; break;
				case "grass": 		this[y][x] = "g"; break;
				case "hospital": 	this[y][x] = "h"; break;
				case "mall": 		this[y][x] = "m"; break;
				case "pond": 		this[y][x] = "p"; break;
				case "road": 		this[y][x] = "r"; break;
				case "shack": 		this[y][x] = "s"; break;
			}
		}
	}
	return this;
}
// Make the array usable in graph.js
Array.prototype.graphify = function(){
	for(var y in this){
		for(var x in this){ // b Bar; f Factory; g Grass; h Hospital; m Mall; p Pond; r Road; s Shack; x Random;
			if(["b", "f", "g", "h", "m", "p", "r", "s"].indexOf(this[y][x]) > -1){
				if(this[y][x] == "r"){
					this[y][x] = 1;
				}else if(this[y][x] == "g"){
					this[y][x] = 2;
				}else{
					this[y][x] = 10;
				}
			}else{ this[y][x] = 0 }
		}
	}
	return this;
}
// Fade colours - How to guide: http://stackoverflow.com/a/319604/754471
Array.prototype.fdClrs = function(step, steps){
	var r = [parseInt(this[0].substr(1, 2), 16), parseInt(this[1].substr(1, 2), 16)],
		g = [parseInt(this[0].substr(3, 2), 16), parseInt(this[1].substr(3, 2), 16)],
		b = [parseInt(this[0].substr(5, 2), 16), parseInt(this[1].substr(5, 2), 16)]

	r[3] = Math.abs(r[0] - (Math.round(Math.abs(r[0] - r[1]) / (steps - 0))) * step);
	if(r[3] > 255) r[3] = r[3] - (r[3] - 255); if(r[3] > r[2] || r[3] < r[2]) r[3] = r[2];

	g[3] = Math.abs(g[0] - (Math.round(Math.abs(g[0] - g[1]) / (steps - 0))) * step);
	if(g[3] > 255) g[3] = g[3] - (g[3] - 255); if(g[3] > g[2] || g[3] < g[2]) g[3] = g[2];

	b[3] = Math.abs(b[0] - (Math.round(Math.abs(b[0] - b[1]) / (steps - 0))) * step);
	if(b[3] > 255) b[3] = b[3] - (b[3] - 255); if(b[3] > b[2] || b[3] < b[2]) b[3] = b[2];

	return "rgb( " + r[3] + ", " + g[3] + ", " + b[3] + " )";
}


// Log into summary
var start = homeland.t.day();
var $console = document.getElementById('console');
log = function(data, t){
	var line = document.createElement('li');
	if(!t){
		if(!(homeland.summary.arr[(homeland.t.day() - start)] instanceof Array)){ homeland.summary.arr[(homeland.t.day() - start)] = new Array(); }
		homeland.summary.arr[(homeland.t.day() - start)].push([data, homeland.time]);
		console.log("%c%s%c %s", "color:white; background:black;", "[" + homeland.digital(true) + "]", "color:black; background:white;", data);
		line.innerHTML = "<span>[" + homeland.digital(true) + "]</span> " + data;

	}else{
		console.log("%c%s%c %s", "color:white; background:black;", "[" + homeland.digital(true, t) + "]", "color:black; background:white;", data);
		line.innerHTML = "<span>[" + homeland.digital(true, t) + "]</span> " + data;
	}

	$console.appendChild(line);
	$console.scrollTop = $console.scrollHeight; // Scrolls to bottom of list
};