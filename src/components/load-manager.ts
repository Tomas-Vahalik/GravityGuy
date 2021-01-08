import * as ECS from "../../libs/pixi-ecs";
import { GameScene } from "./scenes/game-scene";
import { ScoreBoardScene } from "./scenes/score-board-scene";
import { Messages } from '../constants/enums/messeges';
import { NameInputScene } from "./scenes/name-input-scene";
import { LOCALSTORAGE_NAME } from "../constants/constants";

export class LoadManager extends ECS.Component {
  engine: ECS.Engine;
  currentScene: ECS.Component;

  constructor(engine: ECS.Engine) {
	super(null);

	this.engine = engine;

	let name = localStorage.getItem(LOCALSTORAGE_NAME);
	if (name) {
		// this.currentScene = new GameScene(this.engine.app.loader);
		this.currentScene = new ScoreBoardScene(this.engine.app.loader);
	} else {
		this.currentScene = new NameInputScene(this.engine.app.loader);
	}
  }

  onInit() {
	this.subscribe(Messages.START_GAME);
	this.subscribe(Messages.END_GAME);
	this.subscribe(Messages.LOAD_BOARD);
	this.subscribe(Messages.CHANGE_NAME);

	this.engine.scene.addGlobalComponent(this.currentScene);
  }

  onMessage(msg: ECS.Message) {
	this.engine.scene.removeGlobalComponent(this.currentScene);

	if (msg.action == Messages.START_GAME) {
		this.currentScene = new GameScene(this.engine.app.loader);
	} else if (msg.action == Messages.CHANGE_NAME) {
		this.currentScene = new NameInputScene(this.engine.app.loader);
	} else if (msg.action == Messages.LOAD_BOARD || msg.action == Messages.END_GAME) {
		this.currentScene = new ScoreBoardScene(this.engine.app.loader);
		console.log("score")
	}
	console.log("added")
	this.engine.scene.addGlobalComponent(this.currentScene);
  }
}
