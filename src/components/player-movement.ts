import { Messages } from '../constants/enums/messeges';
import { Shift } from './shift';
import * as ECS from '../../libs/pixi-ecs';
import { CollisionDetails } from './player-collider';
import { PlayerBuff } from './player-buff';
import { Direction } from '../constants/enums/direction';
import { SlowMotion } from './slow-motion';

export class PlayerMovement extends ECS.Component {
  state = {
	dir: Direction.DOWN,
	flipPressed: false,
	canFlip: false,
	allowedUp: true,
	allowedDown: true,
	running: true,
	speed: 0.6,
  };

  onInit() {
	this.subscribe(Messages.COLLISION);
	this.subscribe(Messages.COLLISION_END);

	this.subscribe(Messages.FREEZE);
	this.subscribe(Messages.UNFREEZE);
	this.subscribe(Messages.FLIP_GRAVITY);

    this.subscribe(Messages.PLAYER_DIRECTION);

    this.subscribe(Messages.SLOW_MOTION_START);
    this.subscribe(Messages.SLOW_MOTION_END);
  }
  onMessage(msg: ECS.Message) {
	if (msg.action == Messages.COLLISION) {
		this.handleCollisionEnter(msg.data);
	}
	else if (msg.action == Messages.COLLISION_END) {
		this.handleObstacleCollisionEnd(msg.data.dir);
	}

	//---------------------------------------------------------------------------
	else if (msg.action === Messages.FREEZE) {
		this.modifyState({
		running: false,
		});
	}
	else if (msg.action === Messages.UNFREEZE) {
		this.modifyState({
		running: true,
		});
	}
	else if (msg.action === Messages.FLIP_GRAVITY) {
		//if the player is running on surface, flip gravity
		if (this.state.canFlip) {
		let newDir: Direction;
		if (this.state.dir == Direction.DOWN) { newDir = Direction.UP;
		} else if (this.state.dir == Direction.UP) { newDir = Direction.DOWN; }
		this.modifyState({
			dir: newDir,
			flipPressed: false,
        });
        this.sendMessage(Messages.FLIP_IMAGE);
        //else remember to flip on next surface
		} else {
		this.modifyState({
			flipPressed: true,
		});
		}
	}
	else if (msg.action === Messages.PLAYER_DIRECTION) {
		this.modifyState({
		dir: msg.data,
		});
      }
    else if (msg.action == Messages.SLOW_MOTION_START) {
        this.modifyState({
            speed: 0.3,
        });
    }
    else if (msg.action == Messages.SLOW_MOTION_END) {
        this.modifyState({
            speed: 0.6,
        });
    }

  }
  onUpdate(delta: number, absolute: number) {
      if (delta > 20) delta = 20;
	if (this.state.running == false) { return; }
	const dir = this.state.dir;
	const pos = this.owner.position;
	const scrWidth = this.scene.app.screen.width;
	const scrHeight = this.scene.app.screen.height;
    const boundRect = this.owner.getBounds();
    
	const diff = delta * this.state.speed;
	let newDir = dir;
	//move player up or down
	switch (dir) {
		case Direction.DOWN:
		if (this.state.allowedDown) { pos.y += diff; }
		break;
		case Direction.UP:
		if (this.state.allowedUp) { pos.y -= diff; }
		break;
	}
  }
  handleObstacleCollisionEnter(dir: Direction) {
	switch (dir) {
		case Direction.UP:
			//if 'flip' was pressed, flip gravity
			if (this.state.flipPressed) {
				this.modifyState({
				dir: Direction.DOWN,
				flipPressed: false,
				canFlip: false,
                });
                this.sendMessage(Messages.FLIP_IMAGE);
			} else {
				this.modifyState({
				allowedUp: false,
				canFlip: true,
				});
			}
			break;
		case Direction.DOWN:
			//if 'flip' was pressed, flip gravity
			if (this.state.flipPressed) {
				this.modifyState({
				dir: Direction.UP,
				flipPressed: false,
				canFlip: false,
                });
                this.sendMessage(Messages.FLIP_IMAGE);
			} else {
				this.modifyState({
				allowedDown: false,
				canFlip: true,
				});
			}
			break;
		case Direction.RIGHT:
			this.owner.addComponent(new Shift(null));
			break;
		case Direction.LEFT:
			break;
	}
  }
  handleObstacleCollisionEnd(dir: Direction) {
	switch (dir) {
		case Direction.UP:
			//allow movement up and disable flip
			if (this.state.allowedDown == false) {
				this.modifyState({
				allowedUp: true,
				});
			} else {
				this.modifyState({
				allowedUp: true,
				canFlip: false,
				});
			}
			break;
		case Direction.DOWN:
			//allow movement down and disable flip
			if (this.state.allowedUp == false) {
				this.modifyState({
				allowedDown: true,
				});
			} else {
				this.modifyState({
				allowedDown: true,
				canFlip: false,
				});
			}
		break;
		case Direction.RIGHT:
			//stop shifting player
			let shift = this.owner.findComponentByName('Shift');
			if (shift) { this.owner.removeComponent(shift); }
			break;
			case Direction.LEFT:
		break;
	}
  }
  handleCollisionEnter(data: CollisionDetails) {
	switch (data.otherObject.tags.values().next().value) {
		case 'BUFF':
		    this.owner.addComponent(new PlayerBuff(null));
		    this.scene.stage.removeChild(data.otherObject);
		    //this.owner.asGraphics().tint = 0x00ffff;
        break;
        case 'SLOW':
            this.owner.addComponent(new SlowMotion(null));
            this.scene.stage.removeChild(data.otherObject);
        break;

		case 'CHECKPOINT':
		    this.sendMessage(Messages.SAVE_CHECKPOINT);
		    this.scene.stage.removeChild(data.otherObject);
		break;
		case 'OBJECT':
		    this.handleObstacleCollisionEnter(data.dir);
		break;
	}
  }

  private modifyState(obj) {
	this.state = {
		...this.state,
		...obj,
	};
  }
}
