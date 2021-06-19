<template id="">
  <v-container>
    <h2>Activation de votre Compte</h2>
    <v-card style="width:100%;padding:10px;" v-if="token_success_msg">
      <b-alert variant="success" show>{{token_success_msg}}</b-alert>
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
      token_success_msg:"",

    }
  },

  created() {
    console.log('route', this.$route.params.token);

    this.axios.post("http://localhost:3001/user/confirmMail/"+this.$route.params.token)
    .then((result)=>{
      if(result.data.res){
        this.token_success_msg=result.data.res;
      }
      else {
        this.token_faile_msg=result.data.error
      }
      console.log(result);
    })
    .catch((e)=>{
      console.log(e.data);
    })
  },

  methods: {


  }
}
</script>

<style scoped>

</style>
