import Vue from 'vue'

export default {
    state: {
        connections: [],
        currConnection: {} // {start:___, end___}
    },
    getters: {
        connections: state => state.connections,
        currConnection: state => state.currConnection,
    },
    mutations: {
        _connections(state, connections) {
            Vue.set(state, 'connections', connections);
        },
        _currConnection(state, obj) {
            Vue.set(state, 'currConnection', obj);
        },
        _addConnection(state, connectionObj) {
            let found = false;
            for (let val of state.connections) {
                if ((val.start === connectionObj.start && val.end === connectionObj.end) ||
                    (val.end === connectionObj.start && val.start === connectionObj.end)) {
                    found = true;
                    break;
                }
            }
            if (found) {
                console.log('already added');
            } else {
                state.connections.push(connectionObj)
            }
        }
    }
}