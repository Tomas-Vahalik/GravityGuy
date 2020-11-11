import { ObstacleCollider } from './obstacle-collider';
import { PlayerMovement } from './player-movement';
import { PlayerCollider } from './player-collider';
import { GarbageRemoval } from './garbage-removal';
import { Messages} from './playground';
import { Map } from './base_elements/map';
import * as ECS from '../libs/pixi-ecs';
import { Maps } from './constants';

export class SceneManager extends ECS.Component {   
    keyInput: ECS.KeyInputComponent;
   running = true;   

    onInit() {      
        this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
    }   
    
    onUpdate(delta: number, absolute: number) {       
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_W)) {
            this.keyInput.handleKey(ECS.Keys.KEY_W);
            if (this.running) {
                this.sendMessage(Messages.FREEZE);
                this.running = false;
            }
            else {
                this.sendMessage(Messages.UNFREEZE);
                this.running = true;
            }
        }
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_R)) {
            this.keyInput.handleKey(ECS.Keys.KEY_R);
            this.sendMessage(Messages.LOAD_CHECKPOINT);
        }
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_SPACE)) {
            this.keyInput.handleKey(ECS.Keys.KEY_SPACE);
            this.sendMessage(Messages.FLIP_GRAVITY);
        }
    }
    
}
