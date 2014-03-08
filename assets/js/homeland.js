var homeland = {
	residences: [],
	residents: [],
	dwell: {
		new: function(){ // Yay, babies! (Or a new arrrival)
			var home = homeland.residences.pckRndmIf(),
				_this = {};

			if(home){
				home.occupied 	= true;
				_this.age		= [16, 60].rndmNmbr();
				_this.birthday	= [1, s.sizes.yearLength].rndmNmbr()
				_this.gender 	= Math.round(Math.random());
				_this.name		= (_this.gender ? names[0].pckRndm() : names[1].pckRndm());
				_this.colour 	= s.colours.human.pckRndm();
				_this.wealth	= [20, 100].rndmNmbr();
				_this.home 		= home;
				_this.x 		= (home.x * s.sizes.width);
				_this.y 		= (home.y * s.sizes.height);
				_this.arrived	= false;
				_this.waiting 	= false;
				_this.highlight = false;
				_this.fat 		= [0, 3].rndmNmbr();
				_this.mind		= {
					pos: {
						wish: { // Where Dwell want to go
							x: home.x, y: home.y,
							place: "shack",
							path: new Array([home.x, home.y])
						},
						now: { // Where dwell is right now
							x: home.x, y: home.y,
							place: "shack",
							step: 0
						}
					},
					patience: (s.sizes.wait.rndmNmbr() * 1000),
					drunkness: 0,
					health: 100,
					hunger: 0
				}
				_this.work = {
					skill: 0.0, // Work free until first promotion
					inc: ((s.sizes.dayLength * [1, 5].pckRndm()) / 24), // Hours to work before skill increase
					hours: 14 // In-game hours worked in total (15 equals to inc(3) hours)
				}
				_this.actions = {
					walk: function(){ // Just keep swimming. Just keep swimming.
						if(_this.mind.pos.wish.path != ""){
							if(!_this.mind.pos.wish.path[_this.mind.pos.now.step]) _this.mind.pos.now.step--;
							var coordinates = {
								x: (_this.mind.pos.wish.path[_this.mind.pos.now.step][0] * s.sizes.width),
								y: (_this.mind.pos.wish.path[_this.mind.pos.now.step][1] * s.sizes.height)
							},
							ibX = [(coordinates.x - (s.sizes.width / 5)), (coordinates.x + (s.sizes.width / 5))].inBetween(_this.x),
							ibY = [(coordinates.y - (s.sizes.height / 5)), (coordinates.y + (s.sizes.height / 5))].inBetween(_this.y),
							moved = false;

							if(!ibX /* _this.x != coordinates.x */ && !_this.waiting){
								if(_this.x > coordinates.x){
									_this.x -= (_this.mind.pos.now.place == "road" ? (s.sizes.speed * 1.5) : s.sizes.speed);
								}else{
									_this.x += (_this.mind.pos.now.place == "road" ? (s.sizes.speed * 1.5) : s.sizes.speed);
								}
								moved = true;
							}else if(!ibY /* _this.y != coordinates.y  && !moved */ && !_this.waiting){
								if(_this.y > coordinates.y){
									_this.y -= (_this.mind.pos.now.place == "road" ? (s.sizes.speed * 1.5) : s.sizes.speed);
								}else{
									_this.y += (_this.mind.pos.now.place == "road" ? (s.sizes.speed * 1.5) : s.sizes.speed);
								}
							}else if(_this.mind.pos.now.step < (_this.mind.pos.wish.path.length - 1)){
								_this.mind.pos.now.step++;
								_this.mind.pos.now.x = _this.mind.pos.wish.path[_this.mind.pos.now.step][0];
								_this.mind.pos.now.y = _this.mind.pos.wish.path[_this.mind.pos.now.step][1];
								_this.mind.pos.now.place = [_this.mind.pos.now.y, _this.mind.pos.now.x].rtrnVl(map);
							}else if( /*_this.x == coordinates.x && _this.y == coordinates.y */ ibX && ibY && !_this.arrived){
								_this.arrived = true;
							}else if(_this.arrived && !_this.waiting){
								_this.waiting = true;
								if(s.actions.work.indexOf(_this.mind.pos.wish.place) > -1){
									_this.actions.work();
								}else if(s.actions.spend.indexOf(_this.mind.pos.wish.place) > -1){
									_this.actions.spend();
								}else if(s.actions.chill.indexOf(_this.mind.pos.wish.place) > -1){
									_this.actions.chill();
								}else{
									(function(_this){
										setTimeout(function(){
											_this.actions.think();
										}, _this.mind.patience)
									})(_this)
								}
							}else{
								if(!_this.waiting) _this.actions.die();
							}

							//  && ![0, 2].rndmNmbr()
							if(_this.mind.drunkness > (50 * Math.random())){
								(Math.round(Math.random()) ? _this.x-- : _this.x++);
								(Math.round(Math.random()) ? _this.y-- : _this.y++);
							}
						}else{
							_this.actions.think();
						}
					},
					work: function(){
						(function(_this){
							var payment = hours = 0, interval = setInterval(function(){
								payment += s.sizes.maxWage * _this.work.skill;
								//_this.wealth += payment;
								_this.work.hours++;
								hours++;
								if(((_this.work.hours / _this.work.inc) % 1) == 0 && _this.work.skill < s.sizes.maxSkill){ _this.work.skill += 0.1 }
								if(_this.mind.drunkness && [0, _this.mind.drunkness].pckRndm()){ _this.mind.health-- } // It's, like, dangerous to work whilst drunk!
							}, ((s.sizes.dayLength / 24) * 1000))
							setTimeout(function(){
								clearInterval(interval);
								payment = parseInt(payment);
								_this.wealth += payment;
								build.log.work(_this.name, payment, hours);
								_this.actions.think();
							}, _this.mind.patience)
						})(_this)
					},
					spend: function(){
						(function(_this){
							var interval = setInterval(function(){
								if(s.actions.drink.indexOf(_this.mind.pos.wish.place) > -1){ _this.mind.drunkness++; }
							}, ((s.sizes.dayLength / 24) / 2) * 1000)
							setTimeout(function(){
								if(s.actions.spend.indexOf(_this.mind.pos.wish.place) > -1){
									clearInterval(interval);
									var spending = (s.sizes.prices[_this.mind.pos.wish.place] * (1 + ((_this.mind.patience / 100000) * 2))).toFixed(2);
									_this.wealth -= spending;
									build.log.spent(_this.name, spending, _this.mind.pos.wish.place);
									if(s.actions.drink.indexOf(_this.mind.pos.wish.place) > -1){
										build.log.drunk(_this.name);
									}
									if(s.actions.heal.indexOf(_this.mind.pos.wish.place) > -1){ _this.actions.heal() }
								}
								_this.actions.think();
							}, _this.mind.patience)
						})(_this)
					},
					chill: function(){
						(function(_this){
							var interval = setInterval(function(){
								if(_this.mind.drunkness){
									_this.mind.drunkness--;
									if(!_this.mind.drunkness){
										build.log.sober(_this.name);
									}
								}
							}, (s.sizes.dayLength / 24) * 1000)
							setTimeout(function(){
								clearInterval(interval);
								_this.mind.patience = (s.sizes.wait.rndmNmbr() * 1000);
								_this.actions.think();
							}, _this.mind.patience)
						})(_this)
					},
					heal: function(){
						_this.mind.health = 100;
						_this.mind.drunkness = 0;
						build.log.healthy(_this.name);
					},
					think: function(){ // Must be incredibly sad to have your mind controlled by a simple function
						/*
						var placeChosen = false, info = map.pckRndmX(), result, res = new Array(), start = new Date().getTime();
						while(!placeChosen && !((new Date().getTime() - start) > 5000)){
							if(
								(s.actions.noGo.indexOf(info.place) > -1) ||  // You shouldn't really visit these places
							   	(_this.mind.drunkness > 5 && s.actions.work.indexOf(info.place) > -1) || // Don't work if you're drunk as fuck
							   	//(_this.mind.drunkness >= 10 && !(s.actions.chill.indexOf(info.place) > -1)) || // Go chill if you're that drunk
							   	(_this.mind.drunkness > (50 * Math.random()) && !(s.actions.chill.indexOf(info.palce) > -1)) || // If you're drunk, you'd probably chill
							   	(_this.wealth >= [100, 200].pckRndm() && !(s.actions.spend.indexOf(info.place) > -1)) || // Go on a spending spree! You're rich!
							   	(_this.wealth < (30 * Math.random()) && !(s.actions.work.indexOf(info.place) > -1)) || // You'd probably work a bit more
							   	(_this.age < 18 && s.actions.drink.indexOf(info.place) > -1) || // You're too young to go to bars!
							   	(_this.mind.health < (30 * Math.random()) && !(s.actions.heal.indexOf(info.place) > -1)) || // You'd probably go see a doctor...
							   	(_this.mind.health > 90 && s.actions.heal.indexOf(info.place) > -1) // Wow, you're very healthy
							   	){ 
								info = map.pckRndmX();
							}else{ placeChosen = true; }
						}

						if((s.actions.noGo.indexOf(info.place) > -1)){ info.place = "shack" }
						if(info.place == "shack"){ info.x = _this.home.x; info.y = _this.home.y }
						_this.mind.pos.wish = info;

						result = astar.search(graph.nodes, 
											  graph.nodes[Math.round(_this.y / s.sizes.height)][Math.round(_this.x / s.sizes.width)], 
											  graph.nodes[_this.mind.pos.wish.y][_this.mind.pos.wish.x], false);

						if(result[0] == undefined){ _this.actions.think(); }else{
							for(var i = 0; i < result.length; i++){ res.push([result[i].y, result[i].x]); }
							_this.mind.pos.wish.path = res;
						

							_this.mind.pos.now.step = 0;
							_this.stop = false;
							_this.waiting = false;
							_this.arrived = false;
						}
						*/
						var result, res = [], info = {}, locations = ["bar", "factory", "grass", "hospital", "pond", "mall", "home"], location = locations.pckRndm();
						if(location == "home"){
							info.place = "shack";
							info.x = _this.home.x; info.y = _this.home.y;
							_this.mind.pos.wish = info;
						}else{
							while(!homeland.places[location].length){ // Array is empty
								location = locations.pckRndm()
							}

							destination = homeland.places[location].pckRndm();
							info.place = location;
							info.x = destination[0]; info.y = destination[1];
							_this.mind.pos.wish = info;
						}

						result = astar.search(graph.nodes, 
											  graph.nodes[Math.round(_this.y / s.sizes.height)][Math.round(_this.x / s.sizes.width)], 
											  graph.nodes[_this.mind.pos.wish.y][_this.mind.pos.wish.x], false);

						if(result[0] == undefined){ _this.actions.think(); }else{
							for(var i = 0; i < result.length; i++){ res.push([result[i].y, result[i].x]); }
							_this.mind.pos.wish.path = res;

							_this.mind.pos.now.step = 0;
							_this.stop = false;
							_this.waiting = false;
							_this.arrived = false;
						}
					},
					die: function(){ // DIE, MOFO! D:<
						for(var i = 0; i < homeland.residents.length; i++){
							if(_this == homeland.residents[i]){
								homeland.residents[i].home.occupied = false;
								homeland.residents.splice(i, 1);
								build.log.dead(_this.name, _this.gender);
								break;
							}
						}
					}
				}

				homeland.residents.push(_this);
				build.log.newResident(_this.name, _this.age);
			}else{
				build.log.homelandFull("Homeland is full, we can no longer support new residents");
			}
		},
		rethink: function(){ // Find a new place for dwell and calculate a path
			for(var i = 0; i < homeland.residents.length; i++){ homeland.residents[i].actions.think(); }
		}
	},
	places: {
		bar: new Array(),
		factory: new Array(),
		grass: new Array(),
		hospital: new Array(),
		mall: new Array(),
		pond: new Array(),
		road: new Array(),
		shack: new Array(),
	},
	fill: function(){
		for(var i = 0; i < homeland.residences.length; i++){ homeland.dwell.new(); }
	},
	time: (60 * 24 * (s.sizes.yearLength * 1)) + (60 * 24),
	t: {
		min: function(t){ return (t ? parseInt(t) : parseInt(homeland.time)) },
		hrs: function(t){ return (t ? parseInt(t / 60) : parseInt(homeland.t.min() / 60)) },
		day: function(t){ return (t ? parseInt(parseInt(t / 60) / 24) : parseInt(homeland.t.hrs() / 24)) },
		yrs: function(t){ return (t ? parseInt(parseInt(parseInt(t / 60) / 24) / s.sizes.yearLength) : parseInt(homeland.t.day() / s.sizes.yearLength)) },
		add: {
			min: function(i){ return homeland.time += i },
			hrs: function(i){ return homeland.time += i * 60 },
			day: function(i){ return homeland.time += i * 60 * 24 },
			yrs: function(i){ return homeland.time += i * 60 * 24 * s.sizes.yearLength }
		},
		sub: { // Substract
			min: function(i){ return homeland.time -= i },
			hrs: function(i){ return homeland.time -= i * 60 },
			day: function(i){ return homeland.time -= i * 60 * 24 },
			yrs: function(i){ return homeland.time -= i * 60 * 24 * s.sizes.yearLength }
		}
	},
	digital: function(yd, t){
		var t = t || false,
			hours = Math.floor(homeland.t.hrs(t) % 24),
			minutes = Math.floor(homeland.t.min(t) % 60);
		if(hours < 10) hours = "0" + hours;
		if(minutes < 10) minutes = "0" + minutes;

		var txt = hours + ":" + minutes;
		if(yd){
			var day = Math.floor(homeland.t.day(t) % s.sizes.yearLength); day = (day < 100 ? (day < 10 ? "00" + day : "0" + day) : day);
			var year = homeland.t.yrs(t); year = (year < 100 ? (year < 10 ? "00" + year : "0" + year) : year);
			txt = "Day " + day + " of Year " + year + " | " + txt;
		}
		return txt;
	},
	summary: {
		arr: new Object(),
		day: function(n){ 
			console.groupCollapsed("Summary of Day", n); 
			for(var i in homeland.summary.arr.day[n-1]){
				var info = homeland.summary.arr.day[n-1][i];
				if(typeof info[0] == "string") log(info[0], info[1]);
			}
			console.groupEnd();
		},
		week: function(n){ 
			console.groupCollapsed("Summary of Week", n); 
			for(var i = ((n * 7) - 6); i <= (n * 7); i++){
				homeland.summary.day(i);
			}
			console.groupEnd();
		},
		month: function(n){ 
			console.groupCollapsed("Summary of Month", n); 
			for(var i = ((n * 4) - 3); i <= (n * 4); i++){
				homeland.summary.week(i);
			}
			console.groupEnd();
		},
		year: function(n){ 
			console.groupCollapsed("Summary of Year", n); 
			for(var i = ((n * 12) - 11); i <= (n * 12); i++){
				homeland.summary.month(i);
			}
			console.groupEnd();
		},
		all: function(){ 
			console.groupCollapsed("Summary of everything"); 
			for(var i = 1; i <= homeland.t.yrs(); i++){
				homeland.summary.year(i);
			}
			console.groupEnd();
		}
	}
}