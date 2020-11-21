import { Block } from './block';
import { SpecialEffect } from './special-effect';
import { Position } from './position';
import { Checkpoint } from './checkpoint';
import { Direction } from '../enums/direction';


export class Map {
	spawnpoint: Position;
	blocks: Block[];
	specialEffects: SpecialEffect[];
	checkpoints: Checkpoint[];
	dir: Direction;
	constructor() {
		this.spawnpoint = new Position(0, 0);
		this.blocks = [];
		this.specialEffects = [];
		this.checkpoints = [];
		this.dir = Direction.DOWN;
	}
}