import { baseMeshLambertMaterial, baseBoxBufferGeometry, randomArrayElm } from './utils';
import { actives, statics } from './defaultProp';
import * as THREE from 'three';

class PropCreater {
    constructor({ propHeight, propSizeRange, needDefaultCreator }) {
        this.propHeight = propHeight;
        this.propSizeRange = propSizeRange;

        // 维护的创造器
        this.propCreators = [];

        if (needDefaultCreator) {
            this.createPropCreator(actives, false);
            this.createPropCreator(statics, true);
        }
    }

    createProp(index) {
        const { propCreators } = this;
        return index > -1
            ? (propCreators[index] && propCreators[index]()) || randomArrayElm(propCreators)()
            : randomArrayElm(propCreators)();
    }

    /**
     * 新增定制化的生成器
     * @param {Function} creator 生成器函数
     * @param {Boolean} isStatic 是否是动态创建
     */
    createPropCreator(creator, isStatic) {
        if (Array.isArray(creator)) {
            creator.forEach(crt => this.createPropCreator(crt, isStatic));
        }

        const { propCreators, propSizeRange, propHeight } = this;

        if (propCreators.indexOf(creator) > -1) {
            return;
        }

        const wrappedCreator = function() {
            if (isStatic && wrappedCreator.box) {
                // 静态盒子，下次直接clone
                return wrappedCreator.box.clone();
            } else {
                const box = creator(THREE, {
                    propSizeRange,
                    propHeight,
                    baseMeshLambertMaterial,
                    baseBoxBufferGeometry
                });

                if (isStatic) {
                    // 被告知是静态盒子，缓存起来
                    wrappedCreator.box = box;
                }
                return box;
            }
        };

        propCreators.push(wrappedCreator);
    }
}

export default PropCreater;
