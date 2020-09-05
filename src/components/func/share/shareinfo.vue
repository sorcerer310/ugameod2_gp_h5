<template>
  <div>
    <section class="content-header">
      <h1>共享管理</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <form @submit.prevent="validateForm('form1')" data-vv-scope="form1">
          <div class="box-header">
            <h3 class="box-title">游戏共享数据管理</h3>
          </div>
          <div class="box-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>选择游戏</label>
                  <select class="form-control" id="game" v-model="gameSelect">
                    <option value="" selected>选择游戏</option>
                    <option v-for="game in games" v-bind:value="game.value">{{game.text}}</option>
                  </select>
                </div>
                <!--<game-select title="选择游戏"></game-select>-->
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
                  <!--<button id="bt_delete" type="button" @click="deleteShareInfo" class="btn btn-danger">-->
                    <!--<i class="fa fa-remove"></i> 删除-->
                  <!--</button>-->
                <!--</div>-->
                <widget-c-u-d :addcallback="showAddModal" :modifycallback="showModifyModal" :deletecallback="deleteShareInfo"></widget-c-u-d>

              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table class="table table-striped" id="dt_shareinfo">
                  <thead>
                  <tr>
                    <th>图片</th>
                    <th>分享文本</th>
                    <th>游戏ID</th>
                    <th>位置ID</th>
                    <th>启用</th>
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
                    <h4 class="modal-title" id="myModalLabel">新增分享信息</h4>
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

                        <label for="sharepositionid">位置ID:</label>
                        <input type="number" class="form-control" id="sharepositionid" placeholder="共享位置ID"
                               v-model="sharepositionid">

                        <label for="uploadfile">分享图片:</label>
                        <div class="row">
                          <div class="col-md-3">
                            <img id="img_share" :src="imageurl" width="100" height="100"
                                 onerror="this.style.display='none'">
                          </div>
                          <div class="col-md-8">
                            <input id="uploadfile" name="uploadfile" type="file" class="file"
                                   data-preview-file-type="text" required>
                          </div>
                        </div>

                        <label for="sharecontent">分享文本:</label>
                        <textarea class="form-control" rows="4" id="sharecontent" placeholder="分享文本"
                                  v-model="sharecontent"></textarea>
                        <!--<input type="text" class="form-control" rows="5" id="sharecontent" placeholder="分享文本" v-model="sharecontent">-->

                        <label for="shareorder">分享排序:</label>
                        <input type="number" id="shareorder" class="form-control" placeholder="分享排序"
                               v-model.number="shareorder">

                        <label for="enabled">是否启用:</label>
                        <input type="checkbox" id="enabled" v-model="enabled">
                      </div>
                    </form>
                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="submit" class="btn btn-primary">保存数据</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box-footer">
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
  import {global_upfilehost, global_upfileurl} from '../../../lib/utils';
  import GameSelect from "../../widget/gameSelect";
  import WidgetCUD from "../../widget/widgetCUD";

  export default {
    name: "shareinfo",
    components: {WidgetCUD, GameSelect},
    data: function () {
      return {
        games: [],
        gameSelect: "",
        ds_shareinfo: [],
        modaltype: "add",
        id: 0,
        gameappid: "",
        imageurl: "",
        sharepositionid: "",
        sharecontent: "",
        shareorder: 0,
        enabled: false
      }
    },
    watch: {
      gameSelect: function (val, oldVal) {
        this.gameappid = val.gameappid;
        this.queryShareInfo();
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
          });
      },
      /**
       * 查询游戏分享信息
       */
      queryShareInfo() {
        var that = this;
        this.$http.get('shareinfo', {
          params: {
            gameappid: this.gameSelect.gameappid
          }
        }).then(result => {
          that.ds_shareinfo = [];
          $.each(result.data, function (i, field) {
            var rd = new Array();
            // rd.push(field.id);
            rd.push('<img src="' + field.imageurl + '" height="80" width="80" onerror="this.style.display=\'none\'" />');
            rd.push(field.sharecontent);
            rd.push(field.gameappid);
            rd.push(field.sharepositionid);
            rd.push(field.enabled);

            //编辑删除，实验不成功，vue不支持在拼接字符串中使用@click，也不能在拼接字符串中使用methods的方法
            // var a_edit = "<a href='#' @click='showModifyModal(" + field + ")'>修改</a>";
            // var a_edit = "<a href='#' @click='alert()'>修改</a>";
            // var bt_edit = '<button type="button" class="btn btn-primary" onclick="showModifyModal(field)">修改</button>';
            // var a_delete = "<a href='#' @click='showDeleteModal(" + field + ")'>删除</a>";
            // rd.push(bt_edit+"|"+a_delete);
            // rd.push('<editdelete></editdelete>');

            rd.push('<input type="radio" id="r_' + field.id + '" name="rg_datatable" value="' + field.id + '">')

            that.ds_shareinfo.push(rd);
          });

          $('#dt_shareinfo').DataTable({
            "destroy": true,
            "autoWidth": false,
            "ordering": true,
            "searching": false,
            "pageing": false,
            "info": false,
            "lengthChange": false,
            "paginate": true,
            "pageLength": 12,
            data: that.ds_shareinfo,
          });

        });
      },
      /**
       * 初始化文件上传控件
       */
      initFileInputConfig: function (allowedFileExtensions, onFileUploaded) {
        var that = this;
        $('#uploadfile').fileinput('destroy').fileinput({
          //$('#uploadfile')的属性都保存在$('#uploadfile').fileinput.defaults中
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
          //上传成功收将预览图设置为刚刚上传的图片
          that.imageurl = global_upfilehost + data.response.rename;
        });
      },
      /**
       * 保存共享信息,包括新建和更新两种操作
       */
      saveShareInfo() {
        if (this.id == 0) {
          this.$http.post("/shareinfo", {
            params: {
              gameappid: this.gameappid,
              sharepositionid: this.sharepositionid,
              imageurl: this.imageurl,
              sharecontent: this.sharecontent,
              shareorder: this.shareorder,
              enabled: this.enabled
            }
          }).then(result => {
            this.clearModalData();
            this.queryShareInfo();
            alert(result.msg);
          })
        } else {
          this.$http.put("/shareinfo", {
            params: {
              id: this.id,
              gameappid: this.gameappid,
              sharepositionid: this.sharepositionid,
              imageurl: this.imageurl,
              sharecontent: this.sharecontent,
              shareorder: this.shareorder,
              enabled: this.enabled
            }
          }).then(result => {
            this.clearModalData();
            this.queryShareInfo();
            alert(result.msg);
          })
        }
        //关闭模态框，清理模态框中无用数据，并重新查询表格数据
        $('#myModal').modal('hide');

      },
      /**
       * 显示增加数据的模态框
       */
      showAddModal() {
        this.clearModalData();
        $('#myModal').modal('show');
      },
      /**
       * 显示修改共享数据的模态框
       */
      showModifyModal() {
        var id = $("input[name='rg_datatable']:checked").val();
        if (id === undefined) {
          alert('请先选中要修改的数据');
          return;
        }

        $('#myModal').modal('show');
        this.$http.get("/shareinfo/" + id, {
          params: {}
        }).then(result => {
          var field = result.data[0];
          this.id = field.id;
          this.gameappid = field.gameappid;
          this.imageurl = field.imageurl;
          this.sharepositionid = field.sharepositionid;
          this.sharecontent = field.sharecontent;
          this.shareorder = field.shareorder;
          this.enabled = field.enabled;
        });
      },
      /**
       * 删除共享信息
       */
      deleteShareInfo() {
        var that = this;
        var field = $("input[name='rg_datatable']:checked").val();
        if (field === undefined) {
          alert('请选中要删除的数据');
          return;
        }

        $.confirm({
          title: '确认删除？',
          content: '确认要删除这条共享数据？',
          type: 'greem',
          buttons: {
            ok: {
              text: '删除',
              btnClass: 'btn-danger',
              action: function () {
                // console.log('the user clicked confirm');
                that.$http.delete("/shareinfo/" + field, {
                  params: {}
                }).then(result => {
                  that.queryShareInfo();
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
       * 清理modal中的数据
       */
      clearModalData() {
        this.id = 0;
        this.gameappid = "";
        this.imageurl = "";
        this.sharepositionid = 0;
        this.sharecontent = "";
        this.shareorder = 0;
        this.enabled = false;
      },


      /**
       * 验证数据，通过后提交数据
       */
      validateForm(scope) {
        var that = this;
        this.$validator.validateAll(scope).then(result => {
          if (result) {
            if (this.gameappid === '') {
              alert("请选择游戏id");
              return;
            }
            if (this.sharepositionid === '' || this.sharepositionid === 0) {
              alert("请输入共享位置");
              return;
            }
            that.saveShareInfo();
          }
        });
      }
    },
    mounted: function () {
      this.queryGame();                           //获得游戏数据
      // this.queryShareInfo();                    //默认查询全部游戏的共享信息
      this.initFileInputConfig();               //初始化fileInput的配置
    }
  }


</script>

<style scoped>

</style>
































