import { Block } from './block';
import { SpecialEffect } from './special-effect';
import { Position } from './position';
import { Checkpoint } from './checkpoint';
import { Direction } from '../constants/enums/direction';
import { Maps } from '../constants/enums/maps';


export class Map {
	spawnpoint: Position;
	blocks: Block[];
	nextMap: Maps;
	specialEffects: SpecialEffect[];
	checkpoints: Checkpoint[];
	dir: Direction;
	isFinalMap: boolean;
	constructor() {
		this.spawnpoint = new Position(0, 0);
		this.blocks = [];
		this.specialEffects = [];
		this.checkpoints = [];
		this.dir = Direction.DOWN;
	}
}