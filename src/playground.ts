import * as ECS from '../libs/pixi-ecs/';
import { KeyInputComponent } from '../libs/pixi-ecs/components/key-input-component';
import { ObstacleCollider } from './obstacle-collider';
import { GarbageRemoval } from './garbage-removal';
import { Shift } from './shift';
import { SceneManager } from './scene-manager';

class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x; this.y = y; this.width = w; this.height = h;
    }
}

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
export const objectEmitter = (scene: ECS.Scene): ECS.Graphics => {
    const obj = new ECS.Graphics();
    const sizeX = Math.random() * 200;
    const sizeY = Math.random() * 200;

    const randomPosX = Math.random() * (scene.app.screen.width);
    const randomPosY = Math.random() * (scene.app.screen.height);
    var posX = scene.app.screen.width;

    obj.beginFill(0xFFFFFF);
    obj.drawRect(0, 0, sizeX, sizeY);

    obj.endFill();
    obj.position.set(posX, randomPosY);
    obj.addTag("OBJECT");
    obj.addComponent(new Shift(null));
    obj.addComponent(new GarbageRemoval(null));
    obj.addComponent(new ObstacleCollider(null));

    return obj;
};
const buffEmitter = (scene: ECS.Scene): ECS.Graphics => {
    const obj = new ECS.Graphics();
    const sizeX = 20;
    const sizeY = 20;

    const randomPosX = Math.random() * (scene.app.screen.width);
    const randomPosY = Math.random() * (scene.app.screen.height);
    var posX = scene.app.screen.width;

    obj.beginFill(0xFFFFFF);
    obj.tint = 0xFFFF00;
    obj.drawRect(0, 0, sizeX, sizeY);

    obj.endFill();
    obj.position.set(posX, randomPosY);
    obj.addTag("BUFF");
    obj.addComponent(new Shift(null));
    obj.addComponent(new GarbageRemoval(null));
    obj.addComponent(new ObstacleCollider(null));

    return obj;
};

export class Playground{

    offsetY = 500;
    engine: ECS.Engine;
    blocks: Rect[] = [];
    loadBlock: number;
    constructor() {
        this.engine = new ECS.Engine();
        var canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.engine.init(canvas, {

        });

        this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
        var SM = new SceneManager(null);
        this.engine.scene.addGlobalComponent(SM);
        this.engine.scene.addGlobalComponent(new ECS.FuncComponent('time spawner')
            .setFixedFrequency(3)
            .doOnFixedUpdate((cmp, delta, absolute) => {
                var newObj;
                if (Math.random() > 0.1) {
                    newObj = objectEmitter(this.engine.scene);
                }
                else {
                    newObj = buffEmitter(this.engine.scene);
                }
                this.engine.scene.stage.addChild(newObj);
            }));
    }
}

export default new Playground();