var chai = require('chai');
var expect = chai.expect;
var Game = require('../game.js');

describe('Game', function() {
	it('is initialized', function() {
		var game = new Game([
			{x:1, y:1},
			{x:2, y:2},
		]);
		expect(game.isInState([{x:1, y:1}, {x:2, y:2}])).to.equal(true);
		expect(game.isInState([{x:6, y:4}, {x:2, y:2}])).to.equal(false);
	});

	it('lonely cells die', function() {
		var game = new Game([
			{x:1, y:1},
			{x:2, y:2},
			{x:4, y:4}]);
		game.run(1);
		expect(game.isLive({x:1, y:1})).to.equal(false);
		expect(game.isLive({x:2, y:2})).to.equal(false);
		expect(game.isLive({x:4, y:4})).to.equal(false);
	});

	it('overcrowded cells die', function() {
		var game = new Game([
			{x:1, y:1},
			{x:1, y:2},
			{x:1, y:3},
			{x:2, y:1},
			{x:2, y:3},
			{x:10, y:1},
			{x:10, y:2},
			{x:10, y:3},
			{x:11, y:1},
			{x:11, y:2},
			{x:11, y:3},
			{x:12, y:1},
			{x:12, y:2},
			{x:12, y:3},
		]);
		game.run(1);
		expect(game.isLive({x:1, y:2})).to.equal(false);
		expect(game.isLive({x:10, y:2})).to.equal(false);
		expect(game.isLive({x:11, y:1})).to.equal(false);
		expect(game.isLive({x:11, y:2})).to.equal(false);
		expect(game.isLive({x:11, y:3})).to.equal(false);
		expect(game.isLive({x:12, y:2})).to.equal(false);
	});

	it('dead cell revived', function() {
		var game = new Game([
			{x:2, y:1},
			{x:1, y:2},
			{x:3, y:2}]);
		game.run(1);
		expect(game.isLive({x:2, y:2})).to.equal(true);
	});

	it('works for a thousand generations', function() {
		var game = new Game([
			{x:2, y:1},
	                {x:2, y:2},
	                {x:2, y:3}]);
		game.run(1000);
		expect(game.isLive({x:2, y:1})).to.equal(true);
		expect(game.isLive({x:2, y:3})).to.equal(true);
	});
});
