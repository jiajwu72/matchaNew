<template>
  <div data-app>
    <!-- <v-container> -->

    <v-card class="overflow-hidden">
      <v-app-bar app dark id="header">
         <!-- style="background-color:rgba(0, 0, 82,0.2);"> -->
        <v-app-bar-nav-icon
          class="header_text"
          @click="drawer = !drawer ">
          <v-icon>mdi-heart</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title>
          <a href="/"><span class="header_text">Matcha</span></a>
        </v-toolbar-title>



        <v-spacer></v-spacer>

        <v-toolbar-items>

            <v-btn  style="background-color:rgba(0, 0, 0,0);"
                    @click="dirige()"

            >
              <v-icon>mdi-account</v-icon>
            </v-btn>

          <v-menu
          down
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
            <v-badge
              :content="notifsNoReaded()"
              color="green"
              overlap
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
            </v-btn>
          </template>

          <v-list down >
            <v-list-item
              v-for="(item, i) in notifs"
              :key="i"
              :class="['notif',item.readed?'':'noRead']"
              @click="clickNotif(item)"
            >
              <v-list-item-title>
                <b-avatar button :src="item.from_user_profil"></b-avatar> {{ item.content }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn  style="background-color:rgba(0, 0, 0,0);"
                @click="logout()"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        </v-toolbar-items>


      </v-app-bar>

      <!-- left bar info -->
      <v-navigation-drawer
        app
        v-model="drawer"
        width="260"
        temporary>

        <v-card>
        <v-tabs
          v-model="tab"
          color="green"
          centered
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#tab-1">
            Matchs
            <!-- <v-icon>mdi-phone</v-icon> -->
          </v-tab>

          <v-tab href="#tab-2">
            Messages
            <!-- <v-icon>mdi-heart</v-icon> -->
          </v-tab>


        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="i in 3"
            :key="i"
            :value="'tab-' + i"
          >
            <v-card flat>
              <v-card-text>lalala {{i}}</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
      </v-navigation-drawer>
    </v-card>
    <!-- <v-alert v-model="connect">
      alert connect
    </v-alert> -->
    <Modal :display="alertAuth" @display="update">

      <!-- <Auth></Auth> -->
      <h3 slot="header">
        <span v-if="step==0">
          Connexion
        </span>
        <span v-else-if="step==1">
          Inscription rapise
        </span>
      </h3>
      <div slot="body">
        <div v-if="step==0">
          <b-form @submit.stop.prevent="onSubmit">
            <b-alert show variant="danger" v-if="connexionError">{{connexionError}}</b-alert>
            <v-row>
              <v-text-field label="Identifiant*" v-model="connIdentif" required></v-text-field>
            </v-row>
            <div v-if="errors.connexion.identif" class="validate">{{errors.connexion.identif}}</div>
            <v-row>
              <v-text-field type="password" v-model="connPassword" label="Mot de passe*" required></v-text-field>
            </v-row>
            <div v-if="errors.connexion.password" class="validate">{{errors.connexion.password}}</div>
            <v-row>
              <v-btn dark type="submit">
                Valider
              </v-btn>
            </v-row>
            <v-row>
              <v-col>
                <a style="color:green" @click="step=1">
                  inscription
                </a>
              </v-col>
              <v-col>
                <a style="color:green">
                  mot de passe oublié
                </a>
              </v-col>
            </v-row>
          </b-form>
        </div>

        <div v-if="step==1">
          <b-alert v-if="inscriptionError" variant="danger" show>{{inscriptionError}}</b-alert>
          <b-alert v-else-if="inscriptionSuccess" variant="success" show>{{inscriptionSuccess}}</b-alert>
          <b-form @submit.stop.prevent="inscrire">
          <v-row>
              <v-text-field label="Identifiant*" v-model="inscIdentif" required></v-text-field>
          </v-row>
          <div v-if="errors.inscription.identif" class="validate">{{errors.inscription.identif}}</div>
          <v-row>
            <v-text-field label="Email*" v-model="inscEmail" required></v-text-field>
          </v-row>
          <div v-if="errors.inscription.email" class="validate">{{errors.inscription.email}}</div>
          <v-row>
            <v-text-field label="Mot de passe*" v-model="inscPassword" type="password" required>
            </v-text-field>
          </v-row>
          <div v-if="errors.inscription.password" class="validate">{{errors.inscription.password}}</div>
          <v-row>
            <v-text-field label="Resaisir mot de passe*" v-model="inscPasswordVerrif" type="password" required></v-text-field>
          </v-row>
          <div v-if="errors.inscription.passwordVerrif" class="validate">{{errors.inscription.passwordVerrif}}</div>
          <v-row>
            <v-btn dark type="submit">
              Valider
            </v-btn>
          </v-row>
          </b-form>
        </div>
      </div>

    </Modal>

  </div>
</template>

<script>
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("header").style.top = "0";
    } else if(prevScrollpos <= currentScrollPos && window.scrollY>80) {
      document.getElementById("header").style.top = "-70px";
    }
    prevScrollpos = currentScrollPos;
}


// import ShoppingCard from '@/components/commun/ShoppingCard';
import Modal from '@/components/common/Modal';
require('dotenv').config()
// import Auth from '@/components/common/Auth';
export default{

  name:"Header",
  components: {
    // ShoppingCard,
    Modal,
    // Auth,
  },
  data() {
    return {
      step:0,
      //connect:false,
      tab: null,
      dialog:false,
      drawer:false,
      drawer2:false,
      menuInitial:[],
      searchItem:"",
      alertAuth:false,
      messages:19,
      menu: [
        { icon: "mdi-hanger", title: "Vetement" },
        { icon: "mdi-shoe-heel", title: "Chaussure" },
      ],
      category:[],
      toMatchDevice : [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPad/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i
      ],
      isMobile:false,
      action:"",
      notifs:[
        // {
        //     msg:"i like you dskhfgydsgfjgfys"
        // },
        // {
        //     msg:"me too dksgfyjsdfjshfushukdhfku"
        // },
      ],
      connIdentif:"",
      connPassword:"",

      inscIdentif:"",
      inscEmail:"",
      inscAddress:"",
      inscPassword:"",
      inscPasswordVerrif:"",

      inscriptionError:"",
      inscriptionSuccess:"",

      reg: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      errors:{
        connexion:{
          identif:"",
          password:""
        },
        inscription:{
          identif:"",
          email:"",
          address:"",
          password:"",
          passwordVerrif:"",
        }
      },
      connexionError:"",
    };

  },
  sockets:{
    // connect: function () {
    //         console.log('socket connected')
    // },
    // customEmit: function (data) {
    //         console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    // }
    notifReceived:function(data){
      console.log(data);
      this.notifs.unshift(data)
    }
  },

  props:[
    //'category'
    'notConnected'
  ],
  created() {
    //console.log(this.$route.query.connectModal)
    //window.location="match"
    if (this.$route.query.connectModal==true){
      this.alertAuth=true;
    }
    this.isMobile=this.detectMob()

    this.category=[

      {title:"Match"},
      {title:"Message"},

    ]
    this.action=""
    const query="http://localhost:3001/"+localStorage.getItem("userId")+"/notification";
    this.axios.get(query)
    .then((result)=>{
      console.log(result.data.res);
      this.notifs=result.data.res
    })

    // console.log(process.env)


  },

  methods: {
    notifsNoReaded(){
      var len=this.notifs.filter((element)=>{
        return element.readed==0;
      }).length
      return len;
    },

    detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    },
    logout(){
      const user={id:localStorage.getItem('userId')}
      // this.$emit('chat_with',-1)
      this.axios.post("http://localhost:3001/user/logout",user)
      .then((result)=>{
        console.log(result.data.res)
        if (result.data.res) {
          localStorage.removeItem('jwt')
          localStorage.removeItem('userId')
          window.location="/"

        }
      })
    },
    emitCategory(id){
      this.$emit('category_id', id)
    },

    onSubmit(){
      if(this.errors.connexion.identif=="" && this.errors.connexion.password=="")
      {
        console.log("submit")
        var user={identif:this.connIdentif,password:this.connPassword}
        this.axios.post("http://localhost:3001/user/auth",user).then((res)=>{
          //console.log(res);
          if (!res.data.error){
            console.log(res.data.access_token);
            if (res.data.confirmed_email==1) {
              localStorage.setItem('jwt',res.data.token)
              localStorage.setItem('userId',res.data.userId)
              window.location="/myProfile"
            }
            else {
              this.connexionError="Vous devez confirmer votre email!"
            }

          }
          else{
            console.log(res.data)
            this.connexionError=res.data.error
          }
        })
      }

    },
    dirige(){

      console.log("dirige")
      if(localStorage.getItem("jwt") == null)
        this.alertAuth=true;
      else
        window.location="/myProfile"
    },
    update(val){
      this.alertAuth=val;
    },
    // hidePopUp(){
    //   console.log("hidePopUp")
    //   this.alertAuth=false
    // },
    clickNotif(notifItem){
      // var id=localStorage.getItem("userId");
      // this.axios.post("http://localhost:3001/"+id+"/notification/readed",{id:notifId})
      // .then((result)=>{
      //   console.log(result);
      //
      // })
      console.log(notifItem.id);
      const notif={id:notifItem.id}
      const query="http://localhost:3001/user/"+localStorage.getItem("userId")+"/notification/readed";
      this.axios.post(query,notif)
      .then((result)=>{
        console.log(result.data.res);
        // this.notifs=result.data.res
        window.location="/profile/"+notifItem.from_user

      })

    },
    validateEmail(mail)
    {
      return this.reg.test(mail)
    },
    inscrire()
    {
      if(this.errors.inscription.identif=="" &&
          this.errors.inscription.email=="" &&
          this.errors.inscription.password=="")
      {
        console.log("inscrire!")
        var user={identif:this.inscIdentif,email:this.inscEmail,password:this.inscPassword}
        this.axios.post("http://localhost:3001/user/add",user).then((res)=>{
          if (!res.data.error){
            console.log(res.data.res);
            this.inscriptionSuccess=res.data.res
          }
          else{
            console.log(res.data)
            this.inscriptionError=res.data.error
          }
        })
      }
    }
  },
  watch: {
    connIdentif:function(val){
      //console.log(this.validateEmail(val))

      if(val=="")
        this.errors.connexion.identif="Ce champ est vide"
      else
        this.errors.connexion.identif=""
    },
    connPassword:function(val){
      if(val=="")
        this.errors.connexion.password="Ce champ est vide"
      else if(val.length<7)
        this.errors.connexion.password="Minimun 7 caractères!"
      else {
        this.errors.connexion.password=""
      }
    },
    inscIdentif:function(val){
      if(val=="")
        this.errors.inscription.identif="Ce champ est vide"
      else
        this.errors.inscription.identif=""
    },
    inscEmail:function(val){
      //console.log(this.validateEmail(val))

      if(val=="")
        this.errors.inscription.email="Ce champ est vide"
      else if(this.validateEmail(val)==false)
        this.errors.inscription.email="Vous devez remplir un email valide"
      else
        this.errors.inscription.email=""
    },
    inscPassword:function(val){
      // console.log('psw',val)
      if(val=="")
        this.errors.inscription.password="Ce champ est vide"
      else if(val.length<7)
      {
        this.errors.inscription.password="Minimun 7 caractères!"
        if(val!=this.errors.inscription.passwordVerrif)
          this.errors.inscription.passwordVerrif="Répétez le même mot de passe"
        else {
          this.errors.inscription.passwordVerrif=""
        }
      }


      else {
        this.errors.inscription.password=""
        if(val!=this.errors.inscription.passwordVerrif)
          this.errors.inscription.passwordVerrif="Répétez le même mot de passe"
        else {
          this.errors.inscription.passwordVerrif=""
        }
      }
    },
    inscPasswordVerrif:function(val){
      // console.log('pswVerrif',val)

      if(val=="")
        this.errors.inscription.passwordVerrif="Ce champ est vide"
      else if(val != this.inscPassword)
        this.errors.inscription.passwordVerrif="Répétez le même mot de passe"
      else {
        this.errors.inscription.passwordVerrif=""
      }
    }
  }
}
</script>

<style scoped>

.header{
  background-color: rgba(0, 0, 67);
  opacity: 0;
}

.header_text{
  opacity: 1;
}
a{
  text-decoration: none;
  color: white;
}
.notif{
    cursor: pointer;
}
.noRead{
  background-color: rgb(232, 234, 237);
}
.validate{
  color:red;
  font-size:10px;
}
</style>
