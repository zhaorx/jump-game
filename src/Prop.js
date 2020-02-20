import { rangeNumberInclusive, getPropSize, animate } from './utils';
import TWEEN from '@tweenjs/tween.js';

class Prop {
    constructor({
        world, // 所处世界
        stage, // 所处舞台
        body, // 主体
        height,
        enterHeight,
        distanceRange,
        prev
    }) {
        this.world = world;
        this.stage = stage;
        this.body = body;
        this.height = height;
        this.enterHeight = enterHeight;
        this.distanceRange = distanceRange;
        this.prev = prev;

        // 下一个盒子的方向、距离
        this.nextDirection = '';
        this.nextDistance = 0;
    }

    getPosition() {
        return this.body.position;
    }

    setPosition(x, y, z) {
        return this.body.position.set(x, y, z);
    }

    scaleY(y) {
        return this.body.scale.setY(y);
    }

    // 获取道具大小
    getSize() {
        return getPropSize(this.body);
    }

    // 计算位置
    computeMyPosition() {
        const { world, prev, distanceRange, enterHeight } = this;
        const position = {
            x: 0,
            y: enterHeight, // 头2个盒子y值为0
            z: 0
        };

        if (!prev) {
            // 第1个盒子
            return position;
        }

        if (enterHeight === 0) {
            // 第2个盒子，固定一个距离
            position.z = world.width / 2;
            return position;
        }

        const { x, z } = prev.getPosition();
        // 随机2个方向 x or z(头2个盒子只在z方向上)
        let direction = Math.round(Math.random()) === 0;
        if (enterHeight === 0) {
            direction = false;
        }
        const { x: prevWidth, z: prevDepth } = prev.getSize();
        const { x: currentWidth, z: currentDepth } = this.getSize();
        // 根据区间随机一个距离
        const randomDistance = rangeNumberInclusive(...distanceRange);

        if (direction) {
            position.x = x + prevWidth / 2 + randomDistance + currentWidth / 2;
            position.z = z;
        } else {
            position.x = x;
            position.z = z + prevDepth / 2 + randomDistance + currentDepth / 2;
        }

        console.log('position', position);

        return position;
    }

    // 将道具放入舞台
    enterStage() {
        const { stage, body, height } = this;
        const { x, y, z } = this.computeMyPosition();

        body.castShadow = true;
        body.receiveShadow = true;
        body.position.set(x, y, z);
        // 需要将盒子向上移动自己一半高度,然后entranceTransition移动至0
        body.geometry.translate(0, height / 2, 0);

        stage.add(body);
        stage.render();

        this.entranceTransition();
    }

    // 盒子的入场动画
    entranceTransition(duration = 400) {
        const { body, enterHeight, stage, height } = this;

        if (enterHeight === 0) {
            return;
        }

        animate(
            {
                to: { y: 0 },
                from: { y: enterHeight },
                duration,
                easing: TWEEN.Easing.Bounce.Out
            },
            ({ y }) => {
                body.position.setY(y);
                stage.render();
            }
        );
    }

    // 销毁
    dispose() {
        const { body, stage } = this;

        body.geometry.dispose();
        body.material.dispose();
        stage.remove(body);
        // 解除对前一个的引用
        this.prev = null;
    }
}

export default Prop;
