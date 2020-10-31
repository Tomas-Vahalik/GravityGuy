import { Block } from "./block";

export enum SpecialEffectType {
	BOOST = 1,
	SLOW = 2,
	WALL_WALKER = 3
}

export class SpecialEffect {
	type: SpecialEffectType;
	block: Block;
}