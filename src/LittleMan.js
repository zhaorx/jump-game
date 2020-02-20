import * as THREE from 'three';
import { baseMeshLambertMaterial } from './utils';

class LittleMan {
    constructor({ world, color }) {
        this.world = world;
        this.color = color;

        this.stage = null;
        this.createBody()
    }

    // 创建身体
    createBody() {
        const {
            color,
            world: { width }
        } = this;
        const material = baseMeshLambertMaterial.clone();
        material.setValues({ color });

        // 头部
        const headSize = (this.headSize = width * 0.03);
        const headTranslateY = (this.headTranslateY = headSize * 4.5); // 向上隔空部分
        const headGeometry = new THREE.SphereGeometry(headSize, 40, 40);
        const headSegment = (this.headSegment = new THREE.Mesh(headGeometry, material));
        headSegment.castShadow = true;
        headSegment.translateY(headTranslateY);

        // 身体
        this.width = headSize * 1.2 * 2;
        this.bodySize = headSize * 4;
        const bodyBottomGeometry = new THREE.CylinderBufferGeometry(headSize * 0.9, headSize * 1.4, headSize * 2.5, 40);
        bodyBottomGeometry.translate(0, headSize * 1.25, 0);
        const bodyCenterGeometry = new THREE.CylinderBufferGeometry(headSize, headSize * 0.9, headSize, 40);
        bodyCenterGeometry.translate(0, headSize * 3, 0);
        const bodyTopGeometry = new THREE.SphereGeometry(headSize, 40, 40);
        bodyTopGeometry.translate(0, headSize * 3.5, 0);
        // 合并body
        const bodyGeometry = new THREE.Geometry();
        bodyGeometry.merge(bodyTopGeometry);
        bodyGeometry.merge(new THREE.Geometry().fromBufferGeometry(bodyCenterGeometry));
        bodyGeometry.merge(new THREE.Geometry().fromBufferGeometry(bodyBottomGeometry));

        // 缩放控制
        const translateY = (this.bodyTranslateY = headSize * 1.5);
        const bodyScaleSegment = (this.bodyScaleSegment = new THREE.Mesh(bodyGeometry, material));
        bodyScaleSegment.castShadow = true;
        bodyScaleSegment.translateY(-translateY);

        // 旋转控制
        const bodyRotateSegment = (this.bodyRotateSegment = new THREE.Group());
        bodyRotateSegment.add(headSegment);
        bodyRotateSegment.add(bodyScaleSegment);
        bodyRotateSegment.translateY(translateY);

        // 整体身高 = 头部位移 + 头部高度 / 2 = headSize * 5
        const body = (this.body = new THREE.Group());
        body.add(bodyRotateSegment);
    }

    // 进入舞台
    enterStage(stage, { x, y, z }) {
        const { body } = this;

        body.position.set(x, y, z);

        this.stage = stage;
        stage.add(body);
        stage.render();
    }

    // 跳跃
    jump() {}
}

export default LittleMan;
