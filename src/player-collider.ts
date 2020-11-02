import { PlayerBuff } from './player-buff';
import { Messages, Direction } from './playground';
import * as ECS from '../libs/pixi-ecs';

//TODO: Presunout pridavani buffu na lepsi misto, vyresit collision left
export class PlayerCollider extends ECS.Component {
    state = {
        //map of objects that the player collides
        inCollisionWith: new Map(),
        running: true
    };
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        };
    }
    onInit() {
        this.subscribe(Messages.OBJECT_POSITION);
        this.subscribe(Messages.OBJECT_DESTROYED);
        this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);
    }
    //checks if player collides with given object
    checkCollisionWith(bounds: PIXI.Rectangle, otherBounds: PIXI.Rectangle): boolean {
        if (bounds.x < otherBounds.x + otherBounds.width &&
            bounds.x + bounds.width > otherBounds.x &&
            bounds.y < otherBounds.y + otherBounds.height &&
            bounds.y + bounds.height > otherBounds.y)
            return true;
        else
            return false;
    }
    //checks the direction of collision
    checkCollisionDirection(bounds: PIXI.Rectangle, otherBounds: PIXI.Rectangle): Direction {
        var b_collision = otherBounds.bottom - bounds.y;
        var t_collision = bounds.bottom - otherBounds.y;
        var l_collision = bounds.right - otherBounds.x;
        var r_collision = otherBounds.right - bounds.x;
        
        if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision) {
            //bottom collision            
            return Direction.DOWN;
        }
        if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision) {
            //top collision
            
            return Direction.UP;
        }
        if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision) {
            //right collision
            
            return Direction.RIGHT;
        }
        if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision) {
            //left collision
            
            return Direction.LEFT;
        }
    }
    onMessage(msg: ECS.Message) {
        if (msg.action === Messages.FREEZE) {
            this.modifyState({
                running: false
            });
        }
        if (msg.action === Messages.UNFREEZE) {
            this.modifyState({
                running: true
            });
        }
        if (msg.action === Messages.OBJECT_POSITION) {
            var bounds = this.owner.getBounds();
            var otherBounds = msg.data;
            var dir: Direction = Direction.DOWN;
            //check if player collides
            if (this.checkCollisionWith(bounds, otherBounds)) {
                if (msg.component.owner.hasTag('BUFF')) {
                    //this.sendMessage(Messages.BUFF,msg.component.owner);
                    this.owner.addComponent(new PlayerBuff(null));
                    this.scene.stage.removeChild(msg.component.owner);
                    this.owner.asGraphics().tint = 0x00FFFF;
                    return;
                }
                //get direction of collision
                dir = this.checkCollisionDirection(bounds, otherBounds);
                //If not alredy in collision with this object
                if (!this.state.inCollisionWith.has(msg.gameObject)) {
                    //remember I am in collision with this object
                    this.state.inCollisionWith.set(msg.gameObject, dir);
                    //msg.component.owner.asGraphics().tint = 0xFF0000;
                    //send message that collision occured
                    switch (dir) {
                        case Direction.UP:
                            this.owner.position.y = msg.component.owner.getBounds().bottom - 1;
                            this.sendMessage(Messages.COLLISION_TOP);    
                            console.log("top");
                            break;
                        case Direction.DOWN:                            
                            this.owner.position.y = msg.component.owner.getBounds().top - this.owner.getBounds().height + 1;
                            this.sendMessage(Messages.COLLISION_BOT);                            
                            console.log("bot");
                            break;
                        case Direction.LEFT:
                            this.sendMessage(Messages.COLLISION_LEFT);
                            break;
                        case Direction.RIGHT:
                            this.owner.position.x = msg.component.owner.getBounds().left - this.owner.getBounds().width + 1;
                            this.sendMessage(Messages.COLLISION_RIGHT);                            
                            console.log("right");
                            break;
                    }
                    this.sendMessage(Messages.COLLISION);
                }
            }
            //check end of collision
            else {
                //if i am with collision with this object
                if (this.state.inCollisionWith.has(msg.gameObject)) {
                    //msg.component.owner.asGraphics().tint = 0xFFFFFF;
                    let dir = this.state.inCollisionWith.get(msg.gameObject);
                    //forget this object
                    this.state.inCollisionWith.delete(msg.gameObject);
                    //send message that end of collision occured
                    switch (dir) {
                        case Direction.UP:
                            this.sendMessage(Messages.COLLISION_TOP_END);
                            break;
                        case Direction.DOWN:
                            this.sendMessage(Messages.COLLISION_BOT_END);
                            break;
                        case Direction.LEFT:
                            this.sendMessage(Messages.COLLISION_LEFT_END);
                            break;
                        case Direction.RIGHT:
                            this.sendMessage(Messages.COLLISION_RIGHT_END);
                            break;
                    }
                }
            }
        }
        if (msg.action === Messages.OBJECT_DESTROYED) {
            ///check for end of collision
            if (this.state.inCollisionWith.has(msg.gameObject)) {
                //msg.component.owner.asGraphics().tint = 0xFFFFFF;
                let dir = this.state.inCollisionWith.get(msg.gameObject);
                this.state.inCollisionWith.delete(msg.gameObject);
                //send message
                switch (dir) {
                    case Direction.UP:
                        this.sendMessage(Messages.COLLISION_TOP_END);
                        break;
                    case Direction.DOWN:
                        this.sendMessage(Messages.COLLISION_BOT_END);
                        break;
                    case Direction.LEFT:
                        this.sendMessage(Messages.COLLISION_LEFT_END);
                        break;
                    case Direction.RIGHT:
                        this.sendMessage(Messages.COLLISION_RIGHT_END);
                        break;
                }
            }
        }
    }
    onUpdate(delta: number, absolute: number) {
    }
}
