import { Messages } from './playground';
import * as ECS from '../libs/pixi-ecs';

export class GarbageRemoval extends ECS.Component {
    onUpdate(delta: number, absolute: number) {
        var bounds = this.owner.getBounds();
        if (bounds.right < -this.scene.app.screen.width || bounds.top < 0 || bounds.top > this.scene.app.screen.height) {
            //if player has fallen, reset him
            if (this.owner.hasTag('PLAYER')) {
                this.sendMessage(Messages.LOAD_CHECKPOINT);
            }
            //else remove object
            else {
                this.sendMessage(Messages.OBJECT_DESTROYED);
                this.scene.stage.removeChild(this.owner);                
            }
        }
    }
}
