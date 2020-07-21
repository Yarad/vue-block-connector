<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <div>
            <Connector id="c1" group-id="g1">
                <div class="my-block blue">g1</div>
            </Connector>

            <Connector id="c2" group-id="g1">
                <div class="my-block green">g1</div>
            </Connector>
        </div>
        <div>
            <Connector id="c3" group-id="g2">
                <div class="my-block blue">g2</div>
            </Connector>

            <Connector  id="c4" group-id="g2">
                <div class="my-block green">g2</div>
            </Connector>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Connector from "./components/Connector";

    export default {
        name: 'App',
        components: {
            Connector
        },
        computed: {
            ...mapGetters('connections', ['connections'])
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .my-block {
        width: 80px;
        height: 40px;
    }

    .my-block.green {
        background: #558049;
    }

    .my-block.blue {
        background: #427cba;
    }
</style>
