import { Messages } from '../../constants/enums/messeges';
import { Map } from '../../base_elements/map';
import * as ECS from '../../../libs/pixi-ecs';
import { Maps } from '../../constants/enums/maps';
import { Block } from '../../base_elements/block';
import { Checkpoint } from '../../base_elements/checkpoint';
import { SpecialEffect } from '../../base_elements/special-effect';
import { Position } from '../../base_elements/position';

import BlockFactory from '../../block_factory/block-factory';
import DirectionManager from '../../direction-manager';
import ConvertorHelper from '../../helpers/convertorHelper';

import { Direction } from '../../constants/enums/direction';
import Score from '../../block_factory/text';
import { LOCALSTORAGE_SCORE } from '../../constants/constants';

export class ScoreBoardScene extends ECS.Component {
  loader: PIXI.Loader;

  score: number[];
  constructor(loader: PIXI.Loader) {
	super();
	this.loader = loader;
	let data = localStorage.getItem(LOCALSTORAGE_SCORE);
	if (data) {
		console.log("not new");
		this.score = JSON.parse('[' + data + ']');
		this.score.sort((a, b) => b - a);
	} else {
		console.log("new");
		localStorage.setItem(LOCALSTORAGE_SCORE, [].toString());
		this.score = [];
	}
  }

  onInit() {
	this.subscribe(Messages.LOAD_CHECKPOINT);
	this.loadScene();
  }

  loadScene() {
	let sceneWidth = this.scene.width;
	let sceneHeight = this.scene.height;

	const title = BlockFactory.getInstance().createText('SCORE');
	title.position.set(sceneWidth / 2 - 50, 20);
	this.scene.stage.addChild(title);

	if (this.score.length > 0) {
		this.score.forEach((val, index) => {
			if (index < 10) {
			const number = BlockFactory.getInstance().createText((index + 1) +'.');
			number.position.set(sceneWidth / 4 - 50, 60 + 40 * index);
			this.scene.stage.addChild(number);

			const score = BlockFactory.getInstance().createText(val.toString());
			score.position.set(sceneWidth - sceneWidth / 4, 60 + (40 * index));
			this.scene.stage.addChild(score);
			}
		});
	} else {
		const text = BlockFactory.getInstance().createText('No game played yet');
		text.position.set(sceneWidth / 2 - 115, 70);
		this.scene.stage.addChild(text);
	}

    const button = BlockFactory.getInstance().createText('Press ENTER to START');
	button.position.set(sceneWidth / 2 - 130, 540 );
	this.scene.stage.addChild(button);
  }
}
