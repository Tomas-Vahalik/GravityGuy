import * as ECS from '../libs/pixi-ecs/';
import { KeyInputComponent } from '../libs/pixi-ecs/components/key-input-component';
import { ObstacleCollider } from './obstacle-collider';
import { GarbageRemoval } from './garbage-removal';
import { Shift } from './shift';
import { SceneManager } from './scene-manager';
import { Block } from './base_elements/block';
import { LoadManager, objectEmitter, buffEmitter } from './load-manager';

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

    BUFF = 'BUFF',
    LOAD_CHECKPOINT = 'LOAD_CHECKPOINT',
    SAVE_CHECKPOINT = 'SAVE_CHECKPOINT',

    PLAYER_DIRECTION = 'PLAYER_DIRECTION'
    
}
export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}


export class Playground{
    offsetY = 500;
    blocks: Block[] = [];
    loadBlock: number;
    engine: ECS.Engine;
    constructor(engine: ECS.Engine) {
        this.engine = engine;

        this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
        //var SM = new SceneManager(this.engine.app.loader);
        this.engine.scene.addGlobalComponent(new SceneManager(null));
        this.engine.scene.addGlobalComponent(new LoadManager(this.engine.app.loader));
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
                this.engine.scene.stage.addChild(newObj);
            }));
       
    }
}