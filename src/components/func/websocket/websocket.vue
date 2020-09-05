<template>
  <div>
    <noscript><h2 style="color: #ff0000">Seems your browser doesn't support Javascript! Websocket relies on Javascript
      being
      enabled. Please enable
      Javascript and reload this page!</h2></noscript>
    <div id="main-content" class="container">
      <div class="row">
        <div class="col-md-5">
          <form class="form-inline">
            <div class="form-group">
              <label for="connect">WebSocket connection:</label>
              <button id="connect" class="btn btn-default" type="submit">Connect</button>
              <button id="disconnect" class="btn btn-default" type="submit" disabled="disabled">Disconnect
              </button>
            </div>
          </form>
        </div>
        <div class="col-md-7">
          <form class="form-inline">
            <div class="form-group">
              <label for="name">What is your name?</label>
              <input type="text" id="name" class="form-control" placeholder="Your name here...">
            </div>
            <button id="send" class="btn btn-default" type="button" @click="sendToAll">Send2All</button>
            <button id="sendOne" class="btn btn-default" type="button" @click="sendToOne">Send2One</button>
          </form>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <table id="conversation" class="table table-striped">
            <thead>
            <tr>
              <th>Greetings</th>
            </tr>
            </thead>
            <tbody id="greetings">
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import SockJS from 'sockjs-client';
  import Stomp from '../../../lib/stomp'

  var stompClient = null;
  export default {
    name: "websocket",
    methods:{
      setConnected(connected){
        $('#connect').prop('disabled',connected);
        $('#disconnect').prop('disabled',!connected);
        if(connected){
          $('#conversation').show();
        }else{
          $('#conversation').hide();
        }
        $('#greetings').html('');
      },
      connect(){
        var that = this;
        var root = 'http://127.0.0.1:8188'
        this.socket = new SockJS(root+'/ws');
        stompClient = Stomp.over(this.socket);
        stompClient.connect({login:'222'},function(frame){
          that.setConnected(true);
          console.log("Connected: "+frame);

          //订阅广播消息
          stompClient.subscribe('/topic/to-all',function(msg){
            // alert("/topic/to-all:"+msg);
            that.showGreeting(msg.body);
          })

          //订阅 /user/userId/to-one 点对点消息
          stompClient.subscribe('/user/topic/to-one',function(msg){
            that.showGreeting(msg.body);
          })

          var webMsg = {
            'userId':1,
            'username':'111',
            'clientMark':'cm',
            'type':'3'
          }
          stompClient.send(root+'/app/to-one',{},JSON.stringify(webMsg));

          // stompClient.subscribe('/fc/topic/greetings',function (greeting){
          //   this.showGreeting(JSON.parse(greeting.body).content);
          // })
          //订阅指定频道，接收服务器主动发送的消息
          // stompClient("/")
        })
      },
      disconnect(){
        if(stompClient !==null){
          stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
      },
      //发送消息并打印服务器相应消息
      // sendName(){
      //   stompClient.send("/app/hello",{},JSON.stringify({'name':$("#name").val()}));
      // },
      sendToAll(){
        var wm = {'contents':$('#name').val(),'type':1};
        stompClient.send("/app/to-all",{},JSON.stringify(wm));
      },
      sendToOne(){
        // var wm = {'contents':$('#name').val(),'type':1,'userId':'111'};
        var wm = {'contents':$('#name').val(),'type':1,'username':'111'};
        stompClient.send("/app/to-one",{},JSON.stringify(wm));
      },
      sendToHelper(){
        var wm = {'contents':$('#name').val(),'type':1,'username':'222'};
      },
      showGreeting(message){
        $('#greetings').append("<tr><td>"+message+"</td></tr>");
      },
    },
    mounted:function(){
      var that = this;
      $('form').on('submit',function(e){
        e.preventDefault();
      });
      $('#connect').click(function(){that.connect();});
      $('#disconnect').click(function(){that.disconnect();});
    }
  }
</script>

<style scoped>

</style>


