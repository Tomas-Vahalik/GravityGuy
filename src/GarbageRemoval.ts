import { Messages } from './playground';
import * as ECS from '../libs/pixi-ecs';

export class GarbageRemoval extends ECS.Component {
    onUpdate(delta: number, absolute: number) {
        var bounds = this.owner.getBounds();
        if (bounds.right < 0 || bounds.top < 0 || bounds.bottom > this.scene.app.screen.height) {
            //if player has fallen, reset him
            if (this.owner.hasTag('PLAYER')) {
                this.sendMessage(Messages.PLAYER_RESET);
            }
            //else remove object
            else {
                this.sendMessage(Messages.OBJECT_DESTROYED);
                this.scene.stage.removeChild(this.owner);
            }
        }
    }
}
