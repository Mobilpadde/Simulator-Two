var c = document.getElementById("canvas"),
	ctx = c.getContext("2d");

if(window.location.hash){
	var hashMap = JSON.parse(window.location.hash.replace("#", ""));
	var map = ((typeof hashMap == "object") ? hashMap : map);
}
var graph = new Graph(JSON.parse(JSON.stringify(map)).graphify());
map.redo();
document.getElementById("edit").href = "map.html#" + JSON.stringify(map);

// Set unset values
s.sizes.num = map[0].length;
s.sizes.total.width = s.sizes.width * s.sizes.num;
s.sizes.total.height = s.sizes.height * s.sizes.num;
s.sizes.prices.mall = (s.sizes.maxWage * 0.1);
s.sizes.prices.hospital = (s.sizes.maxWage * 0.8);
s.sizes.prices.bar = (s.sizes.maxWage * 0.3);
c.width = s.sizes.width * (s.sizes.num + 4);
c.height = s.sizes.height * (s.sizes.num + 3.5);



build.game.init();