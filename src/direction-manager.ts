import { Direction } from './enums/direction';

export default class DirectionManager {
  private dir: Direction;

  public swapDir() {
	if (this.dir == Direction.DOWN) {
		this.dir = Direction.UP;
	} else if (this.dir == Direction.UP) {
		this.dir = Direction.DOWN;
	}
  }

  public getDirection() {
		return this.dir;
  }
  public setDireciton(newDir: Direction) {
		this.dir = newDir;
  }
}
