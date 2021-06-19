<template id="">
  <div class="">
    <v-container>

      <v-row>
        <v-card style="width:100%;padding:10px;">

          <b-row>
            <b-col md="6">
              <h2>
                  <b-avatar button  :src="profilImg"></b-avatar>
                  Mes informations
              </h2>
            </b-col>
            <b-col md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
              <b-button v-b-modal.modal-2 variant="primary">Modifier Email</b-button>

            </b-col>
            <b-col md="4" v-for="(item, index) in images" :key="index">

              <v-card>
              <label for="image">
                  <b-img :src="item" thumbnail fluid alt="Fluid image" class="img">
                  </b-img>
               </label>
               <v-card-actions>
                  <b-form id='test-form' action="http://localhost:3001/upload" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="userId" :value="userId">
                    <input type="hidden" name="imgIndex" :value="index+1">
                    <input type="hidden" name="alea" value="alea">
                    <input type="file" name="image" accept="image/*" class="form-control">
                    <b-button variant="primary" type="submit" style="margin-top:10px;">Upload</b-button>
                    <!-- <b-button variant="primary" type="submit" style="margin-top:10px;">Upload</b-button> -->
                    <b-button variant="primary" @click="defineProfil(item)" style="margin-top:10px;margin-left:20px;">Définir comme profil</b-button>
                  </b-form>
               </v-card-actions>
              </v-card>
            </b-col>
          </b-row>
          <b-alert v-if="modifSuccess" variant="success" show>{{modifSuccess}}</b-alert>
          <b-form @submit.stop.prevent="modif">
            <b-row>
              <b-col md="6">
                <v-text-field
                  v-model="lastName"
                  :rules="nameRules"
                  :counter="15"
                  label="Prénom"
                  required
                ></v-text-field>
              </b-col>
              <b-col md="6">
                <v-text-field
                  v-model="firstName"
                  :rules="nameRules"
                  :counter="15"
                  label="Nom"
                  required
                ></v-text-field>
              </b-col>
              <b-col md="6">
                <v-text-field
                  v-model="age"
                  label="Âge"
                  type=number
                  required
                ></v-text-field>
              </b-col>
              <b-col md="6">
                <v-select v-model="sex" :items="['masculin','féminin']" label="Sex" required>
                </v-select>
              </b-col>

              <b-col md="6">
                <v-select v-model="orientation_sex" :items="['masculin','féminin']" label="Orientation sexuelle" required>
                </v-select>
              </b-col>
              <b-col md="12">
                <v-textarea
                  background-color="light-blue"
                  color="black"
                  label="BIOGRAPHE"
                  v-model="biographe"
                ></v-textarea>
              </b-col>
              <b-col md="12">
                <b-button size="lg" text="Button" variant="success" type="submit">Modifier</b-button>
              </b-col>
              <b-col md="12">
                <strong>score de popularité:</strong> <span style="float:right;">{{popScore}}</span>
              </b-col>
            </b-row>
          </b-form>
        </v-card>
      </v-row>

      <v-row style="margin-top:15px;">
        <v-card style="width:100%;padding:10px;">
          <h2>Address</h2>
          <b-alert v-if="modifAddrSuccess" variant="success" show>{{modifAddrSuccess}}</b-alert>
          <!-- <vue-google-autocomplete
            placeholder="Saisissez votre localisation"
            id="map"
            :country="['fr']"
            class="form-control"
            v-on:placechanged="getAddressData">
          </vue-google-autocomplete> -->

          <vuetify-google-autocomplete
            ref="address"
            id="map"
            classname="form-control"
            placeholder="Saisissez votre localisation"
            v-on:placechanged="getAddressData"
            country="fr"
            >
            <template #append>
                <!-- my fancy component rather than a simple icon -->
                <my-btn/>
            </template>
        </vuetify-google-autocomplete>

          <GoogleMap
          :position="position">
          </GoogleMap>
        </v-card>
      </v-row>

      <v-row style="margin-top:15px;">
        <v-card style="width:100%;padding:10px;">
          <h2>TAGS</h2>
          <multiselect v-model="tagsSelected"
                      :options="tagsItems"
                      :multiple="true"
                      :close-on-select="false"
                      :clear-on-select="false"
                      :preserve-search="true"
                      placeholder="Ajoutez des centres d'intérêts."
                      label="name" track-by="name"
                      :preselect-first="true"
                      @select="addTag"
                      @remove="deleteTag"
          >
          </multiselect>
        </v-card>
      </v-row>
      <v-row style="margin-top:15px;">
        <v-card style="width:100%;padding:10px;">
          <h2>Confidentialité</h2>
          <!-- v-for ici -->
          <b-button variant="danger" style="margin-right:20px;" @click="logout">Log out</b-button>
          <b-button v-b-modal.modal-1 variant="primary">Changer Mot de passe</b-button>
        </v-card>
      </v-row>
      <v-row style="margin-top:15px;">
        <v-card style="width:100%;padding:10px;">
          <h2>Visiteurs</h2>

          <!-- v-for ici -->
          <!-- src="https://placekitten.com/300/300" -->
          <b-avatar button
                    v-for="(item, index) in visitors" :key="index"
                    @click="profileOther(item)"
                    :src="item.selectImg">
          </b-avatar>
        </v-card>
      </v-row>
    </v-container>

    <b-modal id="modal-1" title="Changer votre mot de passe" hide-footer>
      <b-row>
        <b-alert v-if="mailSendSuccess" variant="success" show style="margin-left:15px;">{{mailSendSuccess}}</b-alert>
        <b-col md="12">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Saisissez votre email pour réinitialiser"
            required
          ></v-text-field>
        </b-col>
        <b-col md="3">
            <b-button variant="primary" @click="changepwd">envoyer</b-button>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal id="modal-2" title="Changer votre Email" hide-footer>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
        required
      ></v-text-field>
      <b-button variant="primary" @click="changeEmail">Valider</b-button>
    </b-modal>
  </div>
