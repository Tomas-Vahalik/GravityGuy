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

export class ScoreBoardScene extends ECS.Component {
  loader: PIXI.Loader;

  score: number[];
  constructor(loader: PIXI.Loader) {
	super();
	this.loader = loader;

	this.score = [350, 320, 290, 270, 260, 230, 190, 170, 130, 50];
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

	this.score.forEach((val, index) => {
		const number = BlockFactory.getInstance().createText((index + 1) +'.');
		number.position.set(sceneWidth / 4 - 50, 60 + 40 * index);
		this.scene.stage.addChild(number);

		const score = BlockFactory.getInstance().createText(val.toString());
		score.position.set(sceneWidth - sceneWidth / 4, 60 + (40 * index));
		this.scene.stage.addChild(score);
    });

    const button = BlockFactory.getInstance().createText('Press ENTER to START');
	button.position.set(sceneWidth / 2 - 130, 540 );
	this.scene.stage.addChild(button);
  }
}
