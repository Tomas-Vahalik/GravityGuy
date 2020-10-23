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
    OBJECT_POSITION = 'OBJECT_POSITION',
    OBJECT_DESTROYED = 'OBJECT_DESTROYED',
    COLLISION = 'COLLISION',
    COLLISION_END = 'COLLISION_END',

    COLLISION_TOP = 'COLLISION_TOP',
    COLLISION_TOP_END = 'COLLISION_TOP_END',
    COLLISION_BOT = 'COLLISION_BOT',
    COLLISION_BOT_END = 'COLLISION_BOT_END',
    COLLISION_LEFT = 'COLLISION_LEFT',
    COLLISION_LEFT_END = 'COLLISION_LEFT_END',
    COLLISION_RIGHT = 'COLLISION_RIGHT',
    COLLISION_RIGHT_END = 'COLLISION_TOP_RIGHT',

    FREEZE = 'FREEZE',
    UNFREEZE = 'UNFREEZE',

    PLAYER_RESET = 'PLAYER_RESET',
    FLIP_GRAVITY = 'FLIP'
}
enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
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
    obj.addComponent(new GarbageRemoval(null));
    obj.addComponent(new ObstacleCollider(null));

    return obj;
};

class SceneManager extends ECS.Component {

    keyInput: ECS.KeyInputComponent;
    running = true;

    onInit() {
        this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
        //CREATE PLAYER
        const player = new ECS.Graphics();        
        const size = 40;
        player.beginFill(0xFFFFFF);        
        player.tint = 0xFF0000;
        player.drawRect(0, 0, size, size);
        player.name = 'PLAYER';
        player.addTag('PLAYER');        

        player.endFill();
        player.position.set(250, 250);        

        //player.addComponent(new ObstacleCollider(null));
        player.addComponent(new PlayerCollider(null));
        player.addComponent(new PlayerMovement(null));        
        this.scene.stage.addChild(player);

        //CREATE CEILING / FLOOR
        const ceiling = new ECS.Graphics();        
        ceiling.beginFill(0xFFFFFF);
        ceiling.drawRect(0, 0, this.scene.app.screen.width, 30);
        ceiling.endFill();
        ceiling.addComponent(new ObstacleCollider(null)); 
        this.scene.stage.addChild(ceiling);

        const floor = new ECS.Graphics();
        floor.beginFill(0xFFFFFF);
        floor.drawRect(0, 0, this.scene.app.screen.width, 30);
        floor.position.set(0, this.scene.app.screen.height - 30); 
        floor.endFill();
        floor.addComponent(new ObstacleCollider(null));
        this.scene.stage.addChild(floor);     

    }


    onUpdate(delta: number, absolute: number) {        
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_Q)) {
            this.keyInput.handleKey(ECS.Keys.KEY_Q);
            this.spawnObject();
        }
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_W)) {
            this.keyInput.handleKey(ECS.Keys.KEY_W);
            if (this.running) {
                this.sendMessage(Messages.FREEZE);
                this.running = false;
            }
            else {
                this.sendMessage(Messages.UNFREEZE);
                this.running = true;
            }
        }
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_R)) {
            this.keyInput.handleKey(ECS.Keys.KEY_R);
            this.sendMessage(Messages.PLAYER_RESET);
        }
        if (this.keyInput.isKeyPressed(ECS.Keys.KEY_SPACE)) {
            this.keyInput.handleKey(ECS.Keys.KEY_SPACE);
            this.sendMessage(Messages.FLIP_GRAVITY);
        }
        
    }

    spawnObject() {
        const newObj = objectEmitter(this.scene);
        this.scene.stage.addChild(newObj);
    }
    
}

