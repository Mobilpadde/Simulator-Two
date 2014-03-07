var build = {
	log: {
		work: 			function(n, p, h)	{ log(n + " received a check worth $" + p.toFixed(1) + " for " + h + " hour" + (h == 1 ? "" : "s") + " of work") },
		spent: 			function(n, s, p)	{ log(n + " just spent $" + s.toString() + " at the " + p); },
		drunk: 			function(n)			{ log(n + " is a bit drunk now"); },
		sober: 			function(n)			{ log(n + " is now completely sober"); },
		healthy: 		function(n)			{ log(n + " is now perfectly healthy"); },
		dead: 			function(n, g)		{ log("Sadly " + n + " has passed away, " + (g ? "" : "s") + "he'll be missed!"); },
		newResident: 	function(n, a)		{ log(n + " (age " + a + ") has just moved in, yay!"); },
		homelandFull: 	function()			{ log("Homeland is full, we can no longer support new residents"); },
		birthday: 		function(n, g, a)	{ log("Today is " + n + "'s birthday, " + (g ? "" : "s") + "he's now " + a + " years old! Yay"); }
	},
	tile: function(x, y, size, type){
		if(typeof type != "string") return false;
		ctx.fillStyle = s.colours.types[type];
		ctx.fillRect(x, y, (s.sizes.width / size), (s.sizes.height / size));
	},
	legend: function(){
		var x = (s.sizes.total.width + (s.sizes.width / 2)), y = s.sizes.height;
		
		ctx.fillStyle = "#fff";
		ctx.font = (s.sizes.height / 2) + "px arial";
		ctx.textBaseline = "top";
		ctx.fillText("Legend:", x, y);
		
		for(var type in s.colours.types){
			var i = 0;
			y += s.sizes.height;
			build.tile(x, y, 2, type);
			ctx.fillStyle = "#fff";

			for(var j=0; j<homeland.residents.length; j++){ if(homeland.residents[j].mind.pos.now.place == type) i++; }

			ctx.fillText(type.capitalize() + " (" + i + ")", (x + s.sizes.width), y);
		}
	},
	info: function(){
		var x = s.sizes.width, y = (s.sizes.total.height + (s.sizes.height / 2)),
			info = { wealth: 0, men: 0, women: 0, avgAge: 0 },
			year, day;

		for(var i=0; i<homeland.residents.length; i++){
			var dwell = homeland.residents[i];
			info.wealth += dwell.wealth;
			(dwell.gender ? info.men++ : info.women++);
			info.avgAge += dwell.age;
		}
		info.avgAge = info.avgAge / (homeland.residents.length - 1);
		
		ctx.fillStyle = "#fff";
		ctx.font = (s.sizes.height / 2) + "px arial";
		ctx.textBaseline = "top";

		year = Math.floor(homeland.t.yrs());
		day = Math.floor(homeland.t.day() % s.sizes.yearLength);
		//ctx.fillText("Day " + day + " (Year " + year + ") of Slavetopia!", x, y);
		ctx.fillText("Day " + day + " (Year " + year + ") of " + s.name + "! (" + homeland.digital() + ")", x, y);
		y += s.sizes.height;
		ctx.fillText("A total of $" + info.wealth.toFixed(2) + " is being shared between " + homeland.residents.length + " residents", x, y);
		y += s.sizes.height;
		var m = (info.men == 1 ? " man" : " men"),
			w = (info.women == 1 ? " woman" : " women");
		ctx.fillText("Of these " + homeland.residents.length + 
					 " residents, you've got " + info.men + m + 
					 " and " + info.women + w + " (Avg. age: " + info.avgAge.toFixed(1) + ")", x, y);
	},
	game: {
		draw: function(){
			requestAnimationFrame(build.game.draw);

			// On the first day god created the sky
			var rgb = s.colours.assets.sky.day;
			if([0, 8].inBetween(homeland.t.hrs() % 24)){
				rgb = [s.colours.assets.sky.night, s.colours.assets.sky.day].fdClrs(Math.round(homeland.t.hrs() % 24), 8);
			}else if([16, 24].inBetween(homeland.t.hrs() % 24)){
				rgb = [s.colours.assets.sky.day, s.colours.assets.sky.night].fdClrs((Math.round(homeland.t.hrs() % 24) - 15), 8);
			}
			ctx.fillStyle = rgb;
			ctx.fillRect(0, 0, c.width, c.height);

			// The next day, he decided it'd be nice with a solid ground; thus he created the earth
			ctx.fillStyle = s.colours.assets.ground;
			ctx.fillRect(s.sizes.width, s.sizes.height, (s.sizes.total.width - s.sizes.width), (s.sizes.total.height - s.sizes.height));

			// On the third day he got bored and built a lot of bars, malls and homes (And probably some other, less important, stuff)
			for(var y in map){
				for(var x in map){
					build.tile((x * s.sizes.width), (y * s.sizes.height), 1, map[y][x]);
				}
			}
			build.legend();
			build.info();

			// Now, because god was greedy, he made people visible so he'd steal their stuff
			for(var i = 0; i < homeland.residents.length; i++){
				var resident = homeland.residents[i];

				ctx.beginPath();
				ctx.arc((resident.x + (s.sizes.width / 2)), (resident.y + (s.sizes.height / 2)), (s.sizes.radius + resident.fat), Math.PI*2, false);
				ctx.closePath();
				ctx.fillStyle = (resident.highlight ? s.colours.assets.highlight : resident.colour);
				ctx.fill();
				resident.actions.walk();
			}
		},
		init: function(){
			for(var i=0; i<5; i++){ homeland.dwell.new(); }
			homeland.dwell.changeMinds();
			build.game.draw();

			// And at last, because the people got mad at him, he decided let them age once a year, to eventually grow old and die... Yay
			setInterval(function(){
				var tried = false;
				homeland.time++;
				for(var i=0; i<homeland.residents.length; i++){
					var dwell = homeland.residents[i];
					dwell.mind.hunger++;
					if(dwell.birthday == Math.floor(homeland.t.day() % s.sizes.yearLength) && homeland.t.min() % 60 == 1 && homeland.t.hrs() % 24 == 0){
						dwell.age++;
						build.log.birthday(dwell.name, dwell.gender, dwell.age);
					}else if(homeland.t.min() % 60 == 1 && homeland.t.hrs() % 24 == 0 && !tried && (s.sizes.mr == 0 || !(s.sizes.mr <= homeland.residents.length))){
						if(Math.round(Math.random())){ homeland.dwell.new() }
						tried = true;
					}
				}
			}, (s.sizes.dayLength / 24 / 60) * 1000);
		}
	}
}