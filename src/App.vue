<template>
    <div class="jump-world">
        <canvas id="jump-world-canvas"></canvas>
    </div>
</template>

<script>
    /* eslint-disable */
    import * as THREE from 'three';
    import { computeCameraPositon } from './common/utils';

    const { innerHeight, innerWidth } = window;
    const width = innerWidth / 4;
    const height = innerHeight / 4;

    // 维护一个道具生成器集合
    const boxCreators = [];
    // 共享立方体
    const baseBoxBufferGeometry = new THREE.BoxBufferGeometry();
    // 共享材质
    const baseMeshLambertMaterial = new THREE.MeshLambertMaterial();
    // 随机颜色
    const colors = [0x67c23a, 0xe6a23c, 0xf56c6c];
    // 盒子大小限制范围
    const boxSizeRange = [30, 60];

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
                // 将盒子创造起存入管理集合中
                boxCreators.push(defaultBoxCreator);

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
                const camera = (this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 1000));
                // 相机位置计算(固定视角高度前提下)
                const { x, y, z } = computeCameraPositon(35, 225, height, height, 0.1, 1000);
                camera.position.set(x, y, z);
                // camera.position.set(-100, 100, -100);

                // 看向场景中心点
                camera.lookAt(scene.position);
                scene.add(camera);

                /*
                 * 盒子
                 */
                const boxGeometry = new THREE.BoxBufferGeometry(100, 50, 100);
                const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x67c23a });
                const box = (this.box = new THREE.Mesh(boxGeometry, boxMaterial));
                // box.geometry.translate(0, 15, 0)
                box.translateY(15);
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
                // const planeMaterial = new THREE.ShadowMaterial();
                const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xf2eada });
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
                renderer.shadowMap.enabled = true;

                // 渲染
                renderer.render(scene, camera);
            },
            defaultBoxCreator() {
                const [minSize, maxSize] = boxSizeRange;
                const randomSize = ~~(random() * (maxSize - minSize + 1)) + minSize;
                const geometry = baseBoxBufferGeometry.clone();
                geometry.scale(randomSize, 30, randomSize);

                const randomColor = colors[~~(Math.random() * colors.length)];
                const material = baseMeshLambertMaterial.clone();
                material.setValues({ randomColor });

                return new THREE.Mesh(geometry, material);
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
