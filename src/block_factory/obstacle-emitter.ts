import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';
import { GarbageRemoval } from '../garbage-removal';
import { Shift } from '../shift';
import { ObstacleCollider } from '../obstacle-collider';

export default class ObstacleEmitter extends ECS.Graphics {
  constructor(blockPrefab: Block) {
	super();

	this.beginFill(0xffffff);
	this.drawRect(0, 0, blockPrefab.width, blockPrefab.height);

	this.endFill();
	this.position.set(blockPrefab.pos.x, blockPrefab.pos.y);

	this.addTag('OBJECT');
	this.addComponent(new Shift(null));
	this.addComponent(new GarbageRemoval(null));
	this.addComponent(new ObstacleCollider(null));
  }
}
