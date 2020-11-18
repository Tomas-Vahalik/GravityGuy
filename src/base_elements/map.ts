import { Block } from './block';
import { SpecialEffect } from './special-effect';
import { Position } from './position';
import { Direction } from '../playground';
import { Checkpoint } from './checkpoint'


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