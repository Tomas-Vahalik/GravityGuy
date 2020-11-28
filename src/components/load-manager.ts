import * as ECS from '../../libs/pixi-ecs';
import { GameScene } from './scenes/game-scene';

export class LoadManager extends ECS.Component {
	engine: ECS.Engine;
	currentScene: ECS.Component;

  constructor(engine: ECS.Engine) {
	super(null);

	this.engine = engine;
  }

  onInit() {
	  this.currentScene = new GameScene(this.engine.app.loader);
		this.engine.scene.addGlobalComponent(this.currentScene);
  }
}