</template>

<script>
// import VueSuggestion from 'vue-suggestion'
//import VueGoogleAutocomplete from 'vue-google-autocomplete'
import Multiselect from 'vue-multiselect'
import GoogleMap from '@/components/common/GoogleMap';
import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete"
export default{
  name:"ProfileUser",
  components: {
    //VueGoogleAutocomplete,
    GoogleMap,
    Multiselect,
    VuetifyGoogleAutocomplete
  },
  props: [],
  data () {
    return {
      age:18,
      email:"",
      orientation_sex:"",
      biographe:"",
      popScore:"",
      profilImg:"",
      userId:-1,
      selectedImgIndex:-1,
      selectedImg:null,
      modifSuccess:"",
      modifAddrSuccess:"",
      mailSendSuccess:"",
      tagsItems: [],
      search: '',
      value: [],
      isUpdating:false,
      sex:"",
      tagsSelected:[],
      lastName:"",
      firstName:"",
      address:"",
      locality:"",
      latitude:0,
      longitude:0,
      position:{},
      visitors:[],
      addressRules: [
        v => !!v || 'Ce champ doit être remplis',
      ],
      nameRules: [
        v => !!v || 'Ce champ doit être remplis',
        v => v.length <= 15 || 'il doit comporter au maximun 15 caractères',
      ],
      // email: '',
      emailRules: [
        v => !!v || 'Ce champ doit être remplis',
        v => /.+@.+/.test(v) || 'E-mail doit être requis',
      ],
      chips:{
        nourriture:true,
        sport:true,
        voyage:true,
      },

      images:[],
    }
  },
  
  created() {
    //this.$refs.address.focus();
    const id=localStorage.getItem("userId")
    this.userId=id;
    this.getTags();
    this.getTagMatch();
    //this.address = "paris"
    this.axios.get("http://localhost:3001/user/"+id+"/get")
    .then((result)=>{
      console.log("result",result.data.res)
      result=result.data.res
      this.address = result.locality
      this.email=result.email
      this.firstName=result.first_name
      this.lastName=result.last_name
      this.sex=result.sex==0?"masculin":"féminin"
      this.images[0]=result.img1
      this.images[1]=result.img2
      this.images[2]=result.img3
      this.images[3]=result.img4
      this.images[4]=result.img5
      this.age=result.age
      this.profilImg=result.selectImg
      this.popScore=result.pop_score
      this.biographe=result.biographe
      this.locality=result.locality
      this.code_postal=result.postal_code
      this.latitude=result.latitude
      this.longitude=result.longitude
      this.orientation_sex=result.orientation==0?"masculin":"féminin"
      this.position={lat:parseFloat(this.latitude),lng:parseFloat(this.longitude)}
      console.log("this.position:",this.position);
      this.axios.post("http://localhost:3001/action/listActionArray",{to_user:id,table:"consulted"})
      .then((result)=>{
        console.log(result.data.res);
        this.visitors=result.data.res

      })
    })
  },

  methods: {
    getAddressData(e){
      console.log(e);
      const user={id:localStorage.getItem('userId')};
      user.locality=e.name
      user.code_postal=e.postal_code
      user.latitude=e.latitude
      user.longitude=e.longitude
      this.axios.post("http://localhost:3001/user/"+user.id+"/update",user)
      .then((result)=>{
        console.log(result);
        this.modifAddrSuccess=result.data.msg
        //location.reload();
      })
      .catch((e)=>{
        console.log(e);
      })
    },

    logout(){
      const user={id:localStorage.getItem('userId')}
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

    getTags(){
      this.axios.get("http://localhost:3001/tag/listTag")
      .then((result)=>{
        // console.log(result.data.res);
        this.tagsItems=result.data.res
      })
    },
    getTagMatch(){
      const query="http://localhost:3001/tag/getMatch/"+this.userId;
      console.log(query);
      this.axios.get(query)
      .then((result)=>{
        console.log(result.data.res);
        this.tagsSelected=result.data.res
      })
    },
    modif(){
      // if(this.modifValid()){
        const id=localStorage.getItem('userId')
        const sex=this.sex=="masculin"?0:1;
        const orientation=this.orientation_sex=="masculin"?0:1;
        const user={
          id:id,sex:sex,last_name:this.lastName,first_name:this.firstName,
          biographe:this.biographe,orientation:orientation,age:this.age
        };
        console.log(user);
        this.axios.post("http://localhost:3001/user/"+id+"/update",user)
        .then((result)=>{
          console.log(result);
          this.popScore=result.data.user.pop_score
          this.modifSuccess=result.data.msg
          // location.reload();
        })
        .catch((e)=>{
          console.log(e);
        })
      // }

    },
    changepwd(){
      console.log("changepwd");
      this.axios.post("http://localhost:3001/user/forgot",{email:this.email})
      .then((result)=>{
        console.log(result.data)
        this.mailSendSuccess=result.data.success
        window.location="/myProfile"
      })
      .catch((e)=>{
        console.log(e);
      })
    },
    profileOther(item){
      this.axios.post("http://localhost:3001/consulted",
      {
        from_user:localStorage.getItem("userId"),
        to_user:item.id,
      })
      .then((result)=>{
        console.log(result);
        window.location="/profile/"+item.id
      })
      .catch((e)=>{
        console.log(e);
      })
    },
    defineProfil(item){
      this.selectImg=item
      const request={id:this.userId,selectImg:this.selectImg}
      console.log(request);
      this.axios.post("http://localhost:3001/user/"+this.userId+"/defineProfil",request)
      .then((result)=>{
        console.log(result);
        window.location="/myProfile"
      })
    },
    addTag(e){
      console.log("addTag:",e);
      this.axios.post("http://localhost:3001/tag/matchUser",{tag_id:e.id,user_id:this.userId})
      .then((result)=>{
        console.log("results:",result);
        // this.tagsItems=result
      })
      .catch((e)=>{
        console.log("error",e);
      })
    },
    deleteTag(e){
      console.log("deleteTag:",e);
      const tagged={tag_id:e.id,user_id:this.userId}
      console.log("tagged:",tagged);
      this.axios.delete("http://localhost:3001/tag/deleteMatch",{data:tagged})
      .then((result)=>{
        console.log("results:",result);
        // this.tagsItems=result
      })
      .catch((e)=>{
        console.log("error",e);
      })
    },
    changeEmail(){
      const id=localStorage.getItem('userId')
      const user={id:id,email:this.email}
      this.axios.post("http://localhost:3001/user/"+id+"/updateEmail",user)
      .then((result)=>{
        console.log(result);
        // localStorage.removeItem('jwt')
        // localStorage.removeItem('userId')
        // window.location="/"
        // location.reload();
      })
      .catch((e)=>{
        console.log(e);
      })
    }
  }
}

</script>

<style scoped>
.btnP{
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

.img{
  cursor: pointer;
  /* width: 100%; */
}


</style>
