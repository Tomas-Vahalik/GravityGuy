import { Messages } from '../../constants/enums/messeges';
import { Map } from '../../base_elements/map';
import * as ECS from '../../../libs/pixi-ecs';
import { Maps } from '../../constants/enums/maps';
import { Block } from '../../base_elements/block';
import { Checkpoint } from '../../base_elements/checkpoint';
import { SpecialEffect } from '../../base_elements/special-effect';
import { Position } from '../../base_elements/position';

import BlockFactory from '../../block_factory/block-factory';
import DirectionManager from '../../direction-manager';
import ConvertorHelper from '../../helpers/convertorHelper';

import { Direction } from '../../constants/enums/direction';
import ScoreComp from '../../block_factory/text';
import { LOCALSTORAGE_SCORE, LOCALSTORAGE_NAME } from '../../constants/constants';

import PIXISound from 'pixi-sound';
import { Score } from '../../base_elements/score';


export class GameScene extends ECS.Component {
  mapData: Map;
  gameScene: Map;
  loader: PIXI.Loader;
  dir: DirectionManager;
  running: boolean = true;

  score: number;
  scoreComp: ScoreComp;
  soundPlaying = false;

  constructor(loader: PIXI.Loader) {
    super();
	this.loader = loader;
	this.dir = new DirectionManager();
  }

  playMusic() {
      PIXISound.play('soundtrack', {
          complete: function () {
              this.playMusic();
          }.bind(this)
      });
  }
  onInit() {
      PIXISound.stopAll();
      this.playMusic();
      
            
	this.subscribe(
		Messages.LOAD_CHECKPOINT,
		Messages.SAVE_CHECKPOINT,
        Messages.FLIP_GRAVITY,
        Messages.SPAWN_BLOCK,
        Messages.FREEZE,
        Messages.UNFREEZE
	);
	this.score = 500;

	this.scoreComp = BlockFactory.getInstance().createText(this.score.toString());
	this.scoreComp.position.set(700, 20);

	this.gameScene = new Map();
	this.loadMap(Maps.MAP_1, true);

	this.loadScene();
  }
  onUpdate(delta: number, absolute: number) {
      if (!this.running) return;
	this.score -= delta * 0.005;
	if (this.score < 0) {
		this.score = 0;
	} else {
		this.score = Math.round((this.score + Number.EPSILON) * 100) / 100;
	}
	this.scoreComp.text = this.score.toString();
  }

