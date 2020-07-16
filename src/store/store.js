import Vue from 'vue';
import Vuex from "vuex";
import connections from "./modules/connections";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        connections: connections
    }
});