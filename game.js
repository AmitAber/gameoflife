class Game {
	constructor(liveCells) {
		this.liveCells = liveCells.map(cell => this.createCell(cell.x, cell.y));
	}

	createCell(_x, _y) {
		return { 
			x:_x, y:_y, toString: function() {
				return '{x:' + this.x + ', y:' + this.y + '}';
			}
		};
	}

	isInState(testCells) {
		return testCells.every(cell => this.liveCells.some(live => cell.x === live.x && cell.y === live.y)) && testCells.length === this.liveCells.length;
	}

	isLive(cell) {
		return this.liveCells.some(live => cell.x === live.x && cell.y === live.y);
	}

	enumerateNeighbours(cell) {
		var neighbours = [];
		for (var i=-1; i<=1; i++) {
			for (var j=-1; j<=1; j++) {
				if (i != 0 || j != 0) {
					var neighbour = this.createCell(cell.x + i, cell.y + j);
					neighbours.push(neighbour);
				}
			}
		}
		return neighbours;
	}
		
	countNeighbours(cell) {
		var count = 0;
		var neighbours = this.enumerateNeighbours(cell);
		for (var i=0; i<8; i++) {
			var neighbour = neighbours[i];
			if (this.liveCells.some(live => live.x === neighbour.x && live.y === neighbour.y))
				count++;
		}
		return count;
	}

	shouldSurvive(cell) {
		var count = this.countNeighbours(cell);
		return 1 < count && count < 4;
	}

	distinctCells(cells) {
		var distinct = [];
		var map = [];
		for (var i=0; i<cells.length; i++) {
			var cell = cells[i];
			var key = cell.toString();
			if (map[key] === true)
				continue;
			map[key] = true;
			distinct.push(cell);
		}
		return distinct;
	}

	run(generations) {
		for (var i=0; i<generations;i++)
			this.advanceGeneration();
	}

	advanceGeneration() {
		var newCells = this.liveCells.filter(cell => this.shouldSurvive(cell));
		var allNeighbours = [].concat.apply([],this.liveCells.map(cell => this.enumerateNeighbours(cell)));
		var distinctNeighbours = this.distinctCells(allNeighbours);
		var deadNeighbours = distinctNeighbours.filter(neighbour => this.liveCells.indexOf(neighbour) == -1);
		var revivedCells = deadNeighbours.filter(neighbour => this.countNeighbours(neighbour) === 3);
		this.liveCells = newCells.concat(revivedCells);
	}
}

module.exports = Game;
