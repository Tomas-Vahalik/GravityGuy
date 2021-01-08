import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';
import { GarbageRemoval } from '../components/garbage-removal';
import { Shift } from '../components/shift';
import { ObstacleCollider } from '../components/obstacle-collider';
import { Checkpoint } from '../base_elements/checkpoint';
import { Direction } from '../constants/enums/direction';

export default class CheckpointEmitter extends ECS.Sprite {
    constructor(checkpointPrefab: Checkpoint, isFinish: boolean, loader: PIXI.Loader) {
        super();

        let texture;
        if (isFinish) {
            texture = loader.resources['finish'].texture;
        }
        else {
            texture = loader.resources['checkpoint'].texture;
        }
        
        texture = texture.clone();
        this.texture = texture;
        
        this.addTag('CHECKPOINT');
        this.addTag('COLLIDABLE');
        this.anchor.set(0.5);
        this.position.set(checkpointPrefab.pos.x, checkpointPrefab.pos.y);
        console.log(this.position);
        this.scale.set(0.25);
        if (checkpointPrefab.direction == Direction.UP) {
            this.scale.y *= -1;
        }

        this.addComponent(new Shift(null));
        this.addComponent(new GarbageRemoval(null));
        
	
  }
}
