declare var require: any
import { PlayerBuff } from './player-buff';
import { Messages, Direction } from './playground';
import * as ECS from '../libs/pixi-ecs';
import { Map } from './base_elements/map'
import { Position } from './base_elements/position'
import { Block } from './base_elements/block';
import { SpecialEffect } from './base_elements/special-effect';
const fs = require('fs');    

export class Checkpoint extends ECS.Component {
        
    onInit() {
        this.subscribe(Messages.SAVE_CHECKPOINT);
        
    }
    saveFile(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    }

    onMessage(msg: ECS.Message) {
        //var position: Position;
        var map: Map = new Map();
        //var block: Block;
        for (var ch of this.scene.stage.children) {
            var bla: ECS.Container = <ECS.Container>ch;
            console.log();
            switch (bla.tags.values().next().value) {
                case 'PLAYER':
                    console.log("hovnokokot");
                    map.spawnpoint = new Position(bla.x, bla.y);
                break;
                case 'OBJECT':
                    map.blocks.push(new Block(bla.x, bla.y, bla.width, bla.height));    
                break;
                case 'BUFF':
                    map.specialEffects.push(new SpecialEffect(1, new Block(bla.x, bla.y, bla.width, bla.height)));
                break;

            }
            /*for (var t of bla.tags) {
                console.log(t);
            } */                
          
        }
        this.sendMessage(Messages.CHECKPOINT_REACHED, map);
        //console.log(JSON.stringify(map));
        /*fs.writeFile("../assets/save/newSave.json", JSON.stringify(map), function (err) {
            if (err) throw err;
            console.log('complete');
        });*/
        //this.saveFile(JSON.stringify(map), '../assets/save/newSave.json', 'application/json');
    }
    onUpdate(delta: number, absolute: number) {
    }
}
