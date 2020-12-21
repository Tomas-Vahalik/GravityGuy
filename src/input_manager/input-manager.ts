import { Messages} from '../constants/enums/messeges';
import * as ECS from '../../libs/pixi-ecs';
import { GameState } from '../constants/enums/game-state';
import { LOCALSTORAGE_NAME } from '../constants/constants';

export class InputManager extends ECS.Component {
	keyInput: ECS.KeyInputComponent;
   running = true;

	gameState: GameState;;

	onInit() {
		this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);

		let name = localStorage.getItem(LOCALSTORAGE_NAME);
		if (name) {
			this.gameState = GameState.SCORE_BOARD;
		} else {
			this.gameState = GameState.NAME_INPUT;
        }
        this.subscribe(Messages.END_GAME);
	}

    onMessage(msg: ECS.Message) {
        if (msg.action == Messages.END_GAME) {
            this.gameState = GameState.SCORE_BOARD;
        }
    }
	onUpdate(delta: number, absolute: number) {
		console.log(this.gameState);
		switch (this.gameState) {
			case GameState.SCORE_BOARD:
				if (this.keyInput.isKeyPressed(ECS.Keys.KEY_ENTER)) {
					this.keyInput.handleKey(ECS.Keys.KEY_ENTER);
					this.gameState = GameState.GAME_ACTIVE
					this.sendMessage(Messages.START_GAME);
				} else if (this.keyInput.isKeyPressed(ECS.Keys.KEY_R)) {
					this.keyInput.handleKey(ECS.Keys.KEY_R);
					this.gameState = GameState.NAME_INPUT;
					this.sendMessage(Messages.CHANGE_NAME);
				}
				break;
			case GameState.GAME_ACTIVE:
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
				if (this.keyInput.isKeyPressed(ECS.Keys.KEY_N)) {
					this.keyInput.handleKey(ECS.Keys.KEY_N);
					this.sendMessage(Messages.SPAWN_BLOCK);
                }
                if (this.keyInput.isKeyPressed(ECS.Keys.KEY_ENTER)) {
                    this.keyInput.handleKey(ECS.Keys.KEY_ENTER);
                    this.gameState = GameState.GAME_ACTIVE
                    this.sendMessage(Messages.START_GAME);
                }
				break;
			case GameState.NAME_INPUT:
				if (this.keyInput.isKeyPressed(ECS.Keys.KEY_ENTER)) {
					this.keyInput.handleKey(ECS.Keys.KEY_ENTER);
					this.gameState = GameState.SCORE_BOARD;
					this.sendMessage(Messages.NAME_CONFIRM);
				}
				break;
		}
	}
}
