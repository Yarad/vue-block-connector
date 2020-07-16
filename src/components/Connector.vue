<template>
    <div class="connector-wrapper"
         ref="currWrapper"
         @mousedown.prevent="handleOnMouseDown($event)"
         @mouseup.prevent="handleOnMouseUp($event)"
    >
        <template v-if="mouseIsPressed">
            <svg :width="makeConnectionLineParams.width"
                 :height="makeConnectionLineParams.height"
                 :style="{
                     'left': +makeConnectionLineParams.left + 'px',
                     'top': +makeConnectionLineParams.top + 'px',
                     'z-index': 30
                 }"
                 stroke-opacity="0.6"
                 xmlns="http://www.w3.org/2000/svg">

                <line :x1="makeConnectionLineParams.lineStart.x"
                      :y1="makeConnectionLineParams.lineStart.y"
                      :x2="makeConnectionLineParams.lineEnd.x"
                      :y2="makeConnectionLineParams.lineEnd.y"
                      stroke="#04859D"
                      stroke-width="3"
                />
            </svg>
        </template>
        <template v-for="(connection,key) in myConnections">
            <svg :width="allDrawingParams[key].width"
                 :height="allDrawingParams[key].height"
                 :style="{
                     'left': +allDrawingParams[key].left + 'px',
                     'top': +allDrawingParams[key].top + 'px',
                     'z-index': 30
                 }"
                 stroke-opacity="0.6"
                 xmlns="http://www.w3.org/2000/svg">

                <line :x1="allDrawingParams[key].lineStart.x"
                      :y1="allDrawingParams[key].lineStart.y"
                      :x2="allDrawingParams[key].lineEnd.x"
                      :y2="allDrawingParams[key].lineEnd.y"
                      stroke="#04859D"
                      stroke-width="3"
                />

                <circle :cx="allDrawingParams[key].lineStart.x"
                        :cy="allDrawingParams[key].lineStart.y"
                        r="5"
                        stroke="#206876"
                        stroke-width="4"
                        fill="white"
                />
                <circle :cx="allDrawingParams[key].lineEnd.x"
                        :cy="allDrawingParams[key].lineEnd.y"
                        r="5"
                        stroke="#206876"
                        stroke-width="4"
                        fill="white"
                />
            </svg>
        </template>
        <slot></slot>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "Connector",
        data() {
            return {
                mouseIsPressed: false,
                lastElement: {}, //при событии клика запоминаем место
                makeConnectionLineParams: {
                    lineStart: {},
                    lineEnd: {}
                } //параметры линии, отрисовываемой в процессе движения мышью
            }
        },
        methods: {
            ...mapMutations(['_currConnection', '_addConnection']),
            handleOnMouseMove(e) {
                this.makeConnectionLineParams = this.drawerParams({
                    start: this.lastElement,
                    end: {
                        getBoundingClientRect: () => {
                            return {
                                x: e.clientX,
                                y: e.clientY,
                                left: e.clientX,
                                top: e.clientY,
                                bottom: e.clientY + 2,
                                right: e.clientX + 2,
                                width: 2,
                                height: 2
                            }
                        }
                    }
                });
            },
            handleOnMouseDown(e) {

                this.lastElement = e.target.closest('.connector-wrapper');
                if (!this.lastElement) {
                    console.log('Cannot find element');
                    return;
                }

                this.mouseIsPressed = true;
                document.addEventListener('mousemove', this.handleOnMouseMove);
                document.addEventListener('mouseup', () => {
                    this.mouseIsPressed = false;
                    this.lastMouseCoords = {};
                    document.removeEventListener('mousemove', this.handleOnMouseMove);
                })

                this._currConnection({start: e.currentTarget, end: null})
                //console.log('start set => ');
                //console.log(e.currentTarget);
            },
            handleOnMouseUp(e) {
                if (!this.currConnection.start || this.currConnection.start === e.currentTarget) {
                    return;
                }

                let newConnection = {
                    start: this.currConnection.start,
                    end: e.currentTarget
                }

                this._currConnection({});
                this._addConnection(newConnection)
                //console.log('end set => ');
                //console.log(e.currentTarget);
            },
            drawerParams(connection) {
                console.log('called');
                let retObj = {};
                retObj.minX = Math.min(
                    connection.start.getBoundingClientRect().left,
                    connection.end.getBoundingClientRect().left,
                );

                retObj.minY = Math.min(
                    connection.start.getBoundingClientRect().top,
                    connection.end.getBoundingClientRect().top,
                )

                retObj.maxX = Math.max(
                    connection.start.getBoundingClientRect().right,
                    connection.end.getBoundingClientRect().right,
                )

                retObj.maxY = Math.max(
                    connection.start.getBoundingClientRect().bottom,
                    connection.end.getBoundingClientRect().bottom,
                )

                retObj.width = retObj.maxX - retObj.minX;
                retObj.height = retObj.maxY - retObj.minY;

                retObj.top = 0;
                if (connection.start.getBoundingClientRect().bottom > connection.end.getBoundingClientRect().bottom) {
                    retObj.top = connection.end.getBoundingClientRect().bottom - connection.start.getBoundingClientRect().bottom;
                }

                retObj.left = 0;
                if (connection.start.getBoundingClientRect().left > connection.end.getBoundingClientRect().left) {
                    retObj.left = connection.end.getBoundingClientRect().left - connection.start.getBoundingClientRect().left;
                }


                //>>> устанавливаем на верхний левый угол
                retObj.lineStart = {
                    x: 0 - retObj.left,
                    y: 0 - retObj.top
                }

                retObj.lineEnd = {
                    x: connection.end.getBoundingClientRect().left - retObj.minX,
                    y: connection.end.getBoundingClientRect().top - retObj.minY,
                }
                //<<<

                //0 - верх, 1 - право, 2 - низ, 3 - лево
                function getMiddlePoints(el) {
                    let arr = [];
                    arr.push({
                        x: el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2,
                        y: el.getBoundingClientRect().y
                    })
                    arr.push({
                        x: el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2,
                        y: el.getBoundingClientRect().y + el.getBoundingClientRect().height
                    })

                    arr.push({
                        x: el.getBoundingClientRect().x,
                        y: el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2
                    })

                    arr.push({
                        x: el.getBoundingClientRect().x + el.getBoundingClientRect().width,
                        y: el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2
                    })
                    return arr;
                }

                function distance(p1, p2) {
                    return Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
                }

                let arr1 = getMiddlePoints(connection.start);
                let arr2 = getMiddlePoints(connection.end);

                let minDistance = Infinity;
                let point1 = null;
                let point2 = null
                let t;
                for (let p1 of arr1) {
                    for (let p2 of arr2) {
                        t = distance(p1, p2);
                        if (t <= minDistance) {
                            minDistance = t;
                            point1 = p1;
                            point2 = p2;
                        }
                    }
                }
                point1.x -= retObj.minX;
                point2.x -= retObj.minX;
                point1.y -= retObj.minY;
                point2.y -= retObj.minY;

                retObj.lineStart = point1;
                retObj.lineEnd = point2;
                return retObj;
            }
        },
        computed: {
            ...mapGetters(['currConnection', 'connections']),
            myConnections() {
                //возвращает список соединений, где данный элемент является стартовым

                let retArr = [];
                for (let elem of this.connections) {
                    if (elem.start === this.$refs.currWrapper) {
                        retArr.push(elem)
                    }
                }
                return retArr;
            },
            allDrawingParams() {
                let retArr = [];

                for (let key in this.myConnections) {
                    retArr[key] = this.drawerParams(this.myConnections[key])
                }

                return retArr;
            }
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    .connector-wrapper {
        position: relative;
        margin: 8px;
        transition: 0.3s;
        display: inline-block;

        & > * {
            transition: box-shadow 0.2s;
        }

        &:hover {
            box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.3);
        }

        svg {
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
        }
    }
</style>