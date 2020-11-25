import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';
import { GarbageRemoval } from '../components/garbage-removal';
import { Shift } from '../components/shift';
import { ObstacleCollider } from '../components/obstacle-collider';
import { Checkpoint } from '../base_elements/checkpoint';

export default class CheckpointEmitter extends ECS.Graphics {
  constructor(checkpointPrefab: Checkpoint) {
	super();

	this.beginFill(0x0000ff);
    this.drawRect(0, 0, checkpointPrefab.block.width, checkpointPrefab.block.height);

	this.endFill();
    this.position.set(checkpointPrefab.block.pos.x, checkpointPrefab.block.pos.y);

	this.addTag('CHECKPOINT');
	this.addComponent(new Shift(null));
	this.addComponent(new GarbageRemoval(null));
	this.addComponent(new ObstacleCollider(null));
  }
}
