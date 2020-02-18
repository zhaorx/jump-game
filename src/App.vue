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
    body {
        margin: 0;
    }

    .jump-world {
        margin: auto;
        width: 375px;
        height: 667px;
    }

    canvas {
        width: 375px;
        height: 667px;
    }
</style>
