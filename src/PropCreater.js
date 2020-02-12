class PropCreater {
    constructor() {}

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
