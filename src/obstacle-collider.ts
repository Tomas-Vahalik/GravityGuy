import { Messages } from './playground';
import * as ECS from '../libs/pixi-ecs';

export class ObstacleCollider extends ECS.Component {
    inColision = false;
    onInit() {
        this.subscribe(Messages.OBJECT_POSITION);
    }
    onUpdate(delta: number, absolute: number) {
        var bounds = this.owner.getBounds();
        this.sendMessage(Messages.OBJECT_POSITION, bounds);
    }
    onMessage(msg: ECS.Message) {
    }
    onDetach() {        
        this.sendMessage(Messages.OBJECT_DESTROYED);        
    }
}
