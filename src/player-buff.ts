import { Messages } from './playground';
import * as ECS from '../libs/pixi-ecs';
import { Direction } from './constants/enums/direction';

export class PlayerBuff extends ECS.Component {
  state = {
	durationLeft: 300,
	canMove: true,
  };
  onInit() {
	this.subscribe(Messages.COLLISION);
	this.subscribe(Messages.COLLISION_END);
  }
  onMessage(msg: ECS.Message) {
	if (msg.action == Messages.COLLISION && msg.data.dir == Direction.RIGHT) {
		this.modifyState({
		canMove: false,
		});
	}
	if (
		msg.action == Messages.COLLISION_END &&
		msg.data.dir == Direction.RIGHT
	) {
		this.modifyState({
		canMove: true,
		});
	}
  }
  onUpdate(delta: number, absolute: number) {
	if (this.state.canMove) {
		this.owner.position.x += 0.03 * delta;
	}
	this.state.durationLeft -= delta;
	if (this.state.durationLeft <= 0) {
		this.owner.asGraphics().tint = 0xff0000;
		this.owner.removeComponent(this);
	}
  }
  onAttach() {
	this.modifyState({
		durationLeft: 3000,
		canMove: true,
	});
  }
  private modifyState(obj) {
	this.state = {
		...this.state,
		...obj,
	};
  }
}