class ObstacleCollider extends ECS.Component {
    inColision = false;
    onInit() {
        this.subscribe(Messages.OBJECT_POSITION);
    }
    onUpdate(delta: number, absolute: number) {
        var bounds = this.owner.getBounds();

        this.sendMessage(Messages.OBJECT_POSITION, bounds); 
    }
    onMessage(msg: ECS.Message) {
        
    }
    onRemove() {
        this.sendMessage(Messages.COLLISION_TOP_END); 
        this.sendMessage(Messages.COLLISION_BOT_END);
    }
}
class PlayerMovement extends ECS.Component {
    state = {        
        dir: Direction.DOWN,
        allowedUp: true,
        allowedDown: true,        
        running: true
    }
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        }
    }
    onInit() {        
        /*this.subscribe(Messages.COLLISION);
        this.subscribe(Messages.COLLISION_END); */

        this.subscribe(Messages.COLLISION_TOP);
        this.subscribe(Messages.COLLISION_TOP_END);
        this.subscribe(Messages.COLLISION_BOT);
        this.subscribe(Messages.COLLISION_BOT_END);
        this.subscribe(Messages.COLLISION_LEFT);
        this.subscribe(Messages.COLLISION_LEFT_END);
        this.subscribe(Messages.COLLISION_RIGHT);
        this.subscribe(Messages.COLLISION_RIGHT_END);

        this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);

        this.subscribe(Messages.FLIP_GRAVITY);
        this.subscribe(Messages.PLAYER_RESET);

    }
    onMessage(msg: ECS.Message) {
        /*if (msg.action === Messages.COLLISION) {
            
            this.modifyState({
                bouncing: false
            });
        }
        if (msg.action === Messages.COLLISION_END) {

            this.modifyState({
                bouncing: true
            });
        }*/
        //-------------------------------------------------------------
        if (msg.action === Messages.COLLISION_TOP) {
            this.owner.asGraphics().tint = 0x00FF00;
            this.modifyState({
                allowedUp: false
            });
        }
        if (msg.action === Messages.COLLISION_TOP_END) {
            this.owner.asGraphics().tint = 0xFF0000;
            this.modifyState({
                allowedUp: true
            });
        }
        if (msg.action === Messages.COLLISION_BOT) {
            this.owner.asGraphics().tint = 0x0000FF;
            this.modifyState({
                allowedDown: false
            });
        }
        if (msg.action === Messages.COLLISION_BOT_END) {
            this.owner.asGraphics().tint = 0xFF0000;
            this.modifyState({
                allowedDown: true
            });
        }
        if (msg.action === Messages.COLLISION_RIGHT) {
            this.owner.addComponent(new Shift(null));         
        }
        if (msg.action === Messages.COLLISION_RIGHT_END) {            
            var shift = this.owner.findComponentByName('Shift');
            if(shift) this.owner.removeComponent(shift);
        }
        //---------------------------------------------------------------------------
        if (msg.action === Messages.FREEZE) {
            this.modifyState({
                running: false
            });
        }
        if (msg.action === Messages.UNFREEZE) {
            this.modifyState({
                running: true
            });
        }
        if (msg.action === Messages.FLIP_GRAVITY) {
            var newDir: Direction;
            if (this.state.dir == Direction.DOWN) newDir = Direction.UP;
            if (this.state.dir == Direction.UP) newDir = Direction.DOWN;
            this.modifyState({
                dir: newDir
            });
        }
        if (msg.action === Messages.PLAYER_RESET) {            
            var shift = this.owner.findComponentByName('Shift');
            if (shift) this.owner.removeComponent(shift);
            this.owner.position.set(300, 250);            
            this.modifyState({
                allowedUp: true,
                allowedDown: true,
            });
        }
    }
    onUpdate(delta: number, absolute: number) {
        if (this.state.running == false) return;
        
            const dir = this.state.dir;
            const pos = this.owner.position;
            const scrWidth = this.scene.app.screen.width;
            const scrHeight = this.scene.app.screen.height;
            const boundRect = this.owner.getBounds();
            const diff = delta * 0.4;
            let newDir = dir;

            switch (dir) {
                case Direction.DOWN:
                    if(this.state.allowedDown) pos.y += diff;                    
                    break;
                case Direction.UP:
                    if (this.state.allowedUp) pos.y -= diff;                    
                    break;
            }            
    }
}
class PlayerCollider extends ECS.Component {
    state = {
        inCollisionWith: new Map(),
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
        this.subscribe(Messages.OBJECT_POSITION);        
        this.subscribe(Messages.OBJECT_DESTROYED);
        this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);
        
    }
    checkCollisionWith(bounds: PIXI.Rectangle, otherBounds: PIXI.Rectangle): boolean {
        if (bounds.x < otherBounds.x + otherBounds.width &&
            bounds.x + bounds.width > otherBounds.x &&
            bounds.y < otherBounds.y + otherBounds.height &&
            bounds.y + bounds.height > otherBounds.y) return true;
        else return false;
    }
    checkCollisionDirection(bounds: PIXI.Rectangle, otherBounds: PIXI.Rectangle): Direction {
        var b_collision = otherBounds.bottom - bounds.y;
        var t_collision = bounds.bottom - otherBounds.y;
        var l_collision = bounds.right - otherBounds.x;
        var r_collision = otherBounds.right - bounds.x;

        if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision) {
            //bottom collision
            console.log('bottom');
            //dir = 2;
            return Direction.DOWN;
        }
        if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision) {
            //top collision
            console.log('top');
            //dir = 1;
            return Direction.UP;
        }
        if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision) {
            //right collision
            console.log('right');
            //dir = 4;
            return Direction.RIGHT;
        }
        if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision) {
            //left collision
            console.log('left');
            //dir = 3;
            return Direction.LEFT;
        }
    }
    onMessage(msg: ECS.Message) {
        
        if (msg.action === Messages.FREEZE) {
            this.modifyState({
                running: false
            });
        }
        if (msg.action === Messages.UNFREEZE) {
            this.modifyState({
                running: true
            });
        }
        if (msg.action === Messages.OBJECT_POSITION) {
            var bounds = this.owner.getBounds();
            var otherBounds = msg.data;            
            var dir: Direction = Direction.DOWN;

            if (this.checkCollisionWith(bounds, otherBounds)) {
                // collision detected!   
                //get direction of collision
                dir = this.checkCollisionDirection(bounds, otherBounds);            
                //If not alredy in collision with this object
                if (!this.state.inCollisionWith.has(msg.gameObject)) {
                    //remember I am in cllision with this object
                    this.state.inCollisionWith.set(msg.gameObject, dir);                                        
                    msg.component.owner.asGraphics().tint = 0xFF0000;
                    //send message
                    switch (dir) {
                        case Direction.UP:
                            this.sendMessage(Messages.COLLISION_TOP);
                            break;
                        case Direction.DOWN:
                            this.sendMessage(Messages.COLLISION_BOT);
                            break;
                        case Direction.LEFT:
                            this.sendMessage(Messages.COLLISION_LEFT);
                            break;
                        case Direction.RIGHT:
                            this.sendMessage(Messages.COLLISION_RIGHT);
                            break;
                    }
                    this.sendMessage(Messages.COLLISION);
                    
                }
            }
            //check end of collision
            else {    
                //if i am with collision with this object
                if (this.state.inCollisionWith.has(msg.gameObject)) {                    
                    msg.component.owner.asGraphics().tint = 0xFFFFFF;
                    var dir = this.state.inCollisionWith.get(msg.gameObject);
                    this.state.inCollisionWith.delete(msg.gameObject);
                    //send message
                    switch (dir) {
                        case Direction.UP:
                            this.sendMessage(Messages.COLLISION_TOP_END);
                            break;
                        case Direction.DOWN:
                            this.sendMessage(Messages.COLLISION_BOT_END);
                            break;
                        case Direction.LEFT:
                            this.sendMessage(Messages.COLLISION_LEFT_END);
                            break;
                        case Direction.RIGHT:
                            this.sendMessage(Messages.COLLISION_RIGHT_END);
                            break;
                    }                  
                    
                }
            }
        }
        if (msg.action === Messages.OBJECT_DESTROYED) {
            ///check for end of collision
            if (this.state.inCollisionWith.has(msg.gameObject)) {
                msg.component.owner.asGraphics().tint = 0xFFFFFF;
                var dir = this.state.inCollisionWith.get(msg.gameObject);
                this.state.inCollisionWith.delete(msg.gameObject);
                //send message
                switch (dir) {
                    case Direction.UP:
                        this.sendMessage(Messages.COLLISION_TOP_END);
                        break;
                    case Direction.DOWN:
                        this.sendMessage(Messages.COLLISION_BOT_END);
                        break;
                    case Direction.LEFT:
                        this.sendMessage(Messages.COLLISION_LEFT_END);
                        break;
                    case Direction.RIGHT:
                        this.sendMessage(Messages.COLLISION_RIGHT_END);
                        break;
                }

            }
        }

    }
    onUpdate(delta: number, absolute: number) {
    }
    
}

