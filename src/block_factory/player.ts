import * as ECS from '../../libs/pixi-ecs';
import { GarbageRemoval } from '../garbage-removal';
import { Position } from '../base_elements/position';
import { PlayerMovement } from '../player-movement';
import { PlayerCollider } from '../player-collider';

export default class ObstacleEmitter extends ECS.Graphics {
  constructor(spawnPosition: Position) {
	super();

	this.beginFill(0xffffff);
	this.tint = 0xff0000;
	this.drawRect(0, 0, 40, 40);
	this.name = 'PLAYER';
	this.addTag('PLAYER');
	this.endFill();
	this.position.set(spawnPosition.x, spawnPosition.y);
	//player.addComponent(new ObstacleCollider(null));
	this.addComponent(new PlayerCollider(null));
	this.addComponent(new PlayerMovement(null));
	this.addComponent(new GarbageRemoval(null));
  }
}
