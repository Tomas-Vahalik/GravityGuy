import { PlayerBuff } from './player-buff';
import { Messages } from '../constants/enums/messeges';
import * as ECS from '../../libs/pixi-ecs';
import { Direction } from '../constants/enums/direction';
export class CollisionDetails {
  dir: Direction;
  otherObject: ECS.Container;
  constructor(d: Direction, o: ECS.Container) {
	this.dir = d;
	this.otherObject = o;
  }
}

export class PlayerCollider extends ECS.Component {
  state = {
	//map of objects that the player collides
	inCollisionWith: new Map(),
	running: true,
  };
  onInit() {
	this.subscribe(Messages.OBJECT_POSITION);
	this.subscribe(Messages.OBJECT_DESTROYED);
	this.subscribe(Messages.FREEZE);
	this.subscribe(Messages.UNFREEZE);
  }
  onMessage(msg: ECS.Message) {
	if (msg.action === Messages.FREEZE) {
		this.modifyState({
		running: false,
		});
	}
	if (msg.action === Messages.UNFREEZE) {
		this.modifyState({
		running: true,
		});
	}
	if (msg.action === Messages.OBJECT_POSITION) {
		let bounds = this.owner.getBounds();
		let otherBounds = msg.data;

		//check if player collides
		if (this.checkCollisionWith(bounds, otherBounds)) {
		//If not alredy in collision with this object
            if (!this.state.inCollisionWith.has(msg.gameObject)) {
              //  msg.component.owner.asGraphics().tint = 0xff0000;
			//get direction of collision
			let dir = this.checkCollisionDirection(bounds, otherBounds);
			//remember I am in collision with this object
			this.state.inCollisionWith.set(msg.gameObject, dir);
			//adapt player position
			this.adaptPosition(otherBounds, dir);
			//send message
			this.sendMessage(
			Messages.COLLISION,
			new CollisionDetails(dir, msg.component.owner)
			);
		}
		} else {
		//if i am in collision with this object
            if (this.state.inCollisionWith.has(msg.gameObject)) {
               // msg.component.owner.asGraphics().tint = 0xffffff;
			//get direction
			let dir = this.state.inCollisionWith.get(msg.gameObject);
			//forget this object
			this.state.inCollisionWith.delete(msg.gameObject);
			//if there is no other collision that way, send message
			let directions: string[] = Array.from(
			this.state.inCollisionWith.values()
			);
			if (!directions.includes(dir)) {
			this.sendMessage(
				Messages.COLLISION_END,
				new CollisionDetails(dir, msg.component.owner)
			);
			}
		}
		}
	}
	if (msg.action === Messages.OBJECT_DESTROYED) {
        //forget collision with object
        if (this.state.inCollisionWith.has(msg.gameObject)) {
           
            this.sendMessage(
                Messages.COLLISION_END,
                new CollisionDetails(this.state.inCollisionWith.get(msg.gameObject), msg.component.owner)
            );
        }
		this.state.inCollisionWith.delete(msg.gameObject);
	}
  }
  onUpdate(delta: number, absolute: number) {}
  //checks if player collides with given object
  checkCollisionWith(
	bounds: PIXI.Rectangle,
	otherBounds: PIXI.Rectangle
  ): boolean {
	if (
		bounds.x < otherBounds.x + otherBounds.width &&
		bounds.x + bounds.width > otherBounds.x &&
		bounds.y < otherBounds.y + otherBounds.height &&
		bounds.y + bounds.height > otherBounds.y
	) {
		return true;
	} else { return false; }
  }
  //checks the direction of collision
  checkCollisionDirection(
	bounds: PIXI.Rectangle,
	otherBounds: PIXI.Rectangle
  ): Direction {
	let b_collision = otherBounds.bottom - bounds.y;
	let t_collision = bounds.bottom - otherBounds.y;
	let l_collision = bounds.right - otherBounds.x;
	let r_collision = otherBounds.right - bounds.x;

	if (
		t_collision < b_collision &&
		t_collision < l_collision &&
		t_collision < r_collision
	) {
		//bottom collision
		//this.owner.asGraphics().tint = 0xFFFF00;
		return Direction.DOWN;
	}
	if (
		b_collision < t_collision &&
		b_collision < l_collision &&
		b_collision < r_collision
	) {
		//top collision
		//this.owner.asGraphics().tint = 0xFF00FF;
		return Direction.UP;
	}
	if (
		l_collision < r_collision &&
		l_collision < t_collision &&
		l_collision < b_collision
	) {
		//right collision
		//this.owner.asGraphics().tint = 0x00FFFF;
		return Direction.RIGHT;
	}
	if (
		r_collision < l_collision &&
		r_collision < t_collision &&
		r_collision < b_collision
	) {
		//left collision
		//this.owner.asGraphics().tint = 0xF0F0F0;
		return Direction.LEFT;
	}
  }
  //prevent player from moving into obstacle
  adaptPosition(otherBounds: PIXI.Rectangle, dir: Direction) {
	switch (dir) {
        case Direction.UP:
            this.owner.position.y = otherBounds.bottom + this.owner.getBounds().height/2 - 1;
		break;
        case Direction.DOWN:
            //console.log("player: " + this.owner.position.y);
            //console.log("obstacle: " + otherBounds.top);
		this.owner.position.y =
			otherBounds.top - this.owner.getBounds().height/2 + 1;
		break;
		case Direction.RIGHT:
		this.owner.position.x =
			otherBounds.left - this.owner.getBounds().width/2 + 1;
		break;
		case Direction.LEFT:
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
