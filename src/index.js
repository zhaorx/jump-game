class JumpGameWorld {
    constructor({ container, canvas, needDefaultCreater = true, axesHelper = false }) {
        const { offsetWidth, offsetHeight } = container;
        this.container = container;
        this.canvas = canvas;
        this.needDefaultCreater = needDefaultCreater;
        this.axesHelper = axesHelper;
        this.width = offsetWidth;
        this.height = offsetHeight;

        const min = ~~(this.width / 6);
        const max = ~~(this.width / 3.5);
        this.propSizeRange = [min, max];
        this.propHeight = ~~(max / 2);
        
        this.stage = null
        this.propCreator = null

        this.init()
}
