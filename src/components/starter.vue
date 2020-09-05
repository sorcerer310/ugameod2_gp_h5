<template>
  <div class="wrapper" style="height: auto;min-height:100%">

    <!--顶部栏-->
    <header class="main-header">
      <a href="#" class="logo">
        <span class="logo-mini"><b>参数</b>系统</span>
        <span class="logo-lg"><b>小游戏</b>参数系统</span>
      </a>
      <nav class="navbar navbar-static-top">
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
      </nav>
    </header>
    <!--左侧边栏-->
    <aside class="main-sidebar">
      <!--<div class="slimScrollDiv" style="position: relative;overflow: hidden; width:auto;height:636px;">-->
      <!--<section class="sidebar" style="overflow:hidden;width:auto;height:636px;">-->
      <section class="sidebar" style="height:auto;">
        <ul class="sidebar-menu tree" data-widget="tree">
          <li class="header">功能列表</li>

          <li><a href="#" @click="switchFunc('game')">产品管理</a></li>
          <li><a href="#" @click="switchFunc('shareinfo')" >分享管理</a></li>
          <li class="treeview">
            <a href="#">
              <i class="fa fa-dashboard"></i>
              <span>动态参数</span>
              <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul class="treeview-menu">
              <li><a href="#" @click="switchFunc('paramscolumn')"><i class="fa fa-circle-o"></i>参数字段</a></li>
              <li><a href="#" @click="switchFunc('paramsvalue')"><i class="fa fa-circle-o"></i>参数管理</a></li>
            </ul>
          </li>
          <li class="treeview">
            <a href="#">
              <i class="fa fa-dashboard"></i>
              <span>外链分享</span>
              <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul class="treeview-menu">
              <li><a href="#" @click="switchFunc('moregame')"><i class="fa fa-circle-o"></i>外链游戏</a></li>
              <li><a href="#" @click="switchFunc('moregamestatistics')"><i class="fa fa-circle-o"></i>数据统计</a></li>
            </ul>
          </li>

          <!--<li><a href="#" @click="switchFunc('keepdata')" >网络参数</a></li>-->
          <!--<li class="treeview" v-if="admin || channel">-->
            <!--<a href="#">-->
              <!--<i class="fa fa-dashboard"></i>-->
              <!--<span>渠道管理</span>-->
              <!--<span class="pull-right-container">-->
                <!--<i class="fa fa-angle-left pull-right"></i>-->
              <!--</span>-->
            <!--</a>-->
            <!--<ul class="treeview-menu">-->
              <!--<li><a href="#" @click="switchFunc('channeluser')" v-if="admin"><i class="fa fa-circle-o" ></i>渠道用户</a></li>-->
              <!--<li><a href="#" @click="switchFunc('box')" v-if="admin || channel"><i class="fa fa-circle-o" ></i>盒子管理</a></li>-->
              <!--<li><a href="#" @click="switchFunc('game')" v-if="admin || channel"><i class="fa fa-circle-o"></i>游戏管理</a></li>-->
            <!--</ul>-->
          <!--</li>-->
          <!--<li class="treeview" v-if="cp">-->
            <!--<a href="#">-->
              <!--<i class="fa fa-dashboard"></i>-->
              <!--<span>开发商</span>-->
              <!--<span class="pull-right-container">-->
                <!--<i class="fa fa-angle-left pull-right"></i>-->
              <!--</span>-->
            <!--</a>-->
            <!--<ul class="treeview-menu">-->
              <!--<li><a href="#" @click="switchFunc('cpdailynew')"><i class="fa fa-circle-o"></i>每日新增</a></li>-->
              <!--&lt;!&ndash;<li><a href="#"><i class="fa fa-circle-o"></i>活跃信息</a></li>&ndash;&gt;-->
            <!--</ul>-->
          <!--</li>-->
          <li><a href="#" @click="switchFunc('blank')">测试功能</a></li>
          <li><a href="#" @click="switchFunc('websocket')">WS测试</a></li>
          <!--<li><a href="#" @click="switchFunc('blank1')">测试功能2</a></li>-->
        </ul>
      </section>
      <div class="slimScrollBar"
           style="background: rgb(0, 0, 0); width: 7px; position: absolute; top: -70.406px; opacity: 0.4; display: none; border-radius: 7px; z-index: 99; right: 1px; height: 392.715px;"></div>
      <div class="slimScrollRail"
           style="width: 7px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 7px; background: rgb(51, 51, 51); opacity: 0.2; z-index: 90; right: 1px;"></div>
      <!--</div>-->
    </aside>
    <div class="content-wrapper" style="min-height:902px;">
      <mainframe></mainframe>
    </div>
    <footer class="main-footer">
      <div class="pull-right hidden-xs"><b>Version</b>" 1.0.0 "</div>
      <strong>Copyright © 2018-2020</strong>All rights reserved.
    </footer>
    <!--右侧边栏-->
    <aside class="control-sidebar control-sidebar-dark"></aside>
    <div class="control-sidebar-bg"></div>
  </div>
</template>

<script>
  import Mainframe from "./mainframe";
  import bus from "../lib/eventBus";

  export default {
    name: "starter",
    components: {Mainframe},
    data() {
      return {
        msg: 'Welcom to ugame wechat game',
        admin:false,
        channel:false,
        cp:false
      }
    },
    methods: {
      switchFunc: function (func) {
        //向mainframe发送switch-func消息
        bus.$emit("switch-func", func);
      }
    },
    mounted: function () {

      //判断token是否保存成功，如果没有获得token值返回登录界面
      var token = window.sessionStorage.getItem("access_token");
      if (token === null || token === undefined || token === '' || token === 'null') {
        window.location.href = "#/login";
      }

      //为所有的http请求统一增加token参数
      this.$http.interceptors.request.use((config)=>{

        if(config.method=='get'){
          config.params = {
            access_token:token,
            ...config.params
          }
        }else if(config.method=='post'){
          config.data = {
            ...config.data,
            access_token:token
          }
        }
        return config;
      })


      // debugger
      // 获得用户的权限，保存权限值到本地。
      this.$http.get("/user/getAuthByUser",{
        params:{}
      }).then(response=>{
        //保存权限
        window.sessionStorage.setItem('auth',response.data[0].auth);
      })


      //获得用户权限，并保存权限

      // var auth = window.sessionStorage.getItem("auth");
      // if(auth=="1")
      //   this.admin = true;
      // else if(auth=="2")
      //   this.channel = true;
      // else if(auth=="3")
      //   this.cp = true;

      // this.$http.defaults.headers.common['ugameod2-token'] = window.sessionStorage.getItem('token');
      // this.$http.defaults.headers.common['access_token'] = token;

      // this.$http.defaults.headers.Authorization = token;

      // instance.interceptors.response.use(({data})=>{
      //   if(data.status==1000){
      //     return data;
      //   }else{
      //     alert(data.msg);
      //   }
      // });



    }
  }
</script>

<style scoped>

</style>
