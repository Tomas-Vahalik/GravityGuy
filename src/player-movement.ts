import { Direction, Messages } from './playground';
import { Shift } from "./shift";
import * as ECS from '../libs/pixi-ecs';
import { CollisionDetails } from './player-collider';
import { PlayerBuff } from './player-buff';

export class PlayerMovement extends ECS.Component {
    state = {
        dir: Direction.DOWN,
        flipPressed: false,
        canFlip: false,
        allowedUp: true,
        allowedDown: true,
        running: true,
        difficulty:0.6
    };
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        };
    }
    handleObstacleCollisionEnter(dir:Direction) {
        switch (dir) {
            case Direction.UP:
                //if 'flip' was pressed, flip gravity
                if (this.state.flipPressed) {
                    this.modifyState({
                        dir: Direction.DOWN,
                        flipPressed: false,
                        canFlip: false
                    });
                }
                //block movement up and allow 'flip'
                else {
                    this.modifyState({
                        allowedUp: false,
                        canFlip: true
                    });
                }
                break;
            case Direction.DOWN:
                //if 'flip' was pressed, flip gravity
                if (this.state.flipPressed) {
                    this.modifyState({
                        dir: Direction.UP,
                        flipPressed: false,
                        canFlip: false
                    });
                }
                //else block movement down and allow flip
                else {
                    this.modifyState({
                        allowedDown: false,
                        canFlip: true
                    });
                }            
                break;
            case Direction.RIGHT:
                this.owner.addComponent(new Shift(null));
                break;
            case Direction.LEFT:
                break;
        }
    }
    handleObstacleCollisionEnd(dir: Direction) {
        switch (dir) {
            case Direction.UP:
                //allow movement up and disable flip
                if (this.state.allowedDown == false) {
                    this.modifyState({
                        allowedUp: true,
                    });
                }
                else {
                    this.modifyState({
                        allowedUp: true,
                        canFlip: false
                    });
                }
                break;
            case Direction.DOWN:
                //allow movement down and disable flip
                if (this.state.allowedUp == false) {
                    this.modifyState({
                        allowedDown: true,
                    });
                }                
                else {
                    this.modifyState({
                        allowedDown: true,
                        canFlip: false
                    });
                }
                break;
            case Direction.RIGHT:                
                //stop shifting player
                var shift = this.owner.findComponentByName('Shift');
                if (shift)
                    this.owner.removeComponent(shift);
                break;
            case Direction.LEFT:
                break;
        }
    }
    handleCollisionEnter(data: CollisionDetails) {        
        switch (data.otherObject.tags.values().next().value) {
            case "BUFF":
                this.owner.addComponent(new PlayerBuff(null));
                this.scene.stage.removeChild(data.otherObject);
                this.owner.asGraphics().tint = 0x00FFFF;
                break;

            case "CHECKPOINT":
                this.sendMessage(Messages.SAVE_CHECKPOINT);
                this.scene.stage.removeChild(data.otherObject);                
                break;
            case "OBJECT":
                this.handleObstacleCollisionEnter(data.dir);
                break;
        }
    }
    onInit() {
        this.subscribe(Messages.COLLISION);
        this.subscribe(Messages.COLLISION_END);        

        this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);
        this.subscribe(Messages.FLIP_GRAVITY);
        
        this.subscribe(Messages.PLAYER_DIRECTION);
    }
    onMessage(msg: ECS.Message) {
        if (msg.action == Messages.COLLISION) {            
            this.handleCollisionEnter(msg.data);
        }
        if (msg.action == Messages.COLLISION_END) {            
            this.handleObstacleCollisionEnd(msg.data.dir);
        }
       
        //---------------------------------------------------------------------------
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
        if (msg.action === Messages.FLIP_GRAVITY) {
            //if the player is running on surface, flip gravity            
            if (this.state.canFlip) {                
                var newDir: Direction;
                if (this.state.dir == Direction.DOWN)
                    newDir = Direction.UP;
                else if (this.state.dir == Direction.UP)
                    newDir = Direction.DOWN;
                this.modifyState({
                    dir: newDir,
                    flipPressed: false
                });
            }
            //else remember to flip on next top/bot collision
            else {                   
                this.modifyState({
                    flipPressed: true
                });
            }
        }
        if (msg.action === Messages.PLAYER_DIRECTION) {            
            this.modifyState({
                dir: msg.data
            });
        }
    }
    onUpdate(delta: number, absolute: number) {
        if (this.state.running == false)
            return;
        const dir = this.state.dir;
        const pos = this.owner.position;
        const scrWidth = this.scene.app.screen.width;
        const scrHeight = this.scene.app.screen.height;
        const boundRect = this.owner.getBounds();
        const diff = delta * this.state.difficulty;
        let newDir = dir;
        //move player up or down
        switch (dir) {
            case Direction.DOWN:
                if (this.state.allowedDown)
                    pos.y += diff;
                break;
            case Direction.UP:
                if (this.state.allowedUp)
                    pos.y -= diff;
                break;
        }
    }
}
