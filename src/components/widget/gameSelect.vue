<template>
  <div class="form-group">
    <label>选择游戏</label>
    <select class="form-control" id="game" v-model="gameSelect">
      <option value="" selected>{{title}}</option>
      <option v-for="game in games" v-bind:value="game.value">{{game.text}}</option>
    </select>
  </div>
</template>

<script>
  import bus from '../../lib/eventBus'

  export default {
    name: "gameSelect",
    props:['title'],
    data: function () {
      return {
        games: [],
        gameSelect: ""
      }
    },
    watch: {
      gameSelect: function (val, oldVal) {
        bus.$emit('game-select', {gameSelect: this.gameSelect});
      }
    },
    methods: {
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
      }
    },

    created: function () {
      this.queryGame();
    }
  }
</script>

<style scoped>

</style>


































