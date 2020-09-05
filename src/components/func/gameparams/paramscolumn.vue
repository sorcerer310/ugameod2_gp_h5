<template>
  <div>
    <section class="content-header">
      <h1>游戏管理</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <div class="box-header">
          <h3 class="box-title">游戏参数字段管理</h3>
        </div>
        <div class="box-body">
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label>选择游戏</label>
                <select class="form-control" id="game" v-model="gameSelect">
                  <option value="-1" selected>选择游戏</option>
                  <option v-for="game in games" v-bind:value="game.value">{{game.text}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <button id="bt_add" type="button" @click="showAddModal" class="btn btn-success">
                  <i class="fa fa-plus"></i>&nbsp;增加
                </button>
                <button id="bt_modify" type="button" @click="showModifyModal" class="btn btn-primary">
                  <i class="fa fa-edit"></i> 修改
                </button>
                <button id="bt_delete" type="button" @click="deleteParamsColumn" class="btn btn-danger">
                  <i class="fa fa-remove"></i> 删除
                </button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped" id="dt_paramscolumn">
                <thead>
                <tr>
                  <th>id</th>
                  <th>参数名</th>
                  <th>参数key</th>
                  <th>参数描述</th>
                  <th>参数默认值</th>
                  <th>选中</th>
                </tr>
                </thead>
              </table>
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

                    <div class="form-group">
                      <input type="hidden" id="id" v-model="id">

                      <label for="name">参数名:</label>
                      <input type="text" class="form-control" id="name" placeholder="参数名" v-model="name">

                      <label for="key">参数key:</label>
                      <input type="text" class="form-control" id="key" placeholder="参数key" v-model="key">

                      <label for="memo">参数描述:</label>
                      <input type="text" class="form-control" rows="4" id="memo" placeholder="参数描述" v-model="memo">
                      <!--<input type="text" class="form-control" rows="5" id="sharecontent" placeholder="分享文本" v-model="sharecontent">-->

                      <label for="default">参数默认值:</label>
                      <input type="text" id="default" class="form-control" placeholder="参数默认值" v-model="defaultValue">

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
  export default {
    name: "paramscolumn",
    data: function () {
      return {
        games: [],
        gameSelect: "",
        ds_paramscolumn: [],
        id: 0,
        gameappid: "",
        name: "",
        key: "",
        memo: "",
        defaultValue: "",
        type: "",
        length: ""

      }
    },
    watch: {
      gameSelect: function (val, oldVal) {
        if (this.gameSelect === '-1') {
          alert('请先选择游戏');
          return;
        }
        this.queryParamsColumn();
      }
    },
    methods: {
      /**
       * 查询所有游戏
       */
      queryGame: function () {
        var that = this;

        var auth = window.sessionStorage.getItem('auth');
        var url = "/gamebyuserid";
        if (auth === '1') url = "/game";
        else if (auth === '2') url = "/gamebyuserid";

        this.$http.get(url, {})
          .then(result => {
            that.games = [];
            $.each(result.data, function (i, field) {
              that.$data.games.push({text: field.gamename, value: field});
            })
            that.$data.gameSelect = '';
          })
      },
      queryParamsColumn() {
        var that = this;
        this.$http.get('/paramscolumn', {
          params: {
            gameappid: this.gameSelect.gameappid
          }
        }).then(result => {
          that.ds_paramscolumn = [];
          $.each(result.data, function (i, field) {
            var rd = new Array();
            rd.push(field.id);
            // rd.push(field.gameappid);
            rd.push(field.name);
            rd.push(field.key);
            rd.push(field.memo);
            rd.push(field.defaultValue);
            // rd.push(field.type);
            // rd.push(field.length);

            rd.push('<input type="radio" id="r_' + field.id + '" name="rg_datatable" value="' + field.id + '">');
            that.ds_paramscolumn.push(rd);
          })

          $('#dt_paramscolumn').DataTable({
            "destroy": true,
            "autoWidth": false,
            "ordering": true,
            "searching": false,
            "pageing": false,
            "info": false,
            "lengthChange": false,
            "paginate": true,
            "pageLength": 12,
            data: that.ds_paramscolumn,
            columnDefs: [
              {
                "visible": false,
                "targets": 0
              }
            ]
          })
        })
      },
      /**
       * 保存参数字段数据
       */
      saveParamsColumn() {

        if (this.id == 0) {
          this.$http.post("/paramscolumn", {
            params: {
              gameappid: this.gameappid,
              name: this.name,
              key: this.key,
              memo: this.memo,
              defaultValue: this.defaultValue
            }
          }).then(result => {
            alert(result.msg);
            this.queryParamsColumn();
          })
        } else {
          this.$http.put("/paramscolumn", {
            params: {
              id: this.id,
              name: this.name,
              key: this.key,
              memo: this.memo,
              defaultValue: this.defaultValue
            }
          }).then(result => {
            alert(result.msg);
            this.queryParamsColumn();
          })
        }

        $('#myModal').modal('hide');
        this.clearModalData();

      },
      /**
       * 显示增加数据的模态框
       */
      showAddModal() {
        this.clearModalData();
        this.gameappid = this.gameSelect.gameappid;
        $('#myModal').modal('show');

      },
      /**
       * 显示修改数据的模态框
       */
      showModifyModal() {
        var id = $("input[name='rg_datatable']:checked").val();
        if (id === undefined) {
          alert('请先选中要修改的数据');
          return;
        }

        $('#myModal').modal('show');
        this.$http.get("/paramscolumn/" + id, {
          params: {}
        }).then(result => {
          var field = result.data[0];
          this.id = field.id;
          this.gameappid = field.gameappid;
          this.name = field.name;
          this.key = field.key;
          this.memo = field.memo;
          this.defaultValue = field.defaultValue;
        });
      },
      /**
       * 删除游戏参数字段
       */
      deleteParamsColumn() {
        var that = this;
        var id = $("input[name='rg_datatable']:checked").val();
        if (id === undefined) {
          alert('请选中要删除的数据')
          return;
        }

        $.confirm({
          title: '确认删除？',
          content: '确认要删除这条参数字段数据？',
          type: 'greem',
          buttons: {
            ok: {
              text: '删除',
              btnClass: 'btn-danger',
              action: function () {
                that.$http.delete("/paramscolumn/" + id, {
                  params: {}
                }).then(result => {
                  that.queryParamsColumn();
                  alert(result.msg);
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
      /**
       * 清理modal中的数据
       */
      clearModalData() {
        this.id = 0;
        this.gameappid = "";
        this.name = "";
        this.key = "";
        this.memo = "";
        this.defaultValue = "";
        this.type = "";
        this.length = "";
      },
      /**
       * 验证数据，通过后调用saveParamsColumn提交数据
       * @param scope
       */
      validateForm(scope) {
        var that = this;
        this.$validator.validateAll(scope).then(result => {
          if (result) {
            if(this.gameappid==='' || this.gameappid===undefined || this.gameSelect==='' || this.gameSelect===undefined){
              alert('请先选择游戏');
              return;
            }
            if (this.name === '') {
              alert("请输入字段名称");
              return;
            }
            if (this.key === '') {
              alert("请输入字段关键字");
              return;
            }
            if (this.memo === '') {
              alert("请输入字段描述");
              return;
            }
            if (this.defaultValue === '') {
              alert("请输入字段默认值");
              return;
            }
            that.saveParamsColumn();
          }
        });
      }
    },
    mounted: function () {
      this.queryGame();
    }
  }
</script>

<style scoped>

</style>
