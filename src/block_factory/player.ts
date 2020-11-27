import * as ECS from '../../libs/pixi-ecs';
import { GarbageRemoval } from '../components/garbage-removal';
import { Position } from '../base_elements/position';
import { PlayerMovement } from '../components/player-movement';
import { PlayerCollider } from '../components/player-collider';
import { AnimationComponent } from '../components/player-animation';


export default class Player extends ECS.Sprite {
	constructor(spawnPosition: Position, loader: PIXI.Loader) {
		super();


		let texture = loader.resources['spritesheet'].texture;
		texture = texture.clone();
		this.texture = texture;

		this.name = 'PLAYER';
		this.addTag('PLAYER');
		this.position.set(spawnPosition.x, spawnPosition.y);
		this.anchor.set(0.5);
		this.scale.set(0.25);

		this.addComponent(new PlayerCollider(null));
		this.addComponent(new AnimationComponent(loader));
		this.addComponent(new PlayerMovement(null));
		this.addComponent(new GarbageRemoval(null));
	}
}
