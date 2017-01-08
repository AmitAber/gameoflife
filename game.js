class Game {
	constructor(liveCells) {
		this.liveCells = liveCells.map(cell => Game.createCell(cell.x, cell.y));
	}

	static createCell(x, y) {
		return {
			x, y, toString: function() {
				return '{x:' + this.x + ', y:' + this.y + '}';
			}
		};
	}

	isInState(testCells) {
		return testCells.length === this.liveCells.length && testCells.every(cell => this.isLive(cell));
	}

	isLive(cell) {
		return this.liveCells.some(live => cell.x === live.x && cell.y === live.y);
	}

	static enumerateNeighbours(cell) {
		let neighbours = [];
		for (let i=-1; i<=1; i++) {
			for (let j=-1; j<=1; j++) {
				if (i != 0 || j != 0) {
					let neighbour = Game.createCell(cell.x + i, cell.y + j);
					neighbours.push(neighbour);
				}
			}
		}
		return neighbours;
	}

	countNeighbours(cell) {
		let neighbours = Game.enumerateNeighbours(cell);
		let liveNeighbours = neighbours.filter(cell => this.isLive(cell));

		return liveNeighbours.length;
	}

	shouldSurvive(cell) {
		let count = this.countNeighbours(cell);
		return 1 < count && count < 4;
	}

	distinctCells(cells) {
		let distinct = [];
		let map = [];
		for (let i=0; i<cells.length; i++) {
			let cell = cells[i];
			let key = cell.toString();
			if (map[key] === true)
				continue;
			map[key] = true;
			distinct.push(cell);
		}
		return distinct;
	}

	run(generations) {
		for (let i=0; i<generations;i++)
			this.advanceGeneration();
	}

	advanceGeneration() {
		let newCells = this.liveCells.filter(cell => this.shouldSurvive(cell));
		let allNeighbours = [].concat.apply([],this.liveCells.map(Game.enumerateNeighbours));
		let distinctNeighbours = this.distinctCells(allNeighbours);
		let deadNeighbours = distinctNeighbours.filter(neighbour => !this.liveCells.includes(neighbour));
		let revivedCells = deadNeighbours.filter(neighbour => this.countNeighbours(neighbour) === 3);
		this.liveCells = newCells.concat(revivedCells);
	}
}

module.exports = Game;
