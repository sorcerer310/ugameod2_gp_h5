<template>
  <div>
    <section class="content-header">
      <h1>游戏参数值设置</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <div class="box-header">
          <h3 class="box-title">游戏参数值设置</h3>
        </div>
        <div class="box-body">
          <div class="row">
            <div class="col-md-4">
              <game-select title="选择游戏"></game-select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <!--<div class="form-group">-->
                <!--<button id="bt_add" type="button" @click="showAddModal" class="btn btn-success">-->
                  <!--<i class="fa fa-plus"></i>&nbsp;增加-->
                <!--</button>-->
                <!--<button id="bt_modify" type="button" @click="showModifyModal" class="btn btn-primary">-->
                  <!--<i class="fa fa-edit"></i> 修改-->
                <!--</button>-->
                <!--<button id="bt_delete" type="button" @click="deleteParamsColumn" class="btn btn-danger">-->
                  <!--<i class="fa fa-remove"></i> 删除-->
                <!--</button>-->
              <!--</div>-->
              <widget-c-u-d :addcallback="showAddModal" :modifycallback="showModifyModal" :deletecallback="deleteParamsColumn"></widget-c-u-d>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 table-responsive">
              <!--<table class="table table-striped text-nowrap" id="dt_paramsvalue"></table>-->
              <table class="table text-nowrap" id="dt_paramsvalue" ></table>
            </div>
          </div>

          <!--新建修改对话框-->
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                    aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" id="myModalLabel">增加参数字段</h4>
                </div>
                <form @submit.prevent="validateForm('form1')" data-vv-scope="form1">
                  <div class="modal-body">
                    <div class="form-group" >
                      <input type="hidden" id="id" v-model="id">
                      <label for="version">版本:</label>
                      <input type="text" class="form-control" id="version" placeholder="输入版本号" v-model="version">
                      <div id="modal_cols">
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="submit" class="btn btn-primary">保存数据</button>
                  </div>
                </form>
              </div>
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
  import bus from "../../../lib/eventBus"
  import GameSelect from "../../widget/gameSelect"
  import WidgetCUD from "../../widget/widgetCUD";

  export default {
    name: "paramsvalue",
    components: {WidgetCUD, GameSelect},
    data: function () {
      return {
        gameSelect: "",
        cols_paramskey: [],
        cols_paramstitle:[],
        ds_paramsvalue: [],
        dt:undefined,
        //以下几项数据用于新建、修改操作
        version:"",
        id:0,
        save_data_cols:[],

      }
    },
    methods: {
      /**
       * 获得动态列与值数据，生成表格
       */
      queryParamsValue: function () {
        var that = this;
        this.$http.get('/paramscolumn', {
          params: {
            gameappid: this.gameSelect.gameappid
          }
        }).then(result => {
          //获得列数据
          that.cols_paramskey = [];
          that.cols_paramstitle = [];
          //增加版本列
          that.cols_paramstitle.push({title:"选中"});
          that.cols_paramskey.push({title:"version"});
          that.cols_paramstitle.push({title:"版本"});
          $.each(result.data, function (i, field) {
            that.cols_paramskey.push({title: field.key});
            // that.cols_paramskey.push({data:field.key,title: field.name});
            that.cols_paramstitle.push({title:field.name});
          })
          that.cols_paramskey.push({title:"select"});


          //获得行数据
          that.$http.get('/paramsvalue', {
            params: {
              gameappid: that.gameSelect.gameappid
            }
          }).then(result_val => {
            that.ds_paramsvalue = [];
            $.each(result_val.data, function (i, field) {

              var rd = new Array();
              //行数据的列名动态变化，所有的列名在cols_paramsvalue对象中
              $.each(that.cols_paramskey, function (i_val, field_val) {
                //key为select时写入radio控件代码
                //todo:此处可修改为先为field_val设置radio选项，再push其他列的数据
                if(field_val.title==='select')
                  rd.unshift('<input type="radio" id="r_'+field.id+'" name="rg_datatable" value="'+field.id+'">');
                else
                  rd.push(field[field_val.title]);
              })
              that.ds_paramsvalue.push(rd);
            })

            //组织表数据
            if(that.dt!=undefined) {
              that.dt.destroy();
              $('#dt_paramsvalue').empty(); // 动态列
            }

            that.dt =$('#dt_paramsvalue').DataTable({
              "destroy": true,
              "autoWidth": false,
              "ordering": true,
              "searching": false,
              "pageing": false,
              "info": false,
              "lengthChange": false,
              "paginate": true,
              "pageLength": 12,
              "columns":that.cols_paramstitle,
              data: that.ds_paramsvalue
            });
          })
        })
      },
      /**
       * 显示增加数据模态框，动态显示字段数据
       */
      showAddModal:function(){
        if(this.gameSelect===''){
          alert("请先选择游戏，再增加参数数据");
          return;
        }

        var that = this;
        this.$http.get('/paramscolumn',{
          params:{
            gameappid:this.gameSelect.gameappid
          }
        }).then(result =>{
          that.id=0;
          var mc = $('#modal_cols');
          mc.empty();
          //获得数据列,并生成数据列数据
          $.each(result.data,function(i,field){
            mc.append('<label for="'+field.key+'">'+field.name+':</label>');
            mc.append('<input type="text" class="form-control" id="'+field.key+'" placeholder="输入'+field.name+'" >');
            //保存新建界面的key值
            that.save_data_cols.push(field.key);
          });
        })
        $('#myModal').modal('show');
      },
      /**
       * 保存新增数据
       */
      saveAddData:function(){
        //组合参数
        var params = {};
        params.gameappid = this.gameSelect.gameappid;
        params.version = $('#version').val();
        var pvalue = {};
        $.each(this.save_data_cols,function(i,field){
          pvalue[field] = $('#'+field).val();
        })
        params.value = JSON.stringify(pvalue);

        //将参数post到服务端
        this.$http.post("/paramsvalue",{
          params:params
        }).then(result=>{
          alert(result.msg);
          this.queryParamsValue();
          $('#myModal').modal('hide');
        });
      },
      /**
       * 显示修改数据模态框
       */
      showModifyModal:function(){
        if(this.gameSelect===''){
          alert("请先选择游戏，再修改参数数据");
          return;
        }
        var id = $("input[name='rg_datatable']:checked").val();
        if(id===undefined || id===0){
          alert('请先选中要修改的数据');
          return;
        }
        $('#myModal').modal('show');

        var that = this;
        this.id = id;
        //1:先获得所有的列
        this.$http.get('/paramscolumn',{
          params:{
            gameappid:this.gameSelect.gameappid
          }
        }).then(result=>{
          var mc = $('#modal_cols');
          mc.empty();
          //获得数据，生成数据列字段
          $.each(result.data,function(i,field){
            mc.append('<label for="'+field.key+'">'+field.name+':</label>');
            mc.append('<input type="text" class="form-control" id="'+field.key+'" placeholder="输入'+field.name+'" >');
            //保存修改界面的key值
            that.save_data_cols.push(field.key);
          });
          //最后加入version字段
          that.save_data_cols.push("version");
        });
        //2:获得所有列的值，并将值写入录入控件中
        this.$http.get('/paramsvalue/'+this.gameSelect.gameappid+'/'+id ,{
          params:{}
        }).then(result =>{
          var value = result.data[0];
          $.each(that.save_data_cols,function(i,field){
            if(field=='version')
              that.version  = value[field];
            $('#'+field).val(value[field]);
          });
        });
        // console.log("showModifyModal this.id:"+this.id);
      },
      /**
       * 提交修改选中的数据
       */
      saveModifyData:function(){
        // console.log("saveModifyData this.id:"+this.id);
        //组合参数
        var params = {};
        params.id = this.id;
        params.gameappid = this.gameSelect.gameappid;
        params.version = $('#version').val();
        var pvalue = {};
        $.each(this.save_data_cols,function(i,field){
          pvalue[field] = $('#'+field).val();
        });
        params.value=JSON.stringify(pvalue);

        //参数put到服务器
        this.$http.put("/paramsvalue",{
          params:params
        }).then(result=>{
          alert(result.msg);
          this.queryParamsValue();
          $('#myModal').modal('hide');
        });
      },

      /**
       * 保存数据，根据id是否为0判断是新增还是修改
       */
      saveGameParamsValueData:function(){
        if(this.id == 0)
          this.saveAddData();
        else
          this.saveModifyData();
      },
      /**
       * 删除当前参数值的数据
       */
      deleteParamsColumn:function(){
        var that = this;
        var id = $("input[name='rg_datatable']:checked").val();
        if(id===undefined || id===0){
          alert('请先选中要删除的数据');
          return;
        }

        $.confirm({
          title: '确认删除？',
          content: '确认要删除这条参数值数据？',
          type: 'greem',
          buttons: {
            ok: {
              text: '删除',
              btnClass: 'btn-danger',
              action: function () {
                that.$http.delete("/paramsvalue/" + id, {
                  params: {}
                }).then(result => {
                  that.queryParamsValue();
                  alert(result.msg);
                  $('#myModal').modal('hide');
                })
              }
            },
            cancel: {
              text: '取消',
              btnClass: 'btn-primary',
              action: function () {
                console.log('click cancel');
              }
            }
          }
        })

      },

      validateForm(scope){
        var that = this;
        this.$validator.validateAll(scope).then(result=>{
          if(result){
            if(this.gameSelect==='' || this.gameSelect===undefined){
              alert('请先选择游戏');
              return;
            }
            if(this.version===''){
              alert('请输入版本号');
              return;
            }

            that.saveGameParamsValueData();
          }
        });
      }


    },
    mounted: function () {
      var that = this;

      //接受到选择游戏的消息
      bus.$on('game-select', function (msg) {
        if(msg.gameSelect==="")
          return;
        that.gameSelect = msg.gameSelect;
        that.queryParamsValue();
      });
    }
  }
</script>

<style scoped>

</style>













































