<template id="">
  <v-container>
    <v-card style="width:100%;padding:10px;" v-if="token_valid">
      <h2>Réinitialisation de mot de passe</h2>
      <b-form @submit.stop.prevent="reset">
        <b-alert variant="danger" v-if="reset_error" show>{{reset_error}}</b-alert>
        <b-alert variant="success" v-if="reset_success" show>{{reset_success}}</b-alert>
        <b-row>
          <b-col md="12">
            <v-text-field
              v-model="password"
              type="password"
              label="Veuillez rentrer nouveau mot de passe"
              required
            ></v-text-field>
          </b-col>
          <b-col md="12">
            <v-text-field
              v-model="passwordVerrif"
              type="password"
              label="Répétez le mot de passe"
              required
            ></v-text-field>
          </b-col>
          <b-col md="3">
            <b-button variant="primary" type="submit">Valider</b-button>
          </b-col>
        </b-row>
      </b-form>
    </v-card>
    <v-card style="width:100%;padding:10px;" v-else>
      <b-alert variant="danger" show>{{token_faile_msg}}</b-alert>
      <!-- <b-button variant="primary">Retour</b-button> -->
    </v-card>
  </v-container>
</template>

<script>
export default{
  name:"Reset",
  components: {
    // VueGoogleAutocomplete
  },
  props: [],
  data () {
    return {
      token_valid:false,
      token_faile_msg:"",
      success_msg:"",
      reset_error:"",
      reset_success:"",
      password:"",
      passwordVerrif:"",
    }
  },

  created() {
    // console.log('route', this.$route.params.toke);
    this.axios.get("http://localhost:3001/user/reset/"+this.$route.params.token)
    .then((result)=>{
      if(result.data.res){
        this.token_valid=result.data.res;
      }
      else {
        this.token_faile_msg=result.data.error
      }
      console.log(result);
    })
    .catch((e)=>{
      console.log(e.data);
      // this.token_faile_msg=e
    })
  },

  methods: {
    reset(){
      if(this.password==this.passwordVerrif)
      {
        const user={id:localStorage.userId,password:this.password}
        console.log(user);
        this.axios.post("http://localhost:3001/user/reset/"+this.$route.params.token,user)
        .then((result)=>{
          if(result.data.res){
            this.token_valid=true;
            this.reset_success=result.data.res
            this.token_faile_msg=""
            window.location="/"
            localStorage.removeItem("userId")
            localStorage.removeItem("jwt")
          }
          else {
            this.token_faile_msg=result.data.error
            this.reset_success=""
          }
          console.log(result);
        })
        .catch((e)=>{
          console.log(e.data);
          // this.token_faile_msg=e
        })
      }else {
        this.reset_error="Répétez meme mot de passe!"
      }

    }
  }
}
</script>

<style scoped>

</style>
