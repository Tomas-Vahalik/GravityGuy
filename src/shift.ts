import { Messages } from './playground';
import * as ECS from '../libs/pixi-ecs';

export class Shift extends ECS.Component {
    state = {
        running: true
    };
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        };
    }
    onInit() {
        this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);
    }
    onMessage(msg: ECS.Message) {
        if (msg.action === Messages.FREEZE) {
            console.log('freeze');
            this.modifyState({
                running: false
            });
        }
        if (msg.action === Messages.UNFREEZE) {
            this.modifyState({
                running: true
            });
        }
    }
    onUpdate(delta: number, absolute: number) {
        //move object left
        if (this.state.running == false)
            return;
        var x = this.owner.position.x;
        var y = this.owner.position.y;
        this.owner.position.set(x - 0.5 * delta, y);
        //var bounds = this.owner.getBounds();
    }
}
