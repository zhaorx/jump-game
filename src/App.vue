<template>
    <div class="jump-world">
        <canvas id="jump-world-canvas"></canvas>
    </div>
</template>

<script>
    /* eslint-disable */
    import JumpGameWorld from './index';

    export default {
        name: 'app',
        data() {
            return {};
        },
        mounted() {
            const game = new JumpGameWorld({
                container: document.querySelector('.jump-world'),
                canvas: document.querySelector('#jump-world-canvas'),
                axesHelper: true
            });
        },
        methods: {},
        components: {}
    };
</script>

<style>
    .jump-world {
        width: 2000px;
        height: 1600px;
    }

    canvas {
        width: 2000px;
        height: 1600px;
    }
</style>
