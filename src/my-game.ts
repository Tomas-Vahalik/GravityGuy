import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import { Maps } from './constants/enums/maps';
import { Playground } from './playground';
import BlockFactory from './block_factory/block-factory';

// TODO rename your game

class MyGame {
  engine: ECS.Engine;

  constructor() {
	this.engine = new ECS.Engine();
	let canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

	// init the game loop
	this.engine.init(canvas, {
		resizeToScreen: true,
		width: 800,
		height: 600,
		resolution: 1,
		flagsSearchEnabled: false, // searching by flags feature
		statesSearchEnabled: false, // searching by states feature
		tagsSearchEnabled: true, // searching by tags feature
		namesSearchEnabled: true, // searching by names feature
		notifyAttributeChanges: false, // will send message if attributes change
		notifyStateChanges: false, // will send message if states change
		notifyFlagChanges: false, // will send message if flags change
		notifyTagChanges: false, // will send message if tags change
		debugEnabled: false, // debugging window
	});

	this.engine.app.loader
		.reset()
		.add(Maps.MAP_1, '../assets/maps/map_1.json')
		.add(Maps.MAP_2, '../assets/maps/map_2.json')
		.add(Maps.MAP_3, '../assets/maps/map_3.json')
		.add(Maps.MAP_4, '../assets/maps/map_4.json')
		.add(Maps.MAP_5, '../assets/maps/map_5.json')
		.add(Maps.MAP_6, '../assets/maps/map_6.json')
		.add(Maps.MAP_7, '../assets/maps/map_7.json')
		.add(Maps.MAP_8, '../assets/maps/map_8.json')
		.add('Save', '../assets/save/save1.json')
		.add('spritesheet', '../assets/graphics/runner.png')
		.add('background','../assets/graphics/background.png')
		.load(() => this.onAssetsLoaded());
  }
 

  onAssetsLoaded() {     

      this.engine.scene.stage.sortableChildren = true;        

	new BlockFactory();
	new Playground(this.engine);

	// init the scene and run your game
	/*let scene = this.engine.scene;
		new ECS.Builder(scene)
			.localPos(this.engine.app.screen.width / 2, this.engine.app.screen.height / 2)
			.anchor(0.5)
			.withParent(scene.stage)
			.withComponent(new ECS.FuncComponent('rotation').doOnUpdate((cmp, delta, absolute) => cmp.owner.rotation += 0.001 * delta))
			.asText('\u0047\u004F\u004F\u0044 \u004C\u0055\u0043\u004B\u0021', new PIXI.TextStyle({ fill: '#FF0000', fontSize: 80, fontFamily: 'Courier New' }))
			.build();*/
  }
}

// this will create a new instance as soon as this file is loaded
export default new MyGame();
