import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpawnManager')
export class SpawnManager extends Component {

    @property(Prefab) private arrowPrefab: Prefab = null;
    static get ArrowPrefab() {
        return this.instance.arrowPrefab;
    }

    @property(Node) private projectileParent: Node = null;
    static get ProjectileParent() {
        return this.instance.projectileParent;
    }
    private arrowPool: NodePool = new NodePool();

    private arrowCount: number = 5;

    private static instance: SpawnManager = null;

    onLoad() {
        SpawnManager.instance = this;
    }

    spawnArrows() {
        for (let i = 0; i < this.arrowCount; i++) {
            let node = instantiate(this.arrowPrefab);
            this.arrowPool.put(node);
        }
    }

    getArrow() {
        let node: Node = null;
        if (this.arrowPool.size() > 0) {
            node = this.arrowPool.get();
        } else {
            node = instantiate(this.arrowPrefab);
        }
        return node;
    }

    static GetArrow() {
        return SpawnManager.instance.getArrow();
    }

    static PutArrow(node: Node) {
        SpawnManager.instance.arrowPool.put(node);
    }

}

