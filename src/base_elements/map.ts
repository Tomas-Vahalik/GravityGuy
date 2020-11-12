import { Block } from './block';
import { SpecialEffect } from './special-effect';
import { Position } from './position';
import { Direction } from '../playground';


export class Map {
	spawnpoint: Position;
	blocks: Block[];
    specialEffects: SpecialEffect[];
    dir: Direction;
    constructor() {
        this.spawnpoint = new Position(0, 0);
        this.blocks = [];
        this.specialEffects = [];
        this.dir = Direction.DOWN;
    }
}