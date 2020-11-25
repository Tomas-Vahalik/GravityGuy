import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';
import { GarbageRemoval } from '../components/garbage-removal';
import { Shift } from '../components/shift';
import { ObstacleCollider } from '../components/obstacle-collider';
import { SpecialEffect } from '../base_elements/special-effect';

export default class BuffEmitter extends ECS.Graphics {
  constructor(blockPrefab: SpecialEffect) {
	super();
	this.beginFill(0xffff00);
	this.tint = 0xffff00;
    this.drawRect(0, 0, blockPrefab.block.width, blockPrefab.block.height);

	this.endFill();
    this.position.set(blockPrefab.block.pos.x, blockPrefab.block.pos.y);

    if (blockPrefab.type == 1) this.addTag('BUFF');
    else if (blockPrefab.type == 2) this.addTag('SLOW');      
	this.addComponent(new Shift(null));
	this.addComponent(new GarbageRemoval(null));
	this.addComponent(new ObstacleCollider(null));
  }
}
