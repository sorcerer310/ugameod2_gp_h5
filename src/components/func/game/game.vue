<template>
  <div>
    <section class="content-header">
      <h1>产品</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <form @submit.prevent="validateForm('form1')" data-vv-scope="form1">
          <div class="box-header">
            <h3 class="box-title">管理产品数据</h3>
          </div>
          <div class="box-body">
            <div class="row">
              <div class="col-md-4">
                <div class="radio">
                  <label class="radio-inline">
                    <input type="radio" name="editRadios" value="new" v-model="editRadio" checked>新建
                  </label>
                  <label class="radio-inline">
                    <input type="radio" name="editRadios" value="modify" v-model="editRadio">修改
                  </label>
                  <label class="radio-inline">
                    <input type="radio" name="editRadios" value="delete" v-model="editRadio">删除
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>选择游戏</label>
                  <select class="form-control" id="game" v-model="gameSelect">
                    <option value="" selected>选择游戏</option>
                    <option v-for="game in games" v-bind:value="game.value">{{game.text}}</option>
                  </select>
                </div>
                <!--<game-select title="选择游戏" id="game"></game-select>-->
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="gamename">游戏名</label>
                  <input type="text" class="form-control" id="gamename" placeholder="游戏名" v-model="gamename">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="gameappid">游戏appid</label>
                  <input type="text" class="form-control" id="gameappid" placeholder="游戏appid" v-model="gameappid">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="secret">游戏secret</label>
                  <input type="text" class="form-control" id="secret" placeholder="游戏secret"
                         v-model="secret">
                </div>
              </div>
            </div>
          </div>
          <div class="box-footer">
            <button id="bt_submit" type="submit" class="btn btn-primary pull-right">提交</button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
  import GameSelect from "../../widget/gameSelect";
  import bus from '../../../lib/eventBus'

  export default {
    name: "game",
    components: {GameSelect},
    data: function () {
      return {
        games: [],
        gameSelect: "",
        gamename: "",
        gameappid: "",
        secret: "",
        editRadio: 'new'
      }
    },
    watch: {
      editRadio: function (val, oldVal) {
        switch (val) {
          case 'new':
            this.setInputDisabled(false);
            $('#game').attr('disabled', true);
            $('#bt_submit').text('提交');
            $('#bt_submit').attr('class', 'btn btn-success pull-right');
            break;
          case 'modify':
            this.setInputDisabled(false);
            $('#game').attr('disabled', false);
            this.gameSelect = '';
            $('#bt_submit').text('保存');
            $('#bt_submit').attr('class', 'btn btn-primary pull-right');
            break;
          case 'delete':
            this.setInputDisabled(true);
            $('#game').attr('disabled', false);
            this.gameSelect = '';
            $('#bt_submit').text('删除');
            $('#bt_submit').attr('class', 'btn btn-danger pull-right');
            break;
        }
        this.clearInputData();
      },
      gameSelect: function (val, oldVal) {
        if (val == '') {
          this.clearInputData();
          return;
        }
        this.gamename = val.gamename;
        this.gameappid = val.gameappid;
        this.secret = val.secret;
      }
    },
    methods: {
      /**
       * 获得游戏数据
       */
      queryGameData: function () {
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
       * 为指定渠道、盒子增加游戏数据
       */
      addGameData: function () {
        var that = this;
        this.$http.post("/game", {
          params: {
            gamename: this.gamename,
            gameappid: this.gameappid,
            secret: this.secret
          }
        }).then(result => {
          alert(result.msg);
          that.queryGameData();
          that.clearInputData();
        })
      },
      /**
       * 修改游戏数据
       */
      modifyGameData: function () {
        this.$http.put('/game', {
          params: {
            id: this.gameSelect.id,
            gamename: this.gamename,
            gameappid: this.gameappid,
            secret: this.secret
          }
        }).then(result => {
          alert(result.msg);
          this.queryGameData();
        })
      },
      /**
       * 删除游戏数据
       */
      deleteGameData: function (id) {
        this.$http.delete('/game/' + id, {})
          .then(result => {
            alert(result.msg);
            this.queryGameData();
            this.clearInputData();
          });
      },
      /**
       * 设置输入控件的可用性
       */
      setInputDisabled(disabled) {
        $('#gamename').attr('disabled', disabled);
        $('#gameappid').attr('disabled', disabled);
        $('#secret').attr('disabled', disabled);
      },
      /**
       * 清除所有输入
       */
      clearInputData() {
        this.channelSelect = '';
        this.gamename = '';
        this.gameappid = '';
        this.secret = '';
      },
      /**
       * 验证数据，通过后提交数据
       */
      validateForm(scope) {
        var that = this;
        this.$validator.validateAll(scope).then(result => {
          var that = this;
          this.$validator.validateAll(scope).then(result => {
            if (result) {
              switch (this.editRadio) {
                case 'new':
                  this.addGameData();
                  break;
                case 'modify':
                  if (this.gameSelect == '') {
                    alert('请先选择游戏');
                    return;
                  }
                  this.modifyGameData(this.gameSelect.id);
                  break;
                case 'delete':
                  if (this.gameSelect == '') {
                    alert('请先选择游戏');
                    return;
                  }
                  $.confirm({
                    title: '确认删除？',
                    content: '确认要删除这个游戏？',
                    type: 'greem',
                    buttons: {
                      cancel: {
                        text: '取消',
                        btnClass: 'btn-primary',
                        action: function () {
                          console.log('the user clicked cancel');
                        }
                      },
                      ok: {
                        text: '删除',
                        btnClass: 'btn-danger',
                        action: function () {
                          console.log('the user clicked confirm');
                          that.deleteGameData(that.gameSelect.id);
                        }
                      }
                    }

                  });
                  break;
              }
            }
          })
        });
      }
    },
    mounted: function () {
      this.queryGameData();
      //默认选择框不可用
      $('#game').attr('disabled', true);

      // bus.$on('game-select',function(msg){
      //   if (msg.gameSelect == '') {
      //     this.clearInputData();
      //     return;
      //   }
      //
      //   this.gamename = val.gamename;
      //   this.gameappid = val.gameappid;
      //   this.secret = val.secret;
      // })
    }
  }
</script>

<style scoped>

</style>
































