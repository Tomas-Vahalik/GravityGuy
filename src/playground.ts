import * as ECS from '../libs/pixi-ecs/';
import { KeyInputComponent } from '../libs/pixi-ecs/components/key-input-component';

class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x; this.y = y; this.width = w; this.height = h;
    }
}

enum Messages {
    MY_POSITION = 'MY_POSITION',
    COLLISION = 'COLLISION'
}
enum Direction {
    UP = 'UP',
    DOWN = 'DOWN'
}
const objectEmitter = (scene: ECS.Scene): ECS.Graphics => {
    const obj = new ECS.Graphics();
    const sizeX = Math.random() * 200;
    const sizeY = Math.random() * 200;

    const randomPosX = Math.random() * (scene.app.screen.width);
    const randomPosY = Math.random() * (scene.app.screen.height);
    var posX = scene.app.screen.width;

    obj.beginFill(0xFFFFFF);
    obj.drawRect(0, 0, sizeX, sizeY);
    
    obj.endFill();
    obj.position.set(posX, randomPosY);
    obj.addTag("OBJECT");
    obj.addComponent(new Shift(null));
    obj.addComponent(new Collider(null));

    return obj;
};
class SceneManager extends ECS.Component {

    keyInput: ECS.KeyInputComponent;
    

    onInit() {
        this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
        const player = new ECS.Graphics();        
        const size = 40;
        player.beginFill(0xFF0000);        
        player.drawRect(0, 0, size, size);
        player.name = 'PLAYER';
        player.addTag('PLAYER');        

        player.endFill();
        player.position.set(200, 250);        

        player.addComponent(new Collider(null));
        player.addComponent(new Bounce(null));
        this.scene.stage.addChild(player);
        
    }

    onUpdate() {
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_Q)) {
            this.keyInput.handleKey(ECS.Keys.KEY_Q);
            this.spawnObject();
        }                
        
    }

    spawnObject() {
        const newObj = objectEmitter(this.scene);
        this.scene.stage.addChild(newObj);
    }
    
}

class Collider extends ECS.Component {
    onInit() {
        this.subscribe(Messages.MY_POSITION);
    }
    onUpdate(delta: number, absolute: number) {
        var bounds = this.owner.getBounds();
        this.sendMessage(Messages.MY_POSITION, bounds, ['PLAYER']);                       
    }
    onMessage(msg: ECS.Message) {
        if (msg.action === Messages.MY_POSITION) {
            var bounds = this.owner.getBounds();
            var otherBounds = msg.data;
            if (bounds.x < otherBounds.x + otherBounds.width &&
                bounds.x + bounds.width > otherBounds.x &&
                bounds.y < otherBounds.y + otherBounds.height &&
                bounds.y + bounds.height > otherBounds.y) {
                // collision detected!
                this.owner.asGraphics().tint = 0xFF0000;
                //msg.data.collider.owner.asGraphics().tint = 0xFF0000;
                msg.component.owner.asGraphics().tint = 0xFF0000;
               // this.sendMessage(Messages.COLLISION);                       
            }
        }
    }
}
class Bounce extends ECS.Component {
    state = {
        dir: Direction.DOWN, 
        running: true
    }
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        }
    }
    onInit() {
        this.subscribe(Messages.COLLISION);
    }
    onMessage(msg: ECS.Message) {
        if (msg.action === Messages.COLLISION) {
            this.modifyState({
                running: false
            });
        }

    }
    onUpdate(delta: number, absolute: number) {
        if (!this.state.running) return;
        const dir = this.state.dir;
        const pos = this.owner.position;
        const scrWidth = this.scene.app.screen.width;
        const scrHeight = this.scene.app.screen.height;
        const boundRect = this.owner.getBounds();
        const diff = delta * 0.4;
        let newDir = dir;

        switch (dir) {           
            case Direction.DOWN:
                pos.y += diff;
                if (boundRect.bottom >= scrHeight) {
                    newDir = Direction.UP;
                }
                break;
            case Direction.UP:
                pos.y -= diff;
                if (boundRect.top <= 0) {
                    newDir = Direction.DOWN;
                }
                break;
        }
        if (dir !== newDir) {
            this.modifyState({
                dir: newDir
            });
        }
    }
}
class Shift extends ECS.Component {
    onInit() {

    }
    onUpdate(delta: number, absolute: number) {
        
        var x = this.owner.position.x;
        var y = this.owner.position.y;
        this.owner.position.set(x - 0.5 * delta, y);
        var bounds = this.owner.getBounds();
        if (bounds.left < 0) {
            this.scene.stage.removeChild(this.owner);
        }
        
    }
}

export class Playground{

    offsetY = 500;
    engine: ECS.Engine;
    blocks: Rect[] = [];
    loadBlock: number;
    constructor() {
        this.engine = new ECS.Engine();
        var canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.engine.init(canvas, {

        });
        
        /*this.blocks.push(new Rect(500, this.offsetY-50, 20, 50));
        this.blocks.push(new Rect(1000, this.offsetY - 200, 20, 200));
        this.blocks.push(new Rect(1500, this.offsetY - 70, 20, 70));
        this.blocks.push(new Rect(2000, this.offsetY - 100, 20, 100));
        this.loadBlock = 0;
        
        
        for (var b of this.blocks) {
            var blockGraphics = new ECS.Graphics();
            blockGraphics.beginFill(0xFFFFFF);
            blockGraphics.drawRect(b.x, b.y, b.width, b.height);            
            blockGraphics.addComponent(new Shift(null));            
            this.engine.scene.stage.addChild(blockGraphics);
        }        
        var ground = new ECS.Graphics();
        ground.beginFill(0xFFFFFF);
        ground.drawRect(0, this.offsetY, 1000, 50);
        this.engine.scene.stage.addChild(ground);*/

        this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
        this.engine.scene.addGlobalComponent(new SceneManager(null));
    }

    
}

export default new Playground();