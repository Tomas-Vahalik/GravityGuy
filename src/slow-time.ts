import { Messages, Direction } from './playground';
import * as ECS from '../libs/pixi-ecs';


export class SlowTime extends ECS.Component {
    state = {        
        durationLeft: 5000,        
    };
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        };
    }
    onAttach() {
        this.modifyState({
            durationLeft: 10000            
        });
        this.sendMessage(Messages.MODIFY_SPEED, "SLOW");

    }    
    
    onUpdate(delta: number, absolute: number) {
     
     this.state.durationLeft -= delta;
     if (this.state.durationLeft <= 0) {
         this.sendMessage(Messages.MODIFY_SPEED, "NORMAL");
         this.owner.removeComponent(this);
     }
           
    }
}
