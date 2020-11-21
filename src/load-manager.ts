import { Messages, Direction } from './playground';
import { Map } from './base_elements/map';
import * as ECS from '../libs/pixi-ecs';
import { Maps } from './constants';
import { Block } from './base_elements/block';
import { Checkpoint } from './base_elements/checkpoint';
import { SpecialEffect } from './base_elements/special-effect';
import { Position } from './base_elements/position';

import BlockFactory from './block_factory/block-factory';

export class LoadManager extends ECS.Component {
  mapName: Maps;
  mapData: Map;
  loader: PIXI.Loader;
  running = true;
  dir: Direction;
  blockFactory: BlockFactory;

  constructor(loader: PIXI.Loader) {
	super();
	this.loader = loader;
	this.blockFactory = new BlockFactory();
  }

  onInit() {
	this.subscribe(
		Messages.LOAD_CHECKPOINT,
		Messages.SAVE_CHECKPOINT,
		Messages.FLIP_GRAVITY
	);

	this.mapName = Maps.MAP_1;
	this.mapData = this.loader.resources[this.mapName].data as Map;
	this.loadScene();
  }
  onMessage(msg: ECS.Message) {
	if (msg.action == Messages.LOAD_CHECKPOINT) {
		this.loadScene();
	}
	if (msg.action == Messages.SAVE_CHECKPOINT) {
		//this.mapData = msg.data;
		this.mapData = new Map();
		this.mapData.dir = this.dir;
		//var block: Block;
		for (let ch of this.scene.stage.children) {
		let gameObject: ECS.Container = <ECS.Container>ch;
		switch (gameObject.tags.values().next().value) {
			case 'PLAYER':
			this.mapData.spawnpoint = new Position(gameObject.x, gameObject.y);
			break;
			case 'OBJECT':
			this.mapData.blocks.push(
				new Block(
				gameObject.x,
				gameObject.y,
				gameObject.width,
				gameObject.height
				)
			);
			break;
			case 'BUFF':
			this.mapData.specialEffects.push(
				new SpecialEffect(
				1,
				new Block(
					gameObject.x,
					gameObject.y,
					gameObject.width,
					gameObject.height
				)
				)
			);
			break;
			case 'CHECKPOINT':
			this.mapData.checkpoints.push(
				new Checkpoint(
				new Block(
					gameObject.x,
					gameObject.y,
					gameObject.width,
					gameObject.height
				)
				)
			);
		}
		}
	}
	if (msg.action == Messages.FLIP_GRAVITY) {
		if (this.dir == Direction.DOWN) {
		this.dir = Direction.UP;
		} else if (this.dir == Direction.UP) {
		this.dir = Direction.DOWN;
		}
	}
  }

  loadScene() {
	//console.log(this.mapData);
	let ch = this.scene.stage.children.length;
	this.scene.stage.removeChildren(0, ch);
	//CREATE PLAYER
	const player = BlockFactory.getInstance().createPlayer(
		this.mapData.spawnpoint
	);
	this.scene.stage.addChild(player);

	this.dir = this.mapData.dir;
	this.sendMessage(Messages.PLAYER_DIRECTION, this.dir);
	//add all obstacles
	this.mapData.blocks.forEach((blockPrefab) => {
		const newObj = BlockFactory.getInstance().createObstacle(blockPrefab);
		this.scene.stage.addChild(newObj);
	});
	//add buffs
	this.mapData.specialEffects.forEach((specialEffectPrefab) => {
		const newObj = BlockFactory.getInstance().createBuff(
		specialEffectPrefab.block
		);
		this.scene.stage.addChild(newObj);
	});
	//add checkpoints
	this.mapData.checkpoints.forEach((checkpointPrefab) => {
		const newCheck = BlockFactory.getInstance().createCheckPoint(
		checkpointPrefab.block
		);
		this.scene.stage.addChild(newCheck);
	});
  }
}
