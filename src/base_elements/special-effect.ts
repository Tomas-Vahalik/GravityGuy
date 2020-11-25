import { Block } from './block';

export enum SpecialEffectType {
	BOOST = 1,
	SLOW = 2,
	WALL_WALKER = 3
}

export class SpecialEffect {
	type: SpecialEffectType;
	block: Block;
	constructor(type: SpecialEffectType, block:Block) {
		this.type = type;
		this.block = block;
	}

	copy = () => {
		return new SpecialEffect(this.type, this.block.copy());
	}
}