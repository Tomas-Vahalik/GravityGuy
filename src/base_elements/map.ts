import { Block } from './block';
import { SpecialEffect } from './special-effect';
import { Position } from './position';

export class Map {
	spawnpoint: Position;
	blocks: Block[];
    specialEffects: SpecialEffect[];
    constructor() {
        this.spawnpoint = new Position(0, 0);
        this.blocks = [];
        this.specialEffects = [];
    }
}