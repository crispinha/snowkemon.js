/**
 * Created by crispin on 23/03/16.
 */
//use this somewhere
// game.camera.shake(0.02, 250, true, Phaser.Camera.SHAKE_HORIZONTAL, true)
var hpList = [
	'<░░░DEAD░░░>',
	'<░░░░░░░░░░>',
	'<▓░░░░░░░░░>',
	'<▓▓▓░░░░░░░>',
	'<▓▓▓▓░░░░░░>',
	'<▓▓▓▓▓░░░░░>',
	'<▓▓▓▓▓▓░░░░>',
	'<▓▓▓▓▓▓▓░░░>',
	'<▓▓▓▓▓▓▓▓░░>',
	'<▓▓▓▓▓▓▓▓▓░>',
	'<▓▓▓▓▓▓▓▓▓▓>'
];
var testStupidLoops = 0;
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});
var textWaiting = false;
var canAttack = false;

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
	//introduction
	//replace soon
	updateText('Hi! Welcome to the world of Snowkemon!\nI\'m Professor Snowk!', messageBox, function() {canAttack = true});
	//button commandsn
	attack.events.onInputDown.add(function(){if (canAttack) {
	doAttack(player, enemy, messageBox, [player, enemy, playerHP, enemyHP, messageBox], function(){
		movePlayer(player, function () {enemyTurn(enemy, player, messageBox, [player, enemy, playerHP, enemyHP, messageBox])});
	})
	}});

	//enemyTurn(enemy, player, messageBox, [player, enemy, playerHP, enemyHP])
	heal.events.onInputDown.add(function(){if (canAttack) {doHeal(player, messageBox, [player, enemy, playerHP, enemyHP, messageBox], function () {game.camera.shake(0.02, 250, true, Phaser.Camera.SHAKE_HORIZONTAL, true); game.camera.onShakeComplete.addOnce(function(){enemyTurn(enemy, player, messageBox, [player, enemy, playerHP, enemyHP, messageBox])} )} )}}, this);
	run.events.onInputDown.add(function(){updateText('It is literally impossible for you to \nrun away.\nThere is only one fight in this \nentire game.', messageBox)});
	quit.events.onInputDown.add(function(){updateText('If you know how to close a window in \nJavascript, let me know.\n@dvlpstrcrispin', messageBox)}, this);
	//debug stuff
	appendDebug('debug activated');

}

function doAttack (self, target, messageBox, chbArgs, callback) {
	canAttack = false;
	//if you have the time, make it do defense too
	chbArgs.push('attack ' + self.stats.name);
	icallback = null;
	icallback = callback || function(){return null;};
	var damage = Math.floor(getRandomFloat(0.7, 1.3) * self.stats.attack);
	target.stats.health = target.stats.health - damage;
	calculateHealthBars.apply(this, chbArgs);
	updateText(self.stats.name + ' attacks for ' + damage + ' damage.', messageBox, icallback);
}
function doHeal (self, messageBox, chbArgs, callback) {
	canAttack = false;
	chbArgs.push('defend ' + self.stats.name);
	icallback = null;
	icallback = callback || function(){return null;};
	var heal = Math.floor(getRandomFloat(0.7, 1.3) * self.stats.heal);
	self.stats.health = self.stats.health + heal;
	if (self.stats.health > 100) {self.stats.health = 100};
	calculateHealthBars.apply(this, chbArgs);
	updateText(self.stats.name + ' heals ' + heal + ' hp.', messageBox, icallback);
}

function calculateHealthBars(player, enemy, playerHP, enemyHP, messageBox) {
	playerHealthRounded = (player.stats.health / 10).toFixed(0);
	enemyHealthRounded = (enemy.stats.health / 10).toFixed(0);
	if (enemy.stats.health <= 0) {canAttack = false; updateText('Well Done!\nYou Win!\nPlay Again?', messageBox)};
	if (player.stats.health <= 0) {canAttack = false; updateText('Well Done!\nYou Lose!\nPlay Again?', messageBox)};
	playerHP.text = player.stats.name + ' ' + player.stats.health;
	enemyHP.text = enemy.stats.name + ' ' + enemy.stats.health;
	//if health is equal to or greater than max health, use full bar, else if health is equal to or less than 0 use dead bar, else use rounded bar
	//if (player.stats.health >= player.stats.maxHealth) {playerHP.text = player.stats.name + ' ' + hpList[10]}
	//else if (player.stats.health <= 0) {playerHP.text = player.stats.name + ' ' + hpList[0]}
	//else{playerHP.text = player.stats.name + ' ' + hpList[playerHealthRounded]};
	//if (enemy.stats.health >= enemy.stats.maxHealth) {enemyHP.text = enemy.stats.name + ' ' + hpList[10]}
	//else if (enemy.stats.health <= 0) {enemyHP.text = enemy.stats.name + ' ' + hpList[0]}
	//else {enemyHP.text = enemy.stats.name + ' ' + hpList[enemyHealthRounded]};

}
function enemyTurn (enemy, player, messageBox, chbArgs, callback) {
	icallback = null;
	icallback = callback || function(){return null;};
	var choices = ['attack', 'attack', 'attack', 'heal'];
	action = choices[Math.floor(Math.random() * choices.length)];
	if (action === 'attack') {
		doAttack(enemy, player, messageBox, chbArgs, function(){moveEnemy(enemy, function () {canAttack = true;icallback});});
	} else if (action === 'heal') {
		console.log('heal');
		doHeal(enemy, messageBox, chbArgs, function(){game.camera.shake(0.02, 250, true, Phaser.Camera.SHAKE_HORIZONTAL, true); game.camera.onShakeComplete.addOnce(function(){canAttack = true;icallback}, true )})
	}
	//icallback;
}
function update() {
}
function movePlayer(player, callback) {
	icallback = null;
	icallback = callback || function(){return null;};
	game.add.tween(player).to({y: player.position.y - 100}, 750, Phaser.Easing.Bounce.Out, true)
		.onComplete.addOnce(function() {game.camera.shake(0.02, 250, true, Phaser.Camera.SHAKE_BOTH, true);}, true);
		game.camera.onShakeComplete.addOnce(function () {game.add.tween(player).to({y: 183}, 750, Phaser.Easing.Bounce.Out, true)
		.onComplete.add(icallback, this)}, this)
}
function moveEnemy(enemy, callback) {
	icallback = null;
	icallback = callback || function(){return null;};
	game.add.tween(enemy).to({y: enemy.position.y + 100}, 750, Phaser.Easing.Bounce.Out, true)
		.onComplete.addOnce(function() {game.camera.shake(0.02, 250, true, Phaser.Camera.SHAKE_BOTH, true);}, true);
		game.camera.onShakeComplete.addOnce(function () {game.add.tween(enemy).to({y: 25}, 750, Phaser.Easing.Bounce.Out, true)
		.onComplete.addOnce(icallback, this)}, this)
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
		game.time.events.onComplete.addOnce(function () {
			icallback();
			textWaiting = false;
		});
	}
};
