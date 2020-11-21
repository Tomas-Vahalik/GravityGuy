import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';
import { GarbageRemoval } from '../components/garbage-removal';
import { Shift } from '../components/shift';
import { ObstacleCollider } from '../components/obstacle-collider';

export default class CheckpointEmitter extends ECS.Graphics {
  constructor(blockPrefab: Block) {
	super();

	this.beginFill(0x0000ff);
	this.drawRect(0, 0, blockPrefab.width, blockPrefab.height);

	this.endFill();
	this.position.set(blockPrefab.pos.x, blockPrefab.pos.y);

	this.addTag('CHECKPOINT');
	this.addComponent(new Shift(null));
	this.addComponent(new GarbageRemoval(null));
	this.addComponent(new ObstacleCollider(null));
  }
}
