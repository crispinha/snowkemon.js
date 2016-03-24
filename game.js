/**
 * Created by crispin on 23/03/16.
 */
var hpList = [
	'<   DEAD   >',
	'<          >',
	'<█         >',
	'<███       >',
	'<████      >',
	'<█████     >',
	'<██████    >',
	'<███████   >',
	'<████████  >',
	'<█████████ >',
	'<██████████>'
];

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});
var textWaiting = false;

function preload() {
	game.load.image('good', 'assets/good_snow.png');
	game.load.image('bad', 'assets/bad_snow.png');
	game.load.image('box', 'assets/text_box.png');
	game.load.image('attack', 'assets/buttons/atk.png');
	game.load.image('heal', 'assets/buttons/fix.png');
	game.load.image('run', 'assets/buttons/run.png');
	game.load.image('quit', 'assets/buttons/qut.png');
	game.load.image('snow', 'assets/buttons/snw.png');
}


function create() {
	//replace soon
	function doStart() {updateText('Hi! Welcome to the world of Snowkemon!\nI\'m Professor Snowk!', messageBox, function() {moveEnemy(enemy)});};

	//game setup stuff
	game.stage.backgroundColor = "#FFFFFF";
	var textArea = game.add.sprite(150, 435, 'box');
	var messageBox = game.add.text(165, 450, "", {font: 'VT323',fontSize:'42px', fill:"#000"});
	var attack = game.add.sprite(40, 450, 'attack');
	var heal = game.add.sprite(40, 675, 'heal');
	var run = game.add.sprite(900, 450, 'run');
	var quit = game.add.sprite(900, 675, 'quit');
	attack.inputEnabled = true;
	heal.inputEnabled = true;
	quit.inputEnabled = true;
	run.inputEnabled = true;
	//characters
	var player = game.add.sprite(79, 183, 'good');
	player.stats = {name: 'Pikasnow', health: 100, maxHealth: 100, attack: 7, defense: 5, heal: 3, speed: 8};
	var enemy = game.add.sprite(675, 25, 'bad');
	enemy.stats = {name: 'Pr.Snowk', health: 100, maxHealth: 100, attack: 4, defense: 8, heal: 6, speed: 5};
	//hp
	var playerHP = game.add.text(300, 375, player.stats.name + ' ' + hpList[10], {font: 'VT323',fontSize:'42px', fill:"#000"});
	var enemyHP = game.add.text(200, 25, enemy.stats.name + ' ' + hpList[10], {font: 'VT323',fontSize:'42px', fill:"#000"});
	//delay
	var delay = 20;
	//introduction
	//replace soon
	doStart();
	//button commands
	attack.events.onInputDown.add(function(){doAttack(player, enemy, messageBox, function(){movePlayer(player)})});
	heal.events.onInputDown.add(function(){doHeal(player, messageBox)}, this);
	run.events.onInputDown.add(function(){calculateHealthBars(player, enemy, playerHP, enemyHP)});
	//run.events.onInputDown.add(function(){updateText('It is literally impossible for you to \nrun away.\nThere is only one fight in this \nentire game.', messageBox)});
	quit.events.onInputDown.add(function(){updateText('If you know how to close a window in \nJavascript, let me know.\n@dvlpstrcrispin', messageBox)}, this);
	//debug stuff
	appendDebug('debug activated');
}

function doAttack (self, target, messageBox, callback) {
	//if you have the time, make it do defense too
	icallback = null;
	icallback = callback || function(){return null;};
	var damage = Math.floor(getRandomFloat(0.7, 1.3) * self.stats.attack);
	target.stats.health = target.stats.health - damage;
	updateText(self.stats.name + ' attacks for ' + damage + ' damage.\nThey are on ' + target.stats.health + ' health.', messageBox, icallback);
}
function doHeal (self, messageBox, callback) {
	icallback = null;
	icallback = callback || function(){return null;};
	var heal = Math.floor(getRandomFloat(0.7, 1.3) * self.stats.heal);
	self.stats.health = self.stats.health + heal;
	updateText(self.stats.name + ' heals ' + heal + ' hp.', messageBox, icallback);
}
function calculateHealthBars(player, enemy, playerText, enemyText) {
	playerHealthRounded = (player.stats.health / 10).toFixed(0);
	enemyHealthRounded = (enemy.stats.health / 10).toFixed(0);
	//if health is equal to or greater than max health, use full bar, else use rounded bar
	if (player.stats.health >= player.stats.maxHealth) {playerText.text = player.stats.name + ' ' + hpList[10]}
		else {playerText.text = player.stats.name + ' ' + hpList[playerHealthRounded]};
	if (enemy.stats.health >= enemy.stats.maxHealth) {enemyText.text = enemy.stats.name + ' ' + hpList[10]}
		else {enemyText.text = enemy.stats.name + ' ' + hpList[enemyHealthRounded]};

}

function update() {
}

function movePlayer(player) {
	game.add.tween(player).to({y: player.position.y - 100}, 750, Phaser.Easing.Bounce.Out, true)
		.onComplete.add(function () {game.add.tween(player).to({y: 183}, 750, Phaser.Easing.Bounce.Out, true)}, this);
}
function moveEnemy(enemy) {
	game.add.tween(enemy).to({y: enemy.position.y + 100}, 750, Phaser.Easing.Bounce.Out, true)
		.onComplete.add(function () {game.add.tween(enemy).to({y: 25}, 750, Phaser.Easing.Bounce.Out, true);appendDebug('enemy moved');}, this);
}
function updateText(input, textArea, callback, resetText) {
	//don't touch the bullshit
	//also this has to be implicitly declared or shit hits the fan
	icallback = null;
	icallback = callback || function(){return null;};
	resetText = resetText || true;
	if (!textWaiting) {
		textWaiting = true;
		if (resetText) {textArea.text = ''};
		var i = 0;
		var line = input.split("");
		game.time.events.repeat(20, line.length, function () {
			textArea.text = textArea.text.concat(line[i] + "");
			i++;
		}, this);
		game.time.events.onComplete.add(function () {
			icallback();
			textWaiting = false;
		});
	}
};
