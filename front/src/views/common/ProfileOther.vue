<template id="">
  <div class="" style="padding-bottom:320px;">
    <v-container>
    <b-row>
      <b-alert v-if="alert_msg" variant="success" show>{{alert_msg}}</b-alert>
      <v-card style="width:100%;padding:10px;">
        <b-row>
          <b-col md="3">
            <v-img :src="user.selectImg" class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200">
            </v-img><br>
            <b-button variant="primary" @click="overlay = !overlay">
              Voir plus de photo
            </b-button>
            <v-overlay :value="overlay">
              <v-btn
                icon
                @click="overlay = false"
                style="float:right;"
              >
                <v-icon>mdi-close</v-icon>

              </v-btn><br>
              <b-container>
                <b-row>
                  <b-col md="12">
                    <Carousel
                    :slides="slides">
                    </Carousel>
                  </b-col>
                </b-row>
              </b-container>
            </v-overlay>

          </b-col>
          <b-col md="6">
            <h2>{{user.identif}}</h2> {{user.age}} ans de {{user.locality}} <br>
            <v-card style="padding:8px;" v-if="user.biographe">
              {{user.biographe}}
            </v-card>
          </b-col>
          <b-col md="2">
            <v-card class="action"
            v-for="(item, index) in actions"
            :key="index"
            @click="doAction(item,index)">
              <strong>
                <v-icon style="color:white;">
                  {{item.icon}}
                </v-icon>
                {{item.name}}
              </strong>
            </v-card>
          </b-col>

        </b-row>
      </v-card>
    </b-row>

    <b-row style="margin-top:15px;">
      <v-card style="width:100%;padding:10px;">
        <h2>TAGS</h2> <br>
        <v-chip class="tag" v-for="(item, index) in tags" :key="index">
          {{item.name}}
        </v-chip>
      </v-card>
    </b-row>



    </v-container>
  </div>
</template>

<script>

import Carousel from "@/components/common/Carousel"
// import CloseIcon from 'vue-beautiful-chat/dist/vue-beautiful-chat.umd.min.js'

// import OpenIcon from 'vue-beautiful-chat/dist/vue-beautiful-chat.umd.min.js'
// import FileIcon from 'vue-beautiful-chat/dist/vue-beautiful-chat.umd.min.js'
// import CloseIconSvg from 'vue-beautiful-chat/dist/vue-beautiful-chat.umd.min.js'



export default{
  name:"ProfileOther",
  components: {
    Carousel,
  },
  props:[

  ],
  data () {
    return {
      id:0,
      user:{},
      tags:[],
      actions:[],
      overlay:false,
      slides:[],
      alert_msg:"",




    }
  },
  created() {
    this.id=this.$route.params.id;
    this.getUser();
    this.getTagsMatch();
    this.actions=[
      {name:"Aimer",icon:"mdi-heart"},
      {name:"Chat",icon:"mdi-chat"},
      {name:"Reporter",icon:"mdi-alert-circle"},
      {name:"Bloquer",icon:"mdi-account-cancel"},
    ]
    this.getActions()
  },
  sockets:{
    connect: function () {
            console.log('socket connected')
    },
    // customEmit: function (data) {
    //         console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    // }
    // notifReceived:function(data){
    //   console.log(data);
    // }
  },
  methods: {



    setSlides(){
      // console.log("setSlides");
      if (this.user.img1) {
        this.slides.push({src:this.user.img1})
      }
      if (this.user.img2) {
        this.slides.push({src:this.user.img2})
      }
      if (this.user.img3) {
        this.slides.push({src:this.user.img3})
      }
      if (this.user.img4) {
        this.slides.push({src:this.user.img4})
      }
      if (this.user.img5) {
        this.slides.push({src:this.user.img5})
      }
    },
    getUser() {
      // console.log("getUser");
      this.axios.get("http://localhost:3001/user/"+this.id+"/get")
      .then((result)=>{
        this.user=result.data.res
        this.setSlides();
      })
    },
    getTagsMatch(){
      const query="http://localhost:3001/tag/getMatch/"+this.id;
      // console.log(query);
      this.axios.get(query)
      .then((result)=>{
        // console.log(result.data.res);
        this.tags=result.data.res
      })
    },


    defineTable(item){
      var table=""
      if (item.name=="Aimer" || item.name=="N'aime plus") {
        table="liked";
      }
      else if (item.name=="Reporter") {
        table="reported";
      }
      else if (item.name=="Bloquer") {
        table="blocked";
      }
      // else if (item.name=="Chat") {
      //
      // }
      return table
    },

    getAction(name){
      const query="http://localhost:3001/action/listUserAction";
      const action={from_user:localStorage.getItem("userId"),to_user:this.id}
      const table=name
      console.log(query);
      this.axios.post(query,{action:action,table:table})
      .then((result)=>{
        console.log(result.data.res);
        result=result.data.res[0]
        if (result) {
          if (name=="liked"){
            this.$set(this.actions,0,{name:"N'aime plus",icon:"mdi-heart"})
          }
        }
      })
    },
    getActions(){
      this.getAction("liked")
      // this.getAction("blocked")
      this.getAction("reported")
    },

    doNextAction(name,index){
      console.log("doNextAction",name,index);
      if (name=="N'aime plus") {
        console.log("doNextAction like");
        this.$set(this.actions, index, {name:"Aimer",icon:"mdi-heart"})
        this.alert_msg="Vous n'aimez plus "+this.user.identif;
        const notif={from_user:localStorage.getItem("userId"),to_user:this.$route.params.id,content:"ne vous aime plus."}
        this.$socket.emit("sendNotif",notif);
        // window.location="/profile/"+this.id
      }
      if (name=="Aimer") {
        console.log("doNextAction like");
        this.$set(this.actions, index, {name:"N'aime plus",icon:"mdi-heart"})
        this.alert_msg="Vous avez aimé "+this.user.identif;
        const notif={from_user:localStorage.getItem("userId"),to_user:this.$route.params.id,content:"vous a aimé."}
        this.$socket.emit("sendNotif",notif);
        // window.location="/profile/"+this.id
      }
      else if (name=="Reporter") {
        this.alert_msg="Vous avez reporté "+this.user.identif+" comme un faux compte.";
        const notif={from_user:localStorage.getItem("userId"),to_user:this.$route.params.id,content:"vous a reporté comme faux compte."}
        this.$socket.emit("sendNotif",notif);
      }
      else if (name=="Bloquer") {
        this.alert_msg="Vous avez Bloqué "+this.user.identif+" et vous ne pourrez plus reçevoir ses notifications."
        // const notif={from_user:localStorage.getItem("userId"),to_user:this.$route.params.id,content:"vous a bloqué."}
        // this.$socket.emit("sendNotif",notif);
      }
      // else if (item.name=="Chat") {
      //
      // }
    },
    doAction(item,i){
      if(item.name=="Chat")
      {
        console.log("chat");
        localStorage.setItem("chat_with_user",this.$route.params.id);
        this.$emit('chat_with',parseInt(this.$route.params.id))
      }
      else{
        const action={from_user:localStorage.getItem("userId"),to_user:this.id}
        var query="http://localhost:3001/action/addAction";
        if(item.name=="N'aime plus")
        {
          query="http://localhost:3001/action/deleteAction";
        }

        const table=this.defineTable(item)
        console.log("table:",table);
        if (item.name != "Chat") {
          this.axios.post(query,{action:action,table:table})
          .then((result)=>{
            console.log(result);
            this.doNextAction(item.name,i)
          })
        }
      }

    }

  }
}

</script>

<style scoped>
.action{
  background-color: #e01f4d;
  color: white;
  text-align: center;
  padding:5px;
  margin-bottom: 15px;
  cursor: pointer;
  width: 100%;
}
.tag{
  margin-left: 15px;
}

</style>
