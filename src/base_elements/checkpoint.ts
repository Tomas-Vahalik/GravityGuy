
import { Block } from './block';

export class Checkpoint {

	block: Block;
	constructor(block: Block) {
		this.block = block;
	}

	copy = () => {
		return new Checkpoint(this.block.copy());
	}
}