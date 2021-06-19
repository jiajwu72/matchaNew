<template>
  <div>
    <Header></Header>
    <div class="content">
      <slot>
      </slot>
    </div>
    <beautiful-chat
      v-if="openIt&&connected"
      style="z-index:999;"
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="true"
      :showFile="false"
      :showEdition="true"
      :showDeletion="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage" />
    <Footer ></Footer>
  </div>
</template>

<script>
  import Footer from './Footer';
  import Header from './Header';
  export default{
    name:"Home",
    components:{
      Header,
      Footer,
    },
    props: ['chat_with_user'],

    data(){
      return {
        connected:false,
        chatData:1,
        openIt:false,
        id:-1,
        icons:{
          open:{
            img: "https://avatars3.githubusercontent.com/u/37018832?s=200&v=4",
            name: 'default',
          },
          close:{
            img: "https://avatars3.githubusercontent.com/u/37018832?s=200&v=4",
            name: 'default',
          },
          file:{
            img: "FileIcon",
            name: 'default',
          },
          closeSvg:{
            img: "CloseIconSvg",
            name: 'default',
          },
        },
        participants: [
          {
            id: -1,
            // id:1,
            // userId:this.localStorage.getItem("chat_with_user"),
            name: 'Matteo',
            imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
          },
          // {
          //   id: 'user2',
          //   name: 'Support',
          //   imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
          // }
        ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
        titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
        messageList: [
            // { type: 'text', author: `me`, data: { text: `Say yes!` } },
            // { type: 'text', author: `user1`, data: { text: `No.` } },
            // { type: 'text', author: `me`, data: { text: `Say yes!` } },
            // { type: 'text', author: `user1`, data: { text: `No.` } },
            // { type: 'text', author: `user1`, data: { text: `No.` } },
            // { type: 'text', author: `user1`, data: { text: `No.` } },
        ], // the list of the messages to show, can be paginated and adjusted dynamically
        newMessagesCount: 0,
        isChatOpen: false, // to determine whether the chat window should be open or closed
        showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
        colors: {
          header: {
            bg: '#4e8cff',
            text: '#ffffff'
          },
          launcher: {
            bg: '#4e8cff'
          },
          messageList: {
            bg: '#ffffff'
          },
          sentMessage: {
            bg: '#4e8cff',
            text: '#ffffff'
          },
          receivedMessage: {
            bg: '#eaeaea',
            text: '#222222'
          },
          userInput: {
            bg: '#f4f7f9',
            text: '#565867'
          }
        }, // specifies the color scheme for the component
        alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
        messageStyling: true,
      }

    },
    sockets:{


      messageReceived:function(data){
        console.log("messageReceived:",data);
        this.isChatOpen=true;
        const content =data.content;
        const message={ author: parseInt(data.from_user), type: 'text', data: { text:content } }
        console.log(message);
        this.messageList = [ ...this.messageList, message ]
        //this.onMessageWasSent({ author: data.from_user, type: 'text', data: { content } });
        // this.notifs.unshift(data)
      }
    },
    created() {

      this.id=localStorage.getItem("userId")

      this.connected=this.id?true:false;
      console.log(this.connected);
      // if (this.chat_with_user>0)
      //   localStorage.setItem('chat_with_user',this.chat_with_user)
      this.updateChatBox()
      // this.participants[0].id=parseInt(localStorage.getItem("chat_with_user"))

    },
    methods: {
      // chat_with_user(e) {
      //   console.log(e);
      //   // this.$emit('chat_with',-1)
      //   this.chatData=e;
      //   // this.$set("chat_user",e)
      //
      // },
      // connected(){
      //   console.log("connected");
      //   if (localStorage.getItem("userId"))
      //     return true;
      //   return false;
      // },

      updateChatBox(){
        // this.participants[0].id=this.chat_with_user
        console.log("updateChatBox");
        if (this.chatData<0)
          localStorage.setItem('chat_with_user',-2)
        if (this.chat_with_user>0 && localStorage.getItem("chat_with_user")!=-2)
          localStorage.setItem('chat_with_user',this.chat_with_user)

        if (localStorage.getItem("chat_with_user")>0)
          this.openIt=true
        else
          this.openIt=false

        this.participants[0].id=localStorage.getItem("chat_with_user")

        // console.log("this.participants:",this.participants);

        // var chat_with_user=parseInt(localStorage.getItem("chat_with_user"))

        this.axios.post("http://localhost:3001/user/"+this.id+"/message/chatWith",{chat_with_user:localStorage.getItem("chat_with_user")})
        .then((result)=>{
          // console.log(result.data.res);
          var list=result.data.res;
          this.participants[0].imageUrl=result.data.from_user_profil
          this.participants[0].name=result.data.name
          this.icons.open.img=this.participants[0].imageUrl
          this.icons.close.img=this.participants[0].imageUrl
          list.forEach((item)=>{

            var data={text:item.content}
            var author=item.from_user==this.id?"me":item.from_user;
            var el={data:data,author:author,type:"text"};

            // console.log("el:",el);
            this.messageList.push(el)
            // console.log(this.messageList);
          })
        })
      },

      sendMessage (text) {
        if (text.length > 0) {
          this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
          this.onMessageWasSent({ author: 'me', type: 'text', data: { text } })

          // console.log("sendMessage:",text);
          // this.$socket.emit("sendMessage",notif);
        }
      },
      onMessageWasSent (message) {
        // called when the user sends a message
        console.log("message:",message);
        this.$socket.emit("sendMessage",{from_user:localStorage.getItem("userId"),to_user:this.participants[0].id,content:message.data.text})
        this.messageList = [ ...this.messageList, message ]
      },
      openChat () {
        // called when the user clicks on the fab button to open the chat
        this.isChatOpen = true
        this.newMessagesCount = 0
      },
      closeChat () {
        // called when the user clicks on the botton to close the chat
        this.isChatOpen = false
      },
      handleScrollToTop () {
        // called when the user scrolls message list to top
        // leverage pagination for loading another page of messages
      },
      handleOnType () {
        console.log('Emit typing evente')
      },
      editMessage(message){
        const m = this.messageList.find(m=>m.id === message.id);
        m.isEdited = true;
        m.data.text = message.data.text;
        console.log(message);
      },
    },
    watch:{
      chat_with_user:function(val){
        console.log("chat with user change:",val);
        this.updateChatBox();
        this.isChatOpen=true;
      },
      chatData:function(val){
        console.log("chat with user change:",val);
        this.updateChatBox();
        // this.isChatOpen=true;
      }
    }
  }
</script>

<style scoped>
.content{
  margin-top:58px;
  background-color: #faf9f8;
}

</style>
