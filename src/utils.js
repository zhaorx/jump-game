 /* eslint-disable */
import * as THREE from 'three';

const { random, sqrt, floor, pow, sin, cos, tan, PI } = Math

export let propCounter = 0;
export const incrementPropCounter = () => propCounter++;
export const resetPropCounter = () => (propCounter = 0);

export const colors = [0x67c23a, 0xe6a23c, 0xf56c6c, 0x909399, 0x409eff, 0xffffff];

// 材质
export const baseMeshLambertMaterial = new THREE.MeshLambertMaterial();
// 立方体
export const baseBoxBufferGeometry = new THREE.BoxBufferGeometry();

/**
 * 根据角度计算相机初始位置
 * @param {Number} verticalDeg 相机和场景中心点的垂直角度
 * @param {Number} horizontalDeg 相机和x轴的水平角度
 * @param {Number} top 相机上侧面
 * @param {Number} bottom 相机下侧面
 * @param {Number} near 摄像机视锥体近端面
 * @param {Number} far 摄像机视锥体远端面
 */
export function computeCameraInitalPosition(verticalDeg, horizontalDeg, top, bottom, near, far) {
    const verticalRadian = verticalDeg * (Math.PI / 180);
    const horizontalRadian = horizontalDeg * (Math.PI / 180);

    const minY = Math.cos(verticalRadian) * bottom;
    const maxY = Math.sin(verticalRadian) * (far - near - top / Math.tan(verticalRadian));
    console.log(minY, maxY);

    if (minY > maxY) {
        console.warn('警告: 垂直角度太小了!');
    }

    // 取一个中间值靠谱
    const y = minY + (maxY - minY) / 2;

    const longEdge = y / Math.tan(verticalRadian);
    const x = Math.sin(horizontalRadian) * longEdge;
    const z = Math.cos(horizontalRadian) * longEdge;

    return { x, y, z };
}

export const randomArrayElm = array => array[floor(random() * array.length)];

export const rangeNumberInclusive = (min, max) => floor(random() * (max - min + 1)) + min;

export const getPropSize = box => {
    const box3 = getPropSize.box3 || (getPropSize.box3 = new THREE.Box3());
    box3.setFromObject(box);
    return box3.getSize(new THREE.Vector3());
};
