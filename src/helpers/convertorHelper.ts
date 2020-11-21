import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';

export default class ConvertorHelper {
  static convertGoToBlock(gameObject: ECS.Container) {
	return new Block(
		gameObject.x,
		gameObject.y,
		gameObject.width,
		gameObject.height
	);
  }
}
