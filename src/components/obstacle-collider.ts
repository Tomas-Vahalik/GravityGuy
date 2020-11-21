import { Messages } from '../constants/enums/messeges';
import * as ECS from '../../libs/pixi-ecs';

export class ObstacleCollider extends ECS.Component {
	inColision = false;
	onInit() {
		//this.subscribe(Messages.OBJECT_POSITION);
	}
	onUpdate(delta: number, absolute: number) {
		let bounds = this.owner.getBounds();
		if (bounds.left <= this.owner.scene.width && bounds.right >= 0) {
			this.sendMessage(Messages.OBJECT_POSITION, bounds);
		}
	}
	onMessage(msg: ECS.Message) {
	}
	onDetach() {
		this.sendMessage(Messages.OBJECT_DESTROYED);
	}
}
