import { Messages} from './constants/enums/messeges';
import * as ECS from '../libs/pixi-ecs';

export class InputManager extends ECS.Component {
	keyInput: ECS.KeyInputComponent;
   running = true;

	onInit() {
		this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
	}

	onUpdate(delta: number, absolute: number) {
		if (this.keyInput.isKeyPressed(ECS.Keys.KEY_W)) {
			this.keyInput.handleKey(ECS.Keys.KEY_W);
			if (this.running) {
				this.sendMessage(Messages.FREEZE);
				this.running = false;
			} else {
				this.sendMessage(Messages.UNFREEZE);
				this.running = true;
			}
		}
		if (this.keyInput.isKeyPressed(ECS.Keys.KEY_R)) {
			this.keyInput.handleKey(ECS.Keys.KEY_R);
			this.sendMessage(Messages.LOAD_CHECKPOINT);
		}
		if (this.keyInput.isKeyPressed(ECS.Keys.KEY_SPACE)) {
			this.keyInput.handleKey(ECS.Keys.KEY_SPACE);
			this.sendMessage(Messages.FLIP_GRAVITY);
		}
		if (this.keyInput.isKeyPressed(ECS.Keys.KEY_ENTER)) {
			this.keyInput.handleKey(ECS.Keys.KEY_ENTER);
			this.sendMessage(Messages.START_GAME);
		}
	}

}
