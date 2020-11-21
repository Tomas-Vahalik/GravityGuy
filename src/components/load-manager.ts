import { Messages } from '../constants/enums/messeges';
import { Map } from '../base_elements/map';
import * as ECS from '../../libs/pixi-ecs';
import { Maps } from '../constants/enums/maps';
import { Block } from '../base_elements/block';
import { Checkpoint } from '../base_elements/checkpoint';
import { SpecialEffect } from '../base_elements/special-effect';
import { Position } from '../base_elements/position';

import BlockFactory from '../block_factory/block-factory';
import DirectionManager from '../direction-manager';
import ConvertorHelper from '../helpers/convertorHelper';

export class LoadManager extends ECS.Component {
  mapData: Map;
  gameScene: Map;
  loader: PIXI.Loader;
  dir: DirectionManager;

  constructor(loader: PIXI.Loader) {
	super();
	this.loader = loader;
	this.dir = new DirectionManager();
  }

  onInit() {
	this.subscribe(
		Messages.LOAD_CHECKPOINT,
		Messages.SAVE_CHECKPOINT,
		Messages.FLIP_GRAVITY
	);

	this.gameScene = new Map();
	this.loadMap(Maps.MAP_1, true);
	this.loadScene();
  }
  onMessage(msg: ECS.Message) {
	if (msg.action == Messages.LOAD_CHECKPOINT) {
		this.loadScene();
	}
	if (msg.action == Messages.SAVE_CHECKPOINT) {
		//this.mapData = msg.data;
		this.gameScene = new Map();
		this.gameScene.dir = this.dir.getDirection();
		//var block: Block;
		for (let ch of this.scene.stage.children) {
			let gameObject: ECS.Container = <ECS.Container>ch;
			switch (gameObject.tags.values().next().value) {
				case 'PLAYER':
				this.gameScene.spawnpoint = new Position(gameObject.x, gameObject.y);
				break;
				case 'OBJECT':
				this.gameScene.blocks.push(
					ConvertorHelper.convertGoToBlock(gameObject)
				);
				break;
				case 'BUFF':
				this.gameScene.specialEffects.push(
					new SpecialEffect(
					1,
					ConvertorHelper.convertGoToBlock(gameObject)
					)
				);
				break;
			}
		}
		this.loadMap(this.mapData.nextMap, false);
		this.loadScene();
	}
	if (msg.action == Messages.FLIP_GRAVITY) {
		this.dir.swapDir();
	}
  }

  loadMap(mapName: Maps, isFirstMap: boolean) {
	  console.log(mapName);
	this.mapData = this.loader.resources[mapName].data as Map;

	let maxX = 0;
	if (this.gameScene.blocks.length > 0)
	{
		maxX = this.gameScene.blocks.reduce(
			(max, block) => (block.pos.x > max ? block.pos.x : max),
			this.gameScene.blocks[0].pos.x
		);
	}

	this.mapData.blocks.forEach(x => {x.pos.x += maxX; this.gameScene.blocks.push(x)});
	this.mapData.specialEffects.forEach(x => {x.block.pos.x += maxX; this.gameScene.specialEffects.push(x)});
	this.mapData.checkpoints.forEach(x => {x.block.pos.x += maxX; this.gameScene.checkpoints.push(x)});

	if(isFirstMap) {
		this.gameScene.spawnpoint = this.mapData.spawnpoint;
		this.gameScene.dir = this.mapData.dir;
	}
	console.log(this.mapData.nextMap);
  }

  loadScene() {
	let ch = this.scene.stage.children.length;
	this.scene.stage.removeChildren(0, ch);
	//CREATE PLAYER
	const player = BlockFactory.getInstance().createPlayer(
		this.gameScene.spawnpoint
	);
	this.scene.stage.addChild(player);

	this.dir.setDireciton(this.gameScene.dir);
	this.sendMessage(Messages.PLAYER_DIRECTION, this.dir.getDirection());
	//add all obstacles
	this.gameScene.blocks.forEach((blockPrefab) => {
		const newObj = BlockFactory.getInstance().createObstacle(blockPrefab);
		this.scene.stage.addChild(newObj);
	});
	//add buffs
	this.gameScene.specialEffects.forEach((specialEffectPrefab) => {
		const newObj = BlockFactory.getInstance().createBuff(
		specialEffectPrefab.block
		);
		this.scene.stage.addChild(newObj);
	});
	//add checkpoints
	this.gameScene.checkpoints.forEach((checkpointPrefab) => {
		const newCheck = BlockFactory.getInstance().createCheckPoint(
		checkpointPrefab.block
		);
		this.scene.stage.addChild(newCheck);
	});
  }
}
