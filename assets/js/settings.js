var s = { // Settings
	name: "Slavetopia",
	sizes: { 
		width: 35, 
		height: 32,
		radius: 5,
		num	: null,
		total	: {
			width	: null,
			height: null
		},
		wait: [5, 30], // How long they stay in the same place (Random between two numbers); seconds
		dayLength: 120, // Length of days; seconds
		yearLength: 360, // Length of a Slave-topia year (In ingame days)
		maxWage: 60, // maxWage * skill = current pay (e.g 60 * 0.4 = $24)
		maxSkill: 1.0, // If this is higher than one, max salery will automaticly increase
		prices: {
			mall: null,
			hospital: null,
			bar: null
		},
		speed: .5, // How fast should residents when they walk? (Running will be 1.5 times as fast); in pixels
		mr: 7 // Max residents (0 = Infinite)
	}, 
	colours: {
		assets: {
			ground: "#b29175",
			sky: {
				day: "#90d5fe",
				night: "#1f1f1f"
			},
			highlight: "#ff0000"
		},
		types: {
			bar: "#8ec5ac",
			factory: "#f1785b",
			grass: "#a0d626",
			hospital: "#eff1f0",
			mall: "#f0cd5b",
			pond: "#c9f4ff",
			road: "#808080",
			shack: "#a44b68",
		},
		human: ["#f1edf2", "#ebceae", "#f3ccb3", "#bf9084", "#3f2d28"]
	},
	actions: {
		noGo: ["road", null], // Do not go to these paticular places, that'd just be stupid
		work: ["factory"],
		spend: ["mall", "hospital", "bar"],
		chill: ["shack", "grass"],
		drink: ["bar"],
		heal: ["hospital"]
	},
},
map = [ // b Bar; f Factory; g Grass; h Hospital; m Mall; p Pond; r Road; s Shack; x Random;
		["0",   "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],

		["0",   "s", "s", "g", "g", "s", "s", "g", "g", "s", "s", "g", "g", "s", "s"],
		["0",   "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r"],
		["0",   "r", "g", "g", "g", "g", "g", "g", "g", "r", "f", "f", "f", "f", "r"],
		["0",   "r", "g", "p", "p", "p", "p", "p", "g", "r", "r", "r", "r", "r", "r"],
		["0",   "r", "g", "g", "g", "g", "g", "g", "g", "r", "g", "g", "g", "g", "r"],
		["0",   "r", "0", "0", "0", "0", "0", "0", "0", "r", "g", "p", "h", "g", "r"],
		["0",   "r", "0", "0", "0", "0", "0", "r", "r", "r", "g", "g", "g", "g", "r"],
		["0",   "r", "0", "0", "0", "0", "0", "r", "b", "r", "r", "r", "r", "r", "r"],
		["0",   "r", "0", "0", "0", "0", "0", "r", "b", "r", "s", "r", "s", "s", "r"],
		["0",   "r", "0", "0", "0", "0", "0", "r", "h", "r", "s", "r", "r", "r", "r"],
		["0",   "r", "g", "g", "0", "0", "0", "r", "f", "r", "s", "r", "s", "s", "r"],
		["0",   "r", "p", "m", "m", "0", "0", "r", "f", "r", "s", "r", "s", "s", "r"],
		["0",   "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r"],
		["0",   "b", "b", "g", "p", "p", "b", "g", "g", "g", "g", "g", "g", "g", "m"]
], 
names = [
	["Conrad", "Dan", "Matthew", "J.D.", "Joel", "Jimmy", "Jerrie", "Tim", "Hugo", "Josh", "Jason", "Mason", "Aaron", "Jonah", "Jacob", "Noah", "John", "Kyle"],
	["Sandra", "Molly", "Rebecca", "Claire", "Deb", "Roxy", "Bonnie", "Jojo", "Ana", "Sara", "Joanna", "Ann", "Jules", "Chloe", "Emily", "Emma", "Jessica", "Lily"]
]