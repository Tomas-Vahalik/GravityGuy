import ObstacleEmitter from './obstacle-emitter';
import BuffEmitter from './buff-emitter';
import Player from './player';
import { Block } from '../base_elements/block';
import CheckpointEmitter from './checkpoint-emitter';
import { Position } from '../base_elements/position';
import * as ECS from '../../libs/pixi-ecs';
import { SpecialEffect } from '../base_elements/special-effect';
import { Checkpoint } from '../base_elements/checkpoint';
import Text from './text';

export default class BlockFactory {
  static _instance: BlockFactory;

  constructor() {
	if (!BlockFactory._instance) {
		BlockFactory._instance = this;
	}
	  return BlockFactory._instance;
  }
  static getInstance() {
	  return this._instance;
  }


  createObstacle(prefab: Block): ECS.Graphics {
      return new ObstacleEmitter(prefab);
  }
  createBuff(prefab: SpecialEffect): ECS.Graphics {
	  return new BuffEmitter(prefab);
  }  
  createCheckPoint(prefab: Checkpoint, isFinish: boolean, loader: PIXI.Loader): ECS.Sprite {
      return new CheckpointEmitter(prefab, isFinish, loader);
  }
    
  createPlayer(spawnPoint: Position, loader: PIXI.Loader): ECS.Sprite {
	  return new Player(spawnPoint, loader);
  }
  createText(text: string): PIXI.Text {
	  return new Text(text);
  }
}
