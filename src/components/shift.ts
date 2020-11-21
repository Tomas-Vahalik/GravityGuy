import { Messages } from '../constants/enums/messeges';
import * as ECS from '../../libs/pixi-ecs';

export class Shift extends ECS.Component {
	state = {
		running: true,
		difficulty:0.5
	};
	onInit() {
		this.subscribe(Messages.FREEZE);
		this.subscribe(Messages.UNFREEZE);
	}
	onMessage(msg: ECS.Message) {
		this.modifyState({
			running: msg.action === Messages.UNFREEZE
		});
	}
	onUpdate(delta: number, absolute: number) {
		//move object left
		if (this.state.running == false) {
			return;
		}
		let x = this.owner.position.x;
		let y = this.owner.position.y;
		this.owner.position.set(x - this.state.difficulty * delta, y);
	}
	private modifyState(obj) {
		this.state = {
			...this.state,
			...obj
		};
	}
}