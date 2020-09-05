<!--标准带选择游戏带编辑控件模板-->
<template>
  <div>
    <section class="content-header">
      <h1>标准带选择游戏带编辑控件模板</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <div class="box-header">
          <h3 class="box-title">标准带选择游戏带编辑控件模板</h3>
        </div>
        <div class="box-body">
          <!--选择游戏-->
          <div class="row">
            <div class="col-md-4">
              <game-select title="选择游戏"></game-select>
            </div>
          </div>
          <!--编辑控件-->
          <div class="row">
            <div class="col-md-4">
              <widget-c-u-d :addcallback="addFun" :modifycallback="modifyFun" :deletecallback="deleteFun"></widget-c-u-d>
            </div>
          </div>


        </div>
        <div class="box-footer">

        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import WidgetCUD from "../../widget/widgetCUD";
  import GameSelect from "../../widget/gameSelect";
  import bus from "../../../lib/eventBus";

  export default {
    name: "moregame",
    components: {GameSelect,WidgetCUD},
    methods:{
      addFun(){
        console.log("add");
      },
      modifyFun(){
        console.log("modify");
      },
      deleteFun(){
        console.log("delete");
      }
    },
    mounted:function() {
      //接收到选择游戏的消息
      bus.$on('game-select', function (msg) {
        console.log(msg);
      })
    }
  }
</script>

<style scoped>

</style>
