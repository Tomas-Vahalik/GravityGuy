import * as ECS from '../libs/pixi-ecs/';
import { KeyInputComponent } from '../libs/pixi-ecs/components/key-input-component';
import { ObstacleCollider } from './obstacle-collider';
import { GarbageRemoval } from './garbage-removal';
import { Shift } from './shift';
import { SceneManager } from './scene-manager';
import { Block } from './base_elements/block';

export enum Messages {
    OBJECT_POSITION = 'OBJECT_POSITION',
    OBJECT_DESTROYED = 'OBJECT_DESTROYED',
    COLLISION = 'COLLISION',
    COLLISION_END = 'COLLISION_END',

    COLLISION_TOP = 'COLLISION_TOP',
    COLLISION_TOP_END = 'COLLISION_TOP_END',
    COLLISION_BOT = 'COLLISION_BOT',
    COLLISION_BOT_END = 'COLLISION_BOT_END',
    COLLISION_LEFT = 'COLLISION_LEFT',
    COLLISION_LEFT_END = 'COLLISION_LEFT_END',
    COLLISION_RIGHT = 'COLLISION_RIGHT',
    COLLISION_RIGHT_END = 'COLLISION_TOP_RIGHT',

    FREEZE = 'FREEZE',
    UNFREEZE = 'UNFREEZE',

    PLAYER_RESET = 'PLAYER_RESET',
    FLIP_GRAVITY = 'FLIP',

    BUFF = 'BUFF'
}
export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}
export const objectEmitter = (scene: ECS.Scene, blockPrefab: Block): ECS.Graphics => {
    const obj = new ECS.Graphics();
    const sizeX = Math.random() * 200;
    const sizeY = Math.random() * 200;

    if (blockPrefab == null) {
        const randomPosX = Math.random() * (scene.app.screen.width);
        const randomPosY = Math.random() * (scene.app.screen.height);
        var posX = scene.app.screen.width;

        obj.beginFill(0xFFFFFF);
        obj.drawRect(0, 0, sizeX, sizeY);

        obj.endFill();
        obj.position.set(posX, randomPosY);
    } else {
        var posX = scene.app.screen.width;

        obj.beginFill(0xFFFFFF);
        obj.drawRect(0, 0, blockPrefab.width, blockPrefab.height);

        obj.endFill();
        obj.position.set(blockPrefab.pos.x, blockPrefab.pos.y);
    }

    obj.addTag("OBJECT");
    obj.addComponent(new Shift(null));
    obj.addComponent(new GarbageRemoval(null));
    obj.addComponent(new ObstacleCollider(null));

    return obj;
};
export const buffEmitter = (scene: ECS.Scene, blockPrefab: Block): ECS.Graphics => {
    const obj = new ECS.Graphics();
    const sizeX = 20;
    const sizeY = 20;

    if (blockPrefab == null) {
        const randomPosX = Math.random() * (scene.app.screen.width);
        const randomPosY = Math.random() * (scene.app.screen.height);
        var posX = scene.app.screen.width;

        obj.beginFill(0xFFFF00);
        obj.tint = 0xFFFF00;
        obj.drawRect(0, 0, sizeX, sizeY);

        obj.endFill();
        obj.position.set(posX, randomPosY);
    } else {
        var posX = scene.app.screen.width;

        obj.beginFill(0xFFFF00);
        obj.tint = 0xFFFF00;
        obj.drawRect(0, 0, blockPrefab.width, blockPrefab.height);

        obj.endFill();
        obj.position.set(blockPrefab.pos.x, blockPrefab.pos.y);
    }
    obj.addTag("BUFF");
    obj.addComponent(new Shift(null));
    obj.addComponent(new GarbageRemoval(null));
    obj.addComponent(new ObstacleCollider(null));

    return obj;
};

export class Playground{
    offsetY = 500;
    blocks: Block[] = [];
    loadBlock: number;
    engine: ECS.Engine;
    constructor(engine: ECS.Engine) {
        this.engine = engine;

        this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
        var SM = new SceneManager(this.engine.app.loader);
        this.engine.scene.addGlobalComponent(SM);
        this.engine.scene.addGlobalComponent(new ECS.FuncComponent('time spawner')
            .setFixedFrequency(3)
            .doOnFixedUpdate((cmp, delta, absolute) => {
                var newObj;
                if (Math.random() > 0.1) {
                    newObj = objectEmitter(this.engine.scene, null);
                }
                else {
                    newObj = buffEmitter(this.engine.scene, null);
                }
                //this.engine.scene.stage.addChild(newObj);
            }));
    }
}