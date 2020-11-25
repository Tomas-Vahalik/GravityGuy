import { Messages } from '../constants/enums/messeges';
import * as ECS from '../../libs/pixi-ecs';

export class Shift extends ECS.Component {
    state = {        
		running: true,
		speed:0.5,
	};
	onInit() {
		this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);
        this.subscribe(Messages.SLOW_MOTION_START);
        this.subscribe(Messages.SLOW_MOTION_END);

	}
    onMessage(msg: ECS.Message) {        
		
        if (msg.action == Messages.SLOW_MOTION_START) {            
            this.modifyState({
                speed:0.25
            });
            
        }
        else if (msg.action == Messages.SLOW_MOTION_END) {
            this.modifyState({
                speed: 0.5
            });
        }
        else if (msg.action == Messages.FREEZE) {
            this.modifyState({
                running: false
            });
        }
        else if (msg.action == Messages.UNFREEZE) {
            this.modifyState({
                running: true
            });
        }
	}
    onUpdate(delta: number, absolute: number) {
        if (delta > 20) delta = 20;
		//move object left
		if (this.state.running == false) {
			return;
		}
		let x = this.owner.position.x;
		let y = this.owner.position.y;
		this.owner.position.set(x - this.state.speed * delta, y);
	}
	private modifyState(obj) {
		this.state = {
			...this.state,
			...obj
		};
	}
}
