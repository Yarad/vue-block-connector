import Vue from 'vue'

//храним только id, возвращаем только DOM
export default {
    namespaced: true,
    state: {
        connections: [],
        currConnection: {} // {start:___, end___}
    },
    getters: {
        connections: state => state.connections.map((value) => {
            return {
                start: document.getElementById(value.start),
                end: document.getElementById(value.end)
            }
        }),
        currConnection: state => {
            return {
                start: document.getElementById(state.currConnection.start),
                end: document.getElementById(state.currConnection.end)
            }
        },
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
        },
        _destroyConnection(state, connectionObj) {
            let val;
            for (let i in state.connections) {
                val = state.connections[i];
                if ((val.start === connectionObj.start && val.end === connectionObj.end) ||
                    (val.end === connectionObj.start && val.start === connectionObj.end)) {
                    state.connections.splice(i);
                }
            }
        }
    }
}