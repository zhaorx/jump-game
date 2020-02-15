class Prop {
    constructor({
        world, // 所处世界
        stage, // 所处舞台
        body, // 主体
        height
    }) {
        this.world = world;
        this.stage = stage;
        this.body = body;
        this.height = height;
    }

    getPosition() {
        return this.body.position;
    }

    setPosition(x, y, z) {
        return this.body.position.set(x, y, z);
    }
}
