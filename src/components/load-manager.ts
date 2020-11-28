import * as ECS from "../../libs/pixi-ecs";
import { GameScene } from "./scenes/game-scene";
import { ScoreBoardScene } from "./scenes/score-board-scene";
import { Messages } from '../constants/enums/messeges';

export class LoadManager extends ECS.Component {
  engine: ECS.Engine;
  currentScene: ECS.Component;

  isScoreBoard: boolean;

  constructor(engine: ECS.Engine) {
	super(null);

	this.engine = engine;
	this.currentScene = new ScoreBoardScene(this.engine.app.loader);
	this.isScoreBoard = true;
  }

  onInit() {
	this.subscribe(Messages.START_GAME);

	this.engine.scene.addGlobalComponent(this.currentScene);
  }

  onMessage(msg: ECS.Message) {
	if (msg.action == Messages.START_GAME && this.isScoreBoard) {
		this.engine.scene.removeGlobalComponent(this.currentScene);

		this.currentScene = new GameScene(this.engine.app.loader);
		this.engine.scene.addGlobalComponent(this.currentScene);
	}
  }
}