  sendPost() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
              this.sendMessage(Messages.END_GAME);
          }
      }.bind(this);
      xhr.open("POST", "https://gravity-guy.herokuapp.com/post/", true);
	  xhr.setRequestHeader('Content-type', 'application/json');
      let name = localStorage.getItem(LOCALSTORAGE_NAME);
      var s = new Score(name, this.score);
      //var body = name + ": " +this.score;
      var body = s;
      xhr.send(JSON.stringify(body));
  }
  onRemove(){
    this.scene.stage.removeChildren();
}
  onMessage(msg: ECS.Message) {
    if (msg.action == Messages.FREEZE) {
        this.running = false;
      }
    if (msg.action == Messages.UNFREEZE) {
        this.running = true;
    }
    if (msg.action == Messages.LOAD_CHECKPOINT) {        
        if (!this.soundPlaying) {
            this.soundPlaying = true;
            this.sendMessage(Messages.FREEZE);
            this.running = false;
            PIXISound.pause('soundtrack');
            PIXISound.play('gameOver', {
                complete: function () {
                    this.soundPlaying = false;
                    this.loadScene();
                    this.sendMessage(Messages.UNFREEZE);
                    this.running = true;
                    PIXISound.play('soundtrack');
                }.bind(this)
            });
        }
            
		//this.loadScene();
	}
	if (msg.action == Messages.SAVE_CHECKPOINT) {
        if (this.mapData.isFinalMap) {
            //Play "Victory" and then send post with score
            PIXISound.stopAll();
            this.sendMessage(Messages.FREEZE);
            this.running = false;
            PIXISound.play('victory', {
                volume: 0.75,
                complete: function () {                 
                    this.running = true;
                    this.sendMessage(Messages.UNFREEZE);                    
                    this.sendPost();
                }.bind(this)
            });
            
        } else {
            PIXISound.play('checkpoint', {volume:2});           
			//this.mapData = msg.data;
			this.gameScene = new Map();
			this.gameScene.dir = this.dir.getDirection();
			//var block: Block;
			for (let ch of this.scene.stage.children) {
				let gameObject: ECS.Container = <ECS.Container>ch;
				if (gameObject.tags) {
					switch (gameObject.tags.values().next().value) {
						case 'PLAYER':
							this.gameScene.spawnpoint = new Position(
								gameObject.x,
								gameObject.y
							);
							break;
						case 'OBJECT':
							this.gameScene.blocks.push(
								ConvertorHelper.convertGoToBlock(gameObject)
							);
							break;
						case 'BUFF':
							this.gameScene.specialEffects.push(
								new SpecialEffect(1, ConvertorHelper.convertGoToBlock(gameObject))
							);
							break;
						case 'SLOW':
							this.gameScene.specialEffects.push(
								new SpecialEffect(2, ConvertorHelper.convertGoToBlock(gameObject))
							);
						break;
					}
				}
			}
			this.loadMap(this.mapData.nextMap, false);
			this.loadScene();
		}
	}
	if (msg.action == Messages.FLIP_GRAVITY) {
		this.dir.swapDir();
    }
    if (msg.action == Messages.SPAWN_BLOCK) {
        var blockPrefab = new Block(200, 200, 50, 50);
        this.scene.stage.addChild(BlockFactory.getInstance().createObstacle(blockPrefab));
    }
  }

  loadMap(mapName: Maps, isFirstMap: boolean) {
	this.mapData = this.loader.resources[mapName].data as Map;
	// console.log(this.mapData.isFinalMap);

	let maxX = 0;
	if (this.gameScene.blocks.length > 0) {
		maxX = this.gameScene.blocks.reduce(
		(max, block) => (block.pos.x > max ? block.pos.x : max),
		this.gameScene.blocks[0].pos.x
		);
	}

	let blocks = this.mapData.blocks.map(
		(x) => new Block(x.pos.x, x.pos.y, x.width, x.height)
	);
	blocks.forEach((x) => {
		x.pos.x += maxX;
		this.gameScene.blocks.push(x);
	});
	let specialEffects = this.mapData.specialEffects.map(
		(x) =>
		new SpecialEffect(
			x.type,
			new Block(x.block.pos.x, x.block.pos.y, x.block.width, x.block.height)
		)
	);
	specialEffects.forEach((x) => {
		x.block.pos.x += maxX;
		this.gameScene.specialEffects.push(x);
	});
	let checkpoints = this.mapData.checkpoints.map(
		(x) =>
            new Checkpoint(new Position(x.pos.x, x.pos.y), x.direction)
	);
	checkpoints.forEach((x) => {
		x.pos.x += maxX;
		this.gameScene.checkpoints.push(x);
	});

	if (isFirstMap) {
		this.gameScene.spawnpoint = this.mapData.spawnpoint;
		this.gameScene.dir = this.mapData.dir;
	}
  }

  loadScene() {
	let ch = this.scene.stage.children.length;
	this.scene.stage.removeChildren(0, ch);
	//CREATE PLAYER
	const player = BlockFactory.getInstance().createPlayer(
		this.gameScene.spawnpoint,
		this.loader
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
		const newObj = BlockFactory.getInstance().createBuff(specialEffectPrefab);
		this.scene.stage.addChild(newObj);
	});
	//add checkpoints
	this.gameScene.checkpoints.forEach((checkpointPrefab) => {
        const newCheck = BlockFactory.getInstance().createCheckPoint(
            checkpointPrefab, this.mapData.isFinalMap, this.loader
		);
		this.scene.stage.addChild(newCheck);
	});
	this.scene.stage.addChild(this.scoreComp);
  }
}
