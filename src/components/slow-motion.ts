import { Messages } from '../constants/enums/messeges';
import * as ECS from '../../libs/pixi-ecs';
import { Direction } from '../constants/enums/direction';

export class SlowMotion extends ECS.Component {
    state = {
        durationLeft: 7000        
    };
    onInit() {
        
    }
    
    onMessage(msg: ECS.Message) {
        
    }
    onUpdate(delta: number, absolute: number) {
       
        this.state.durationLeft -= delta;
        if (this.state.durationLeft <= 0) {            
            this.owner.removeComponent(this);
        }
    }
    onAttach() {
        this.modifyState({
            durationLeft: 10000,            
        });
        this.sendMessage(Messages.SLOW_MOTION_START);
    }
    onDetach() {
        this.sendMessage(Messages.SLOW_MOTION_END);
    }
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj,
        };
    }
}
