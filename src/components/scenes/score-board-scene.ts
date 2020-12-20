import * as ECS from '../../../libs/pixi-ecs';

import BlockFactory from '../../block_factory/block-factory';
import { LOCALSTORAGE_NAME } from '../../constants/constants';

export class ScoreBoardScene extends ECS.Component {
  loader: PIXI.Loader;

  score: number[];
  constructor(loader: PIXI.Loader) {
    
	super();
	this.loader = loader;
  }

  sendGet() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
              this.score = JSON.parse(xhr.response);
              this.score.sort((a, b) => b - a);
              this.loadScene();
          }
      }.bind(this);      
      xhr.open("GET", "http://localhost:8888/get/", true);
      xhr.send();
  }
  onInit() {
      this.sendGet();
  }

  onRemove(){
    this.scene.stage.removeChildren();
}

  loadScene() {
	let sceneWidth = this.scene.width;
	let name = localStorage.getItem(LOCALSTORAGE_NAME);
	const nickName = BlockFactory.getInstance().createText('Nickname (R): ' + name);
	nickName.position.set(10, 10);
	this.scene.stage.addChild(nickName);

	const title = BlockFactory.getInstance().createText('SCOREBOARD');
	title.position.set(sceneWidth / 2 - 80, 50);
	this.scene.stage.addChild(title);

	if (this.score.length > 0) {
		this.score.forEach((val, index) => {
			if (index < 10) {
			const number = BlockFactory.getInstance().createText((index + 1) +'.');
			number.position.set(sceneWidth / 4 - 50, 70 + 40 * index);
			this.scene.stage.addChild(number);

			const score = BlockFactory.getInstance().createText(val.toString());
			score.position.set(sceneWidth - sceneWidth / 4, 70 + (40 * index));
			this.scene.stage.addChild(score);
			}
		});
	} else {
		const text = BlockFactory.getInstance().createText('No game played yet');
		text.position.set(sceneWidth / 2 - 115, 70);
		this.scene.stage.addChild(text);
	}

	let bottomText = 'Press ENTER to START';
    if (!name) {
		bottomText = "Press R gain a Nickname!"; 
	}

    const button = BlockFactory.getInstance().createText(bottomText);
	button.position.set(sceneWidth / 2 - 130, 540 );
	this.scene.stage.addChild(button);
  }
}
