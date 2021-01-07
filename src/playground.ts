import * as ECS from '../libs/pixi-ecs';
import { InputManager } from './input_manager/input-manager';
import { Block } from './base_elements/block';
import { LoadManager } from './components/load-manager';
import { GameScene } from './components/scenes/game-scene';


export class Playground {	
	engine: ECS.Engine;

	constructor(engine: ECS.Engine) {
		this.engine = engine;

        this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());       
		this.engine.scene.addGlobalComponent(new InputManager(null));
        this.engine.scene.addGlobalComponent(new LoadManager(this.engine));
        
	}
}