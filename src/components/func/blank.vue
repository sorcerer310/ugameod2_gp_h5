<template>
  <div>
    <h1>blank</h1>
    <widget-c-u-d :addcallback="addfun" :modifycallback="modifyfun" :deletecallback="deletefun"></widget-c-u-d>
  </div>
</template>

<script>
  import WidgetCUD from "../widget/widgetCUD";

  export default {
    name: "blank",
    components: {WidgetCUD},
    methods: {
      addfun() {
        console.log("add fun");
      },
      modifyfun(){
        console.log("modify fun");
      },
      deletefun(){
        console.log("delete fun");
      }
    }
  }
</script>

<style scoped>

</style>
