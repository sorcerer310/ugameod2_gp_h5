<template>
  <div>
    <component :is="currFunc"></component>
  </div>
</template>

<script>
  import bus from "../lib/eventBus";

  import blank from "./func/blank";
  import blank1 from "./func/blank1";
  import shareinfo from "./func/share/shareinfo"
  import game from "./func/game/game"
  import paramscolumn from "./func/gameparams/paramscolumn"
  import paramsvalue from "./func/gameparams/paramsvalue"
  import moregame from "./func/more/moregame"
  import moregamestatistics from "./func/more/moregamestatistics"
  import websocket from "./func/websocket/websocket"

  export default {
    name: "mainframe",
    data() {
      return {
        currFunc: ''
      }
    },
    components: {websocket,moregamestatistics,moregame,paramsvalue,paramscolumn,game,shareinfo,blank, blank1},
    mounted: function () {
      var that = this;
      //接收starter发来的switch-func消息
      bus.$on("switch-func", function (msg) {
        that.currFunc = msg;
      });
    }

  }
</script>

<style scoped>

</style>
