import { ObstacleCollider } from './obstacle-collider';
import { PlayerMovement } from './player-movement';
import { PlayerCollider } from './player-collider';
import { GarbageRemoval } from './garbage-removal';
import { Messages} from './playground';
import { Map } from './base_elements/map';
import * as ECS from '../libs/pixi-ecs';
import { Maps } from './constants';
import { Block } from './base_elements/block';
import { Shift } from './shift';
import { Checkpoint } from './checkpoint';



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


export class LoadManager extends ECS.Component {
    mapName: Maps;    
    mapData: Map;
    loader: PIXI.Loader;
    running = true;    

    constructor(loader: PIXI.Loader) {
        super();
        this.loader = loader;
    }

    onInit() {
        this.subscribe(Messages.LOAD_CHECKPOINT, Messages.CHECKPOINT_REACHED);

        this.mapName = Maps.MAP_1;
        this.mapData = this.loader.resources[this.mapName].data as Map;
        this.loadScene();
        this.addBorders();
        
    }
    onMessage(msg: ECS.Message) {
        if (msg.action == Messages.LOAD_CHECKPOINT) {
            this.loadScene();
            this.addBorders();
        }
        if (msg.action == Messages.CHECKPOINT_REACHED) {
            this.mapData = msg.data;
        }
    }
   
    spawnObject() {
        const newObj = objectEmitter(this.scene, null);
        this.scene.stage.addChild(newObj);
    }
    addBorders() {
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
    loadScene() {
        var ch = this.scene.stage.children.length;
        this.scene.stage.removeChildren(0, ch);
        //var mapData;       
        
      

        //CREATE PLAYER
        const player = new ECS.Graphics();
        player.beginFill(0xFFFFFF);
        player.tint = 0xFF0000;
        player.drawRect(0, 0, 40, 40);
        player.name = 'PLAYER';
        player.addTag('PLAYER');
        player.endFill();
        player.position.set(this.mapData.spawnpoint.x, this.mapData.spawnpoint.y);
        //player.addComponent(new ObstacleCollider(null));
        player.addComponent(new PlayerCollider(null));
        player.addComponent(new PlayerMovement(null));
        player.addComponent(new GarbageRemoval(null));
        this.scene.stage.addChild(player);

        //add all obstacles
        this.mapData.blocks.forEach(blockPrefab => {
            const newObj = objectEmitter(this.scene, blockPrefab);
            this.scene.stage.addChild(newObj);
        })
        //add buffs
        this.mapData.specialEffects.forEach(specialEffectPrefab => {
            const newObj = buffEmitter(this.scene, specialEffectPrefab.block);
            this.scene.stage.addChild(newObj);
        })
        //add checkpoint
        const checkpoint = new ECS.Graphics();
        checkpoint.beginFill(0xFFFFFF);
        checkpoint.tint = 0x0000FF;
        checkpoint.drawRect(0, 0, 20, this.scene.height);
        checkpoint.name = 'CHEKPOINT';
        checkpoint.addTag('CHECKPOINT');
        checkpoint.endFill();
        checkpoint.position.set(5000, 0);        
        checkpoint.addComponent(new Shift(null));
        checkpoint.addComponent(new ObstacleCollider(null));
        checkpoint.addComponent(new GarbageRemoval(null));
        checkpoint.addComponent(new Checkpoint(null));
        this.scene.stage.addChild(checkpoint);

        const check2 = new ECS.Graphics();
        check2.beginFill(0xFFFFFF);
        check2.tint = 0x0000FF;
        check2.drawRect(0, 0, 20, this.scene.height);
        check2.name = 'CHEKPOINT';
        check2.addTag('CHECKPOINT');
        check2.endFill();
        check2.position.set(7000, 0);
        check2.addComponent(new Shift(null));
        check2.addComponent(new ObstacleCollider(null));
        check2.addComponent(new GarbageRemoval(null));
        check2.addComponent(new Checkpoint(null));
        this.scene.stage.addChild(check2);
      
    }
}
