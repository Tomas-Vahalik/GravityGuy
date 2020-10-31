import { Direction, Messages } from './playground';
import { Shift } from "./Shift";
import * as ECS from '../libs/pixi-ecs';

export class PlayerMovement extends ECS.Component {
    state = {
        dir: Direction.DOWN,
        flipPressed: false,
        canFlip: false,
        allowedUp: true,
        allowedDown: true,
        running: true
    };
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        };
    }
    onInit() {
        /*this.subscribe(Messages.COLLISION);
        this.subscribe(Messages.COLLISION_END); */
        this.subscribe(Messages.COLLISION_TOP);
        this.subscribe(Messages.COLLISION_TOP_END);
        this.subscribe(Messages.COLLISION_BOT);
        this.subscribe(Messages.COLLISION_BOT_END);
        this.subscribe(Messages.COLLISION_LEFT);
        this.subscribe(Messages.COLLISION_LEFT_END);
        this.subscribe(Messages.COLLISION_RIGHT);
        this.subscribe(Messages.COLLISION_RIGHT_END);
        this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);
        this.subscribe(Messages.FLIP_GRAVITY);
        this.subscribe(Messages.PLAYER_RESET);
    }
    onMessage(msg: ECS.Message) {
        if (msg.action === Messages.COLLISION_TOP) {
            this.owner.asGraphics().tint = 0x00FF00;
            //if 'flip' was pressed, flip gravity
            if (this.state.flipPressed) {
                this.modifyState({
                    dir: Direction.DOWN,
                    flipPressed: false
                });
            }
            //block movement up and allow 'flip'
            else {
                this.modifyState({
                    allowedUp: false,
                    canFlip: true
                });
            }
        }
        if (msg.action === Messages.COLLISION_TOP_END) {
            this.owner.asGraphics().tint = 0xFF0000;
            //allow movement up and disable flip
            this.modifyState({
                allowedUp: true,
                canFlip: false
            });
        }
        if (msg.action === Messages.COLLISION_BOT) {
            this.owner.asGraphics().tint = 0x0000FF;
            //if 'flip' was pressed, flip gravity
            if (this.state.flipPressed) {
                this.modifyState({
                    dir: Direction.UP,
                    flipPressed: false
                });
            }
            //else block movement down and allow flip
            else {
                this.modifyState({
                    allowedDown: false,
                    canFlip: true
                });
            }
        }
        if (msg.action === Messages.COLLISION_BOT_END) {
            this.owner.asGraphics().tint = 0xFF0000;
            //allow movement down and disable flip
            this.modifyState({
                allowedDown: true,
                canFlip: false
            });
        }
        if (msg.action === Messages.COLLISION_RIGHT) {
            //make player go left
            this.owner.addComponent(new Shift(null));
        }
        if (msg.action === Messages.COLLISION_RIGHT_END) {
            //stop shifting player
            var shift = this.owner.findComponentByName('Shift');
            if (shift)
                this.owner.removeComponent(shift);
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
                if (this.state.dir == Direction.UP)
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
        if (msg.action === Messages.PLAYER_RESET) {
            //reset player attributes
            var shift = this.owner.findComponentByName('Shift');
            if (shift)
                this.owner.removeComponent(shift);
            this.owner.position.set(300, 250);
            this.modifyState({
                allowedUp: true,
                allowedDown: true,
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
        const diff = delta * 0.6;
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
