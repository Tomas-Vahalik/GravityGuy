import { ObstacleCollider } from './obstacle-collider';
import { PlayerMovement } from './player-movement';
import { PlayerCollider } from './player-collider';
import { GarbageRemoval } from './garbage-removal';
import { Messages, objectEmitter, buffEmitter } from './playground';
import { Map } from './base_elements/map';
import * as ECS from '../libs/pixi-ecs';
import { Maps } from './constants';

export class SceneManager extends ECS.Component {
    map: Maps = Maps.MAP_1;
    keyInput: ECS.KeyInputComponent;
    loader: PIXI.Loader;
    running = true;

    constructor(loader: PIXI.Loader) {
        super();
        this.loader = loader;
    }

    onInit() {
        this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);

        this.loadScene();

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
        const newObj = objectEmitter(this.scene, null);
        this.scene.stage.addChild(newObj);
    }

    loadScene() {
        const mapData = this.loader.resources[this.map].data as Map;
        //CREATE PLAYER
        const player = new ECS.Graphics();
        player.beginFill(0xFFFFFF);
        player.tint = 0xFF0000;
        player.drawRect(0, 0, 40, 40);
        player.name = 'PLAYER';
        player.addTag('PLAYER');
        player.endFill();
        player.position.set(mapData.spawnpoint.x, mapData.spawnpoint.y);
        //player.addComponent(new ObstacleCollider(null));
        player.addComponent(new PlayerCollider(null));
        player.addComponent(new PlayerMovement(null));
        player.addComponent(new GarbageRemoval(null));
        this.scene.stage.addChild(player);

        mapData.blocks.forEach(blockPrefab => {
            const newObj = objectEmitter(this.scene, blockPrefab);
            this.scene.stage.addChild(newObj);
        })
        mapData.specialEffects.forEach(specialEffectPrefab => {
            const newObj = buffEmitter(this.scene, specialEffectPrefab.block);
            this.scene.stage.addChild(newObj);
        })
    }
}
