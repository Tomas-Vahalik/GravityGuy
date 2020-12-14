import { Messages } from '../constants/enums/messeges';
import * as ECS from '../../libs/pixi-ecs';

export class GarbageRemoval extends ECS.Component {
    
    onInit() {
            
    }
    
    onUpdate(delta: number, absolute: number) {        
        //if player has fallen, reset him
        let bounds = this.owner.getBounds();
        if (this.owner.hasTag('PLAYER')) {
            if (bounds.right < -10 || bounds.bottom < 0 || bounds.top > this.scene.app.screen.height) {
                this.sendMessage(Messages.LOAD_CHECKPOINT);
            }
        }       
		//else remove object
        else {
            if (bounds.right < -this.scene.app.screen.width || bounds.bottom < 0 || bounds.top > this.scene.app.screen.height) {
				this.sendMessage(Messages.OBJECT_DESTROYED);
				this.scene.stage.removeChild(this.owner);
			}
		}
	}
}
