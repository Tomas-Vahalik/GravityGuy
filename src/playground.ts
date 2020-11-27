import * as ECS from '../libs/pixi-ecs';
import { SceneManager } from './scene-manager';
import { Block } from './base_elements/block';
import { LoadManager } from './components/load-manager';

export class Playground {
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
	}
}