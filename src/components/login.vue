<template>
  <div class="login-box">
    <div class="login-logo">
      <b>佳游小游戏参数系统</b>
      <h2>请登录</h2>
    </div>
    <div class="login-box-body">
      <form>
        <div class="form-group has-feedback">
          <input type="text" class="form-control" placeholder="用户名" required autofocus v-model="name">
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" id="pwd" class="form-control" placeholder="密码" required v-model="password">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="input-group-btn">
          <button type="button" class="btn btn-lg btn-primary btn-block" @click="login">登录</button>
        </div>
      </form>
    </div>
    <!--<div class="checkbox">-->
    <!--<label>-->
    <!--<input type="checkbox" value="remember-me">记住我-->
    <!--</label>-->
    <!--</div>-->
  </div>
</template>

<script>
  import Vue from 'vue'
  var that;
  export default {
    name: "login",
    data: function () {
      return {
        name: '',
        password: ''
      }
    },
    mounted: function () {
      that = this;
    },
    methods: {
      login: function () {
          // window.location.href = "index.html";
        // window.sessionStorage.setItem("token", null);
        // this.$http.get('channel/login', {
        //   params: {
        //     name: this.name,
        //     pwd: this.password,
        //   }
        // }).then(response=> {
        //   window.sessionStorage.setItem('channelid', response.data.channelid);
        //   window.sessionStorage.setItem('token', response.data.token);
        //   window.sessionStorage.setItem('auth',response.data.auth);
        //   window.location.href = "index.html";
        //
        // })
        //   .catch(function (response) {
        //     // alert(response.msg);
        //     console.log(response);
        //   });

        window.sessionStorage.setItem("token",null);
        this.$loginHttp.get('oauth/token',{
          params:{
            username:this.name,
            password:this.password,
            grant_type:'password',
            scope:'select',
            client_id:'client1',
            client_secret:'ugame_qwERzX'
          }
        }).then(response=>{
          // debugger
          //保存token
          window.sessionStorage.setItem('access_token', response.data.access_token);

          window.location.href = "index.html";
        }).catch(response=>{
          alert("登录失败:"+response.message);
          console.log(response);
        })
      }
    }

  }
</script>

<style scoped>

</style>
