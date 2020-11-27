import * as ECS from '../../libs/pixi-ecs';
import { Messages } from '../constants/enums/messeges';
import { Direction } from '../constants/enums/direction';

const sprite = {
    offsetX: 200,
    offsetY: 200,
    width: 200,
    height: 200
}
const frames = 8;
export class AnimationComponent extends ECS.Component {
    frame = 0;
    frameCounter = 0;

    loader;
    constructor(loader: PIXI.Loader) {
        super(null);
        this.loader = loader;
    }
    onInit() {

        // this.createBackground();
        this.owner.asSprite().zIndex = 2;
        this.fixedFrequency = 16;
        this.subscribe(Messages.FLIP_IMAGE);
        this.subscribe(Messages.SLOW_MOTION_START);
        this.subscribe(Messages.SLOW_MOTION_END);
        this.subscribe(Messages.PLAYER_DIRECTION);

        this.owner.asSprite().texture.frame = new PIXI.Rectangle(
            (this.frame % 4) * sprite.offsetX,
            Math.floor(this.frame / 4) * sprite.offsetY,
            sprite.width,
            sprite.height
        );
    }
    createBackground() {
        let texture = this.loader.resources['background'].texture;
        texture = texture.clone();

        new ECS.Builder(this.scene)
            .asSprite(texture)
            .withParent(this.scene.stage)
            .localPos(this.scene.width / 2, this.scene.height / 2)
            .anchor(0.5)
            .scale(1.2)
            .withTag('BACKGROUND')
            .build();
    }
    onFixedUpdate(delta: number, absolute: number) {
        this.owner.asSprite().texture.frame = new PIXI.Rectangle(
            (this.frame % 4) * sprite.offsetX,
            Math.floor(this.frame / 4) * sprite.offsetY,
            sprite.width,
            sprite.height
        );
        this.frame = (this.frameCounter++) % frames;

    }
    onMessage(msg: ECS.Message) {
        if (msg.action == Messages.FLIP_IMAGE) {
            this.owner.asSprite().scale.y *= -1;
        }
        else if (msg.action == Messages.SLOW_MOTION_START) {
            this.fixedFrequency = 6;
        }
        else if (msg.action == Messages.SLOW_MOTION_END) {
            this.fixedFrequency = 12;
        }
        else if (msg.action == Messages.PLAYER_DIRECTION && msg.data == Direction.UP) {
            this.owner.asSprite().scale.y *= -1;
        }
    }

}