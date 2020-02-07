<template>
    <div class="jump-world">
        <canvas id="jump-world-canvas"></canvas>
    </div>
</template>

<script>
    /* eslint-disable */
    import * as THREE from 'three';

    const { innerHeight, innerWidth } = window;

    export default {
        name: 'app',
        data() {
            return {
                controls: {
                    positionX: 0,
                    positionY: 0,
                    positionZ: 0
                }
            };
        },
        mounted() {
            this.init();
            // this.initDatGui();
        },
        methods: {
            init() {
                /*
                 * 场景
                 */
                const scene = (this.scene = new THREE.Scene());
                // 场景背景，用于调试
                scene.background = new THREE.Color(0xf5f5f5);
                // 坐标辅助线，在调试阶段非常好用
                scene.add(new THREE.AxesHelper(10e3));

                /*
                 * 摄像机
                 */
                const camera = (this.camera = new THREE.OrthographicCamera(
                    -innerWidth / 2,
                    innerWidth / 2,
                    innerHeight / 2,
                    -innerHeight / 2,
                    0.1,
                    1000
                ));
                camera.position.set(-100, 100, -100);
                // 看向场景中心点
                camera.lookAt(scene.position);
                scene.add(camera);

                /*
                 * 盒子
                 */
                const boxGeometry = new THREE.BoxBufferGeometry(100, 50, 100);
                const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x67c23a });
                const box = (this.box = new THREE.Mesh(boxGeometry, boxMaterial));
                // 让物体投射阴影
                box.castShadow = true;
                scene.add(box);

                /*
                 * 平行光
                 */
                const light = new THREE.DirectionalLight(0xffffff, 0.8);
                light.position.set(-200, 600, 300);
                // 让平行光投射阴影
                light.castShadow = true;
                // 定义可见域的投射阴影
                light.shadow.camera.left = -400;
                light.shadow.camera.right = 400;
                light.shadow.camera.top = 400;
                light.shadow.camera.bottom = -400;
                light.shadow.camera.near = 0;
                light.shadow.camera.far = 1000;
                // 定义阴影的分辨率
                light.shadow.mapSize.width = 1600;
                light.shadow.mapSize.height = 1600;
                // 环境光
                scene.add(new THREE.AmbientLight(0xffffff, 0.4));
                scene.add(light);

                /*
                 * 地面
                 */
                const planeGeometry = new THREE.PlaneBufferGeometry(10e2, 10e2, 1, 1);
                const planeMaterial = new THREE.ShadowMaterial();
                // planeMaterial.opacity = 0.2;
                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.rotation.x = -0.5 * Math.PI;
                plane.position.y = -0.1;
                // 接收阴影
                plane.receiveShadow = true;
                scene.add(plane);

                /*
                 * 渲染器
                 */
                const canvas = document.querySelector('#jump-world-canvas');
                const renderer = new THREE.WebGLRenderer({
                    canvas,
                    alpha: true, // 透明场景
                    antialias: true // 抗锯齿
                });
                renderer.setSize(innerWidth, innerHeight);

                // 渲染
                renderer.render(scene, camera);

                // // 地面plane 接收阴影
                // const geometry = new THREE.PlaneBufferGeometry(3, 3, 1, 1);
                // const meterial = new THREE.MeshLambertMaterial({ color: 0x2194ce, side: THREE.DoubleSide, wireframe: false });
                // const plane = (this.plane = new THREE.Mesh(geometry, meterial));
                // plane.position.set(0, -1, 0);
                // plane.lookAt(0, 0, 0);
                // plane.receiveShadow = true;
                // scene.add(plane);

                // // 光源(平行光)
                // const light = new THREE.DirectionalLight(0xffffff, 0.8);
                // light.position.set(-10, 30, -20);
                // light.castShadow = true; // 投射阴影
                // scene.add(light);
            },
            // gui 调试器
            initDatGui() {
                this.gui = new dat.GUI();
                this.gui.add(this.controls, 'positionX', -5, 5).onChange(this.onDatGuiChange);
                this.gui.add(this.controls, 'positionY', -5, 5).onChange(this.onDatGuiChange);
                this.gui.add(this.controls, 'positionZ', -5, 5).onChange(this.onDatGuiChange);
            },
            animate() {
                requestAnimationFrame(this.animate);
                this.renderer.render(this.scene, this.camera);
            },
            // 调试器回调
            onDatGuiChange() {
                this.cube.position.set(this.controls.positionX, this.controls.positionY, this.controls.positionZ);
            }
        },
        components: {}
    };
</script>

<style></style>
