import * as ECS from '../../../libs/pixi-ecs';

import BlockFactory from '../../block_factory/block-factory';
import { LOCALSTORAGE_NAME } from '../../constants/constants';
import { Messages } from '../../constants/enums/messeges';

export class NameInputScene extends ECS.Component {
    loader: PIXI.Loader;

    name: string;
    nameInput: PIXI.TextInput;
    constructor(loader: PIXI.Loader) {

    super();
      this.loader = loader;

      this.nameInput = new PIXI.TextInput({
      input: {fontSize: '25px'}, 
      box: {fill: 0xEEEEEE}
    })
    let name = localStorage.getItem(LOCALSTORAGE_NAME);
    if (name) {
      this.nameInput.text = name;
    }
    this.nameInput.placeholder = 'Enter your name...';
  }

  onInit() {
    this.subscribe(Messages.NAME_CONFIRM);
    this.loadScene();
  }

  onMessage(msg: ECS.Message) {
    if (msg.action == Messages.NAME_CONFIRM) {
        localStorage.setItem(LOCALSTORAGE_NAME, this.nameInput.text);
        this.sendMessage(Messages.LOAD_BOARD);
      }
  }
  
  onRemove(){
    this.scene.stage.removeChildren();
}

  loadScene() {
    let sceneWidth = this.scene.width;

    const title = BlockFactory.getInstance().createText('Your name shall be:');
    title.position.set(100, 146);
    this.scene.stage.addChild(title);

    this.nameInput.x = sceneWidth / 2 ;
    this.nameInput.y = 150;

    this.scene.stage.addChild(this.nameInput);
    this.nameInput.focus()

    let bottomText = 'Press ENTER to continue';
    const button = BlockFactory.getInstance().createText(bottomText);
    button.position.set(sceneWidth / 2 - 130, 540 );
    this.scene.stage.addChild(button);
  }
}
