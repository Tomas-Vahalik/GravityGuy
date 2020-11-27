import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';
import { GarbageRemoval } from '../components/garbage-removal';
import { Shift } from '../components/shift';
import { ObstacleCollider } from '../components/obstacle-collider';
import { SpecialEffect } from '../base_elements/special-effect';
import { Position } from '../base_elements/position';

export default class Score extends PIXI.Text {
  constructor() {
	let style = {
		font: 'bold italic 36px Arial',
		fill: '#F7EDCA',
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 440,
	};

	super('300', style);
  }
}