class GarbageRemoval extends ECS.Component {
    onUpdate(delta: number, absolute: number) {        
        
        
        var bounds = this.owner.getBounds();
        if (bounds.left < 0) {
            this.sendMessage(Messages.OBJECT_DESTROYED);
            this.scene.stage.removeChild(this.owner);
        }

    }
}   

class Shift extends ECS.Component {
    
    state = {
        running: true
    }
    private modifyState(obj) {
        this.state = {
            ...this.state,
            ...obj
        }
    }
    onInit() {              
        this.subscribe(Messages.FREEZE);
        this.subscribe(Messages.UNFREEZE);
    }
    onMessage(msg: ECS.Message) {

        if (msg.action === Messages.FREEZE) {
            console.log('freeze');
            this.modifyState({
                running: false
            });
        }
        if (msg.action === Messages.UNFREEZE) {
            this.modifyState({
                running: true
            });
        }
    }
    onUpdate(delta: number, absolute: number) {
        if (this.state.running == false) return;
        
        var x = this.owner.position.x;
        var y = this.owner.position.y;
        this.owner.position.set(x - 0.5 * delta, y);
        var bounds = this.owner.getBounds();
        if (bounds.left < 0) {
            //this.scene.stage.removeChild(this.owner);             
            
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
        

        this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
        var SM = new SceneManager(null);
        this.engine.scene.addGlobalComponent(SM);
        this.engine.scene.addGlobalComponent(new ECS.FuncComponent('time spawner')
            .setFixedFrequency(3)
            .doOnFixedUpdate((cmp, delta, absolute) => {                
                const newObj = objectEmitter(this.engine.scene);
                this.engine.scene.stage.addChild(newObj);                
            }));
    }

    
}

export default new Playground();