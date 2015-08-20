// Move.ts by Takumi Fujimoto

class Move {
	origRow: number;
	origCol: number;
	destRow: number;
	destCol: number;
	
	constructor(oR: number, oC: number, dR: number, dC: number) {
		this.origRow = oR;
		this.origCol = oC;
		this.destRow = dR;
		this.destCol = dC;
	}
}