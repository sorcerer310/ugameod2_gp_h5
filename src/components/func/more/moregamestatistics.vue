<template>
  <div>
    <section class="content-header">
      <h1>外链游戏数据统计</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <div class="box-header">
          <h3 class="box-title">外链游戏数据统计</h3>
        </div>
        <div class="box-body">
          <div class="row">
            <div class="col-md-4">
              <game-select title="选择游戏"></game-select>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label>日期</label>
                <div class="input-group date">
                  <div class="input-group-addon"><i class="fa fa-calendar"></i></div>
                  <input type="text" class="form-control pull-right" id="datepicker" v-model="date">
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <button class="btn btn-primary pull-right" @click="queryMoreGameStatistics">查询</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped" id="dt_moregamestatistics">
                <thead>
                <tr>
                  <th>游戏ID</th>
                  <th>目标ID</th>
                  <th>用户数量</th>
                  <th>日期</th>
                </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group" id="export">
              <button class="btn btn-primary pull-right" @click="exportExcel">导出excel</button>
              <a id="downlink"></a>
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
  import {ExportExcel} from "../../../lib/excelUtils";

  export default {
    name: "moregamestatistics",
    components:{GameSelect},
    data:function(){
      var d = new Date(new Date() - 86400000);
      var val = d.getFullYear() + "-" +(d.getMonth() < 9 ?"0":"") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();

      return {
        gameSelect:"",
        date:val,
        ds_moregamestatistics:[]
      }
    },
    methods:{
      /**
       * 查询统计数据
       */
      queryMoreGameStatistics(){
        var that= this;
        this.$http.get("moregamestatistics",{
          params:{
            gameappid:this.gameSelect,
            date:$('#datepicker').val()
          }
        }).then(result=>{
          that.ds_moregamestatistics = [];
          $.each(result.data,function(i,field){
            var rd = new Array();
            rd.push(field.gameappid);
            rd.push(field.objectappid);
            rd.push(field.usercount);
            that.ds_moregamestatistics.push(rd);
          });

          $('#dt_moregamestatistics').DataTable({
            "destroy":true,
            "autoWidth":false,
            "ordering":true,
            "searching":false,
            "Pageing":false,
            "info":false,
            "lengthChange":false,
            "paginate":true,
            "pageLength":12,
            data:that.ds_moregamestatistics
          });
        });
      },
      exportExcel: function () {
        var ee = new ExportExcel();
        ee.export($('#datepicker').val() + '留存数据', this.ds_moregamestatistics, document.getElementById('downlink'), $('#dt_keepdata'));
      }
    },
    mounted:function(){
      var that = this;

      //初始化日期组件
      $('#datepicker').datepicker({
        format:'yyyy-mm-dd',
        autoclose:true
      })
      //接收选择游戏组件的消息
      bus.$on('game-select', function (msg) {
        if(msg.gameSelect==="")
          return;
        that.gameSelect = msg.gameSelect;
        // that.queryParamsValue();
      });
    }
  }
</script>

<style scoped>

</style>
