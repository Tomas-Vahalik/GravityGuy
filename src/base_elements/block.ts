import { Position } from './position';

export class Block {
	pos: Position;
	width: number;
	height: number;
	constructor(x: number, y: number, w: number, h: number) {
		this.pos = new Position(x, y);
		this.width = w;
		this.height = h;
	}
	copy = () => {
		let newBlock = new Block(this.pos.x, this.pos.y, this.width, this.height);
		return newBlock;
	}
}
