<template>
  <div class="form-group">
    <button id="bt_add" type="button" @click="addFun" class="btn btn-success">
      <i class="fa fa-plus"></i>&nbsp;增加
    </button>
    <button id="bt_modify" type="button" @click="modifyFun" class="btn btn-primary">
      <i class="fa fa-edit"></i> 修改
    </button>
    <button id="bt_delete" type="button" @click="deleteFun" class="btn btn-danger">
      <i class="fa fa-remove"></i> 删除
    </button>
  </div>
</template>

<script>
  export default {
    name: "widgetCUD",
    props:{
      addcallback:{},
      modifycallback:{},
      deletecallback:{}
    },
    data(){
      return{

      }
    },
    methods:{
      addFun(){
        this.addcallback();
      },
      modifyFun(){
        this.modifycallback();
      },
      deleteFun(){
        this.deletecallback();
      }
    }
  }
</script>

<style scoped>

</style>
