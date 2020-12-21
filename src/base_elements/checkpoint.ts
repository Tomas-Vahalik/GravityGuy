
import { Block } from './block';
import { Direction } from '../constants/enums/direction';
import { Position } from './position';

export class Checkpoint {
    direction: Direction;
    //block: Block;
    pos: Position;
	/*constructor(block: Block, dir:Direction) {
        this.block = block;
        this.direction = dir;
	}*/
    constructor(pos: Position, dir: Direction) {
        this.pos = pos;
        this.direction = dir;
    }

    copy = () => {
        return new Checkpoint(this.pos, this.direction);
	}
}