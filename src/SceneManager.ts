import { ObstacleCollider } from './ObstacleCollider';
import { PlayerMovement } from './PlayerMovement';
import { PlayerCollider } from './PlayerCollider';
import { GarbageRemoval } from './GarbageRemoval';
import { Messages, objectEmitter } from './playground';
import * as ECS from '../libs/pixi-ecs';

export class SceneManager extends ECS.Component {
    keyInput: ECS.KeyInputComponent;
    running = true;
    onInit() {
        this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
        //CREATE PLAYER
        const player = new ECS.Graphics();
        const size = 40;
        player.beginFill(0xFFFFFF);
        player.tint = 0xFF0000;
        player.drawRect(0, 0, size, size);
        player.name = 'PLAYER';
        player.addTag('PLAYER');
        player.endFill();
        player.position.set(250, 250);
        //player.addComponent(new ObstacleCollider(null));
        player.addComponent(new PlayerCollider(null));
        player.addComponent(new PlayerMovement(null));
        player.addComponent(new GarbageRemoval(null));
        this.scene.stage.addChild(player);
        //CREATE CEILING / FLOOR
        const ceiling = new ECS.Graphics();
        ceiling.beginFill(0xFFFFFF);
        ceiling.drawRect(0, 0, this.scene.app.screen.width, 30);
        ceiling.endFill();
        ceiling.addComponent(new ObstacleCollider(null));
        this.scene.stage.addChild(ceiling);
        const floor = new ECS.Graphics();
        floor.beginFill(0xFFFFFF);
        floor.drawRect(0, 0, this.scene.app.screen.width, 30);
        floor.position.set(0, this.scene.app.screen.height - 30);
        floor.endFill();
        floor.addComponent(new ObstacleCollider(null));
        this.scene.stage.addChild(floor);
    }
    onUpdate(delta: number, absolute: number) {
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_Q)) {
            this.keyInput.handleKey(ECS.Keys.KEY_Q);
            this.spawnObject();
        }
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
            this.sendMessage(Messages.PLAYER_RESET);
        }
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_SPACE)) {
            this.keyInput.handleKey(ECS.Keys.KEY_SPACE);
            this.sendMessage(Messages.FLIP_GRAVITY);
        }
    }
    spawnObject() {
        const newObj = objectEmitter(this.scene);
        this.scene.stage.addChild(newObj);
    }
}
