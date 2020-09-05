<!--外链游戏管理-->
<template>
  <div>
    <section class="content-header">
      <h1>外链游戏管理</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <div class="box-header">
          <h3 class="box-title">外链游戏管理</h3>
        </div>
        <div class="box-body">
          <!--选择游戏,与modal中的选择游戏共用一个数据源-->
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label>选择游戏</label>
                <select class="form-control" id="game" v-model="gameSelect">
                  <option value="" selected>选择游戏</option>
                  <option v-for="game in games" v-bind:value="game.value">{{game.text}}</option>
                </select>
              </div>
            </div>
          </div>
          <!--编辑控件-->
          <div class="row">
            <div class="col-md-4">
              <widget-c-u-d :addcallback="addFun" :modifycallback="modifyFun"
                            :deletecallback="deleteFun"></widget-c-u-d>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped" id="dt_moregame">
                <thead>
                <tr>
                  <th>图片</th>
                  <th>游戏标题</th>
                  <th>跳转APPID</th>
                  <th>所在位置</th>
                  <th>跳转路径</th>
                  <th>选中</th>
                </tr>
                </thead>
              </table>
            </div>
          </div>

          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                    aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" id="myModalLabel">新增外链游戏信息</h4>
                </div>

                <div class="modal-body">
                  <form @submit.prevent="validateForm('form1')" data-vv-scope="form1">
                    <div class="form-group">
                      <input type="hidden" id="id" v-model="id">

                      <label for="gameappid">游戏ID:</label>
                      <select class="form-control" id="gameappid" v-model="gameappid">
                        <option value="" selected>请选择游戏</option>
                        <!--<option v-for="game in games" v-bind:value="game.value.gameappid">{{game.value.gameappid}}</option>-->
                        <option v-for="game in games" v-bind:value="game.value.gameappid">{{game.text}}</option>
                      </select>

                      <label for="uploadfile">图片:</label>
                      <div class="row">
                        <div class="col-md-3">
                          <img id="imgurl" :src="iconurl" width="100" height="100"
                               onerror="this.style.display='none'">
                        </div>
                        <div class="col-md-8">
                          <input id="uploadfile" name="uploadfile" type="file" class="file"
                                 data-preview-file-type="text">
                        </div>
                      </div>

                      <label for="title">游戏标题:</label>
                      <input type="text" class="form-control" id="title" placeholder="请输入游戏标题" v-model="title">

                      <label for="jumpappid">跳转APPID:</label>
                      <input type="text" class="form-control" id="jumpappid" placeholder="请输入跳转APPID"
                             v-model="jumpappid">

                      <label for="position">所在位置</label>
                      <input type="number" class="form-control" id="position" placeholder="请输入位置信息" v-model="position">

                      <label for="path">跳转路径</label>
                      <input type="text" class="form-control" id="path" placeholder="请输入跳转路径" v-model="path">
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
  import {global_upfilehost, global_upfileurl} from '../../../lib/utils';

  export default {
    name: "moregame",
    components: {GameSelect, WidgetCUD},
    data() {
      return {
        games: [],
        gameSelect: "",

        ds_moregame: [],
        modaltype: "add",

        id: 0,
        gameappid: "",
        iconurl: "",
        title: "",
        jumpappid: "",
        position: 0,
        path: ""
      }
    },
    watch: {
      gameSelect: function (val, oldVal) {
        this.queryMoreGame();
      }
    },
    methods: {
      /**
       * 查询所有游戏数据
       */
      queryGame() {
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
      /**
       * 查询跳转游戏信息
       */
      queryMoreGame() {
        var that = this;
        this.$http.get('/moregame', {
          params: {
            gameappid: this.gameSelect.gameappid
          }
        }).then(result => {
          that.ds_moregame = [];
          $.each(result.data, function (i, field) {
            var rd = new Array();
            rd.push('<img src="' + field.iconurl + '" height="80" width="80" onerror="this.style.display=\'none\'" />');
            rd.push(field.title);
            rd.push(field.jumpappid);
            rd.push(field.position);
            rd.push(field.path);

            rd.push('<input type="radio" id="r_' + field.id + '" name="rg_datatable" value="' + field.id + '">');
            that.ds_moregame.push(rd);
          });

          $('#dt_moregame').DataTable({
            "destroy": true,
            "autoWidth": false,
            "ordering": true,
            "searching": false,
            "pageing": false,
            "info": false,
            "lengthChange": false,
            "paginate": true,
            "pageLength": 12,
            data: that.ds_moregame,
          });
        });
      },
      /**
       * 初始化文件上传控件
       * @param allowedFileExtensions
       * @param onFileUploaded
       */
      initFileInputConfig: function (allowedFileExtensions, onFileUploaded) {
        var that = this;
        $('#uploadfile').fileinput('destroy').fileinput({
          theme: 'fa',
          language: 'zh',
          // uploadUrl: 'http://liudian.info:8090/img-server/upload',
          uploadUrl: global_upfileurl,
          showUpload: true,
          showRemove: false,
          showCaption: false,
          dropZoneEnabled: false,
          resizeImage: true,
          allowedFileExtensions: ['png', 'jpg', 'jpeg'],
          maxFileCount: 1,
          elErrorContainer: '#kartik-file-errors',
          enctype: 'multipart/form-data',
          maxFileSize: 10000000000000
        }).off("fileuploaded").on("fileuploaded", function (event, data, previewId, index) {
          console.log(global_upfilehost + data.response.rename);
          //上传成功后设置预览图为刚刚上传的图片
          that.iconurl = global_upfilehost + data.response.rename;
        })
      },
      /**
       * 保存跳转游戏数据，包括新建和修改两种操作
       */
      saveMoreGame() {
        if (this.id == 0) {
          this.$http.post("/moregame", {
            params: {
              gameappid: this.gameappid,
              iconurl: this.iconurl,
              title: this.title,
              jumpappid: this.jumpappid,
              position: this.position,
              path: this.path
            }
          }).then(result => {
            this.clearModalData();
            this.queryMoreGame();
            alert(result.msg);
          })
        } else {
          this.$http.put("/moregame", {
            params: {
              id: this.id,
              gameappid: this.gameappid,
              iconurl: this.iconurl,
              title: this.title,
              jumpappid: this.jumpappid,
              position: this.position,
              path: this.path
            }
          }).then(result => {
            this.clearModalData();
            this.queryMoreGame();
            alert(result.msg);
          })
        }
        //关闭模态框
        $('#myModal').modal('hide');
      },
      /**
       * 响应编辑控件的增加方法，清除modal数据，并显示modal
       */
      addFun() {
        this.clearModalData();
        $('#myModal').modal('show');
      },
      /**
       * 响应编辑控件的修改方法，获取当前条数据的详细信息
       */
      modifyFun() {
        var id = $("input[name='rg_datatable']:checked").val();
        if (id === undefined) {
          alert('请先选中要修改的数据');
          return;
        }

        $('#myModal').modal('show');
        this.$http.get("/moregame/" + id, {
          params: {}
        }).then(result => {
          var field = result.data[0];
          this.id = field.id;
          this.gameappid = field.gameappid;
          this.iconurl = field.iconurl;
          this.title = field.title;
          this.jumpappid = field.jumpappid;
          this.position = field.position;
          this.path = field.path;
        });
      },
      deleteFun() {
        var that = this;
        var field = $("input[name='rg_datatable']:checked").val();
        if (field === undefined) {
          alert('请选中要删除的数据');
          return;
        }

        $.confirm({
          title: '确认删除？',
          content: '确认要删除这条跳转游戏数据？',
          type: 'greem',
          buttons: {
            ok: {
              text: '删除',
              btnClass: 'btn-danger',
              action: function () {
                // console.log('the user clicked confirm');
                that.$http.delete("/moregame/" + field, {
                  params: {}
                }).then(result => {
                  that.queryMoreGame();
                  alert(result.msg);
                })
              }
            },
            cancel: {
              text: '取消',
              btnClass: 'btn-primary',
              action: function () {
                console.log('the user clicked cancel');
              }
            }
          }
        });

      },
      /**
       * 清理modal数据
       */
      clearModalData() {
        this.id = 0;
        this.gameappid = "";
        this.iconurl = "";
        this.title = "";
        this.jumpappid = "";
        this.position = 0;
        this.path = "";
      },
      validateForm(scope) {
        var that = this;
        // this.saveMoreGame();
        this.$validator.validateAll(scope).then(result => {
          if (result) {
            if (this.gameappid === '') {
              alert("请选择游戏id");
              return;
            }
            if (this.position === '' || this.position === 0) {
              alert("请输入共享位置");
              return;
            }
            that.saveMoreGame();
          }
        });
      }
    },
    mounted: function () {
      var that = this;
      this.queryGame();
      // this.queryMoreGame();
      this.initFileInputConfig();

      $('#myModal').on('show.bs.modal', function () {
        console.log("show.bs.modal");
        that.initFileInputConfig();
      });
    }
  }
</script>

<style scoped>

</style>
