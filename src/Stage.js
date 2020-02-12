import * as THREE from 'three';

class Stage {
    constructor(
        width,
        height,
        canvas,
        axesHelper = false, // 辅助线
        cameraNear, // 相机近截面
        cameraFar, // 相机远截面
        cameraInitalPosition, // 相机初始位置
        lightInitalPosition // 光源初始位置
    ) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.axesHelper = axesHelper;
        // 正交相机配置
        this.cameraNear = cameraNear;
        this.cameraFar = cameraFar;
        this.cameraInitalPosition = cameraInitalPosition;
        this.lightInitalPosition = lightInitalPosition;

        this.scene = null;
        this.plane = null;
        this.light = null;
        this.camera = null;
        this.renderer = null;

        this.init();
    }

    init() {
        this.createScene();
        this.createPlane();
        this.createLight();
        this.createCamera();
        this.createRenterer();
        this.render();
        this.bindResizeEvent();
    }

    bindResizeEvent() {
        const { container, renderer } = this;
        window.addEventListener('resize', () => {
            const { offsetWidth, offsetHeight } = container;

            this.width = offsetWidth;
            this.height = offsetHeight;

            renderer.setSize(offsetWidth, offsetHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            this.render();
        });
    }

    // 场景
    createScene() {
        const scene = (this.scene = new THREE.Scene());

        if (this.axesHelper) {
            scene.add(new THREE.AxesHelper(10e3));
        }
    }

    createPlane() {
        const { scene } = this;
        const geometry = new THREE.PlaneBufferGeometry(10e2, 10e2, 1, 1);
        const meterial = new THREE.ShadowMaterial();
        meterial.opacity = 0.5;

        const plane = (this.plane = new THREE.Mesh(geometry, meterial));
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.y = -0.1;
        // 接收阴影
        plane.receiveShadow = true;
        scene.add(plane);
    }

    // 光
    createLight() {
        const {
            scene,
            lightInitalPosition: { x, y, z },
            height
        } = this;
        const light = (this.light = new THREE.DirectionalLight(0xffffff, 0.8));

        light.position.set(x, y, z);
        // 开启阴影投射
        light.castShadow = true;
        // // 定义可见域的投射阴影
        light.shadow.camera.left = -height;
        light.shadow.camera.right = height;
        light.shadow.camera.top = height;
        light.shadow.camera.bottom = -height;
        light.shadow.camera.near = 0;
        light.shadow.camera.far = 2000;
        // 定义阴影的分辨率
        light.shadow.mapSize.width = 1600;
        light.shadow.mapSize.height = 1600;

        // 环境光
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        scene.add(light);
    }

    add(...args) {
        return this.scene.add(...args);
    }

    remove(...args) {
        return this.scene.remove(...args);
    }
}
