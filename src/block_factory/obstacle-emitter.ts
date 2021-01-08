import * as ECS from '../../libs/pixi-ecs';
import { Block } from '../base_elements/block';
import { GarbageRemoval } from '../components/garbage-removal';
import { Shift } from '../components/shift';



export default class ObstacleEmitter extends ECS.Graphics {
    dragging = false;
    data = null;
    reposition = true;
    constructor(blockPrefab: Block) {
        
        super();
        this.interactive = true;
        
        //tmp
        /*this.on('mousedown', this.onDragStart);
        this.on('mousemove', this.onDragMove)
        this.on('mouseup', this.onDragEnd);*/
        //end tmp

	    this.beginFill(0xffffff);
	    this.drawRect(0, 0, blockPrefab.width, blockPrefab.height);

	    this.endFill();
	    this.position.set(blockPrefab.pos.x, blockPrefab.pos.y);

        this.addTag('OBJECT');
        this.addTag('COLLIDABLE');
	    this.addComponent(new Shift(null));
	    this.addComponent(new GarbageRemoval(null));
	    
    }
    /*onDragStart(event): void{        
        this.dragging = true;
        this.data = event.data;
        console.log(event.data);
        
    }
    onDragEnd(event): void {
           
        this.dragging = false;
        this.data = null;
        this.reposition = !this.reposition;
    }
    onDragMove(event): void {
        if (this.dragging && this.reposition) {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x -1;
            this.position.y = newPosition.y - 1;
        }
        if (this.dragging && !this.reposition) {
            var newPosition = this.data.getLocalPosition(this.parent);
            var difX = newPosition.x - this.position.x;
            var difY = newPosition.y - this.position.y;
            this.width = difX + 1;
            this.height = difY + 1;

        }
        
    }*/
}
