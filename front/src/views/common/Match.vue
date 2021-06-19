<template>

  <b-row id="match" style="padding-bottom:150px;">
    <b-col md="3">
      <v-card class="card">
        <div class="content">
          <div class="search"><strong>Recherche avancée</strong></div>
          <div class="">
            Je cherche
          </div>
          <b-row>
            <b-col>
              <v-card
              :class="['sex_bound','card',womanSelect?'colorNotSelect':'colorSelect']"
              @click="womanSelect= false"
              >
                <v-icon class="icon">mdi-human-male</v-icon>
              </v-card>
            </b-col>
            <b-col>
              <v-card
              :class="['sex_bound','card',womanSelect?'colorSelect':'colorNotSelect']"
              @click="womanSelect= true"
              >
                <v-icon class="icon">mdi-human-female</v-icon>
              </v-card>
            </b-col>
          </b-row>
          <div class="">
            Tranche d'âge
          </div><br>
          <div class="">
            <vue-slider v-model="ageValue" :min="18" :max="60"></vue-slider>
          </div><br>
          <div class="">
            Score de popularité
          </div><br>
          <div class="">
            <vue-slider v-model="scoreValue" :min="0" :max="200"></vue-slider>
          </div><br>

          <!-- <div class="">
            <vue-google-autocomplete
            id="map"
            :country="['fr']"
            placeholder="Saisissez une addresse"
            class="form-control"
            >
            </vue-google-autocomplete>
          </div> -->
          <div class="">
            Distance(en km)
          </div><br>
          <div class="">
            <vue-slider v-model="distanceValue" :max="200"></vue-slider>
          </div><br>
          <br>

          <multiselect v-model="chips"
                      :options="items"
                      :multiple="true"
                      :close-on-select="false"
                      :clear-on-select="false"
                      :preserve-search="true"
                      placeholder="Selectionnez des centres d'intérêts."
                      label="name" track-by="name"
                      :preselect-first="true"
          >
        </multiselect><br>
        </div>
      </v-card>
    </b-col>


    <b-col md="9">
      <div class="content">
        <span class="product_title">
          match
        </span>
        <br>
        <v-card class="card">
          <b-row>
            <b-col>
              <v-select
                v-model="filterByValue"
                :items="filterByItems"
                attach
                chips
                label="Trier par"
              ></v-select>
            </b-col>
          </b-row>
          <!-- <v-skeleton-loader :loading="true"> -->
          <b-row>
            <b-col v-for="(item, index) in OnePageProducts" :key="index" lg="3" md="4" sm="6">
              <v-card>
                <!-- <a href="http://localhost:8081/"> -->
                <v-img
                  :src="item.selectImg"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  style="max-height:300px;cursor:pointer;"
                  @click="redirectProfileOther(item)"
                >
                </v-img>
                <!-- </a> -->

                <v-card-text style="background-color:#e4e4e4;">
                  <div style="text-align: right;">
                    <span class="dot"></span> Online
                  </div>
                  <div>
                    <strong style="font-size:22px;">{{item.identif}} </strong>
                    <span>{{item.age +" ans"}}</span>
                  </div><br>
                  <hr>
                  <v-spacer></v-spacer>
                  <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
                  {{item.locality}} {{item.distance}}km
                </v-card-text>
              </v-card>
            </b-col>
          <!-- </v-skeleton-loader> -->
          </b-row>
          <div class="text-center pagination">
              <v-pagination
                v-model="currentPage"
                :length="size"
              >
            </v-pagination>
          </div>
        </v-card>
      </div>
    </b-col>

  </b-row>

</template>

<script>
// import VueGoogleAutocomplete from 'vue-google-autocomplete'
import Multiselect from 'vue-multiselect'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
export default{
  name:"Match",
  components: {
    // VueRangeSlider,
    // VueGoogleAutocomplete,
    // VuetifyGoogleAutocomplete,
    VueSlider,
    Multiselect,

  },
  props:[
    'list',
  ],
  data () {
    return {
      usersConst:[],
      currentPage:1,
      exampleItems:[],
      filterByValue:"",
      filterByItems:["Age croissant","Age décroissant","Le plus proche","Le plus popolaire","nombre centre intéret en commun"],
      filterOptions:[],
      allProducts:[],
      OnePageProducts:[],
      size:0,
      withPromo:false,
      womanSelect:0,
      ageValue: [18, 60],
      scoreValue:[0,200],
      distanceValue:50,
      chips: [],
      items: [],
      address: '',
      users:[],
      position:{},
      taggeds:[],
    }
  },

  created() {
    this.getTaggeds();
    this.getTags();
    console.log("process.env:",process.env);
    this.getCoordinates()
    .then((position) => {
      this.position=position
      console.log("this.position",this.position);
      this.axios.post("http://localhost:3001/user/list",{id:localStorage.getItem("userId")})
      .then((result)=>{
        console.log(result.data.res);
        this.users=result.data.res;
        this.usersConst=result.data.res;

        // this.updatePage();
        this.ageMin = 18
        this.ageMax = 60
        this.scoreMin=0
        this.scoreMax=200
        this.enableCross = false
        this.tooltipMerge = false
        // if (position==null)
        // {
          this.axios.get("http://localhost:3001/user/"+ localStorage.getItem("userId") +"/get")
          .then((user)=>{
            console.log("user:",user);
            if (position==null)
              this.position={latitude:user.latitude,longitude:user.longitude}
            console.log("this.position:",this.position);
            Array.from(this.users, (item)=>{
              item.distance=this.getDistance(this.position.coords,
                                    {latitude:item.latitude,longitude:item.longitude})
              item.distance=item.distance.toFixed(2)
            })
            this.filterUser();
          })
        // }
        // Array.from(this.users, (item)=>{
        //   item.distance=this.getDistance(this.position.coords,
        //                         {latitude:item.latitude,longitude:item.longitude})
        //   item.distance=item.distance.toFixed(2)
        // })
        // this.filterUser();
      })
    })
    .catch((err) => {
      console.log("get position failed");
      console.error(err.message);
      this.axios.get("http://localhost:3001/user/"+ localStorage.getItem("userId") +"/get")
      .then(()=>{

      })
    });


    console.log("created users:",this.users);





  },

  methods: {
    setSearch(position){
      this.position=position
      console.log("this.position",this.position);
      this.axios.post("http://localhost:3001/user/list",{id:localStorage.getItem("userId")})
      .then((result)=>{
        console.log(result.data.res);
        this.users=result.data.res;
        this.usersConst=result.data.res;

        // this.updatePage();
        this.ageMin = 18;
        this.ageMax = 60;
        this.scoreMin=0;
        this.scoreMax=200;
        this.enableCross = false;
        this.tooltipMerge = false;

        Array.from(this.users, (item)=>{
          item.distance=this.getDistance(this.position.coords,
                                {latitude:item.latitude,longitude:item.longitude})
          item.distance=item.distance.toFixed(2)
        })
        this.filterUser();
      })



    },

    redirectProfileOther(item){
      console.log("redirectProfileOther");
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


    ageSortAsc(){
      console.log("ageSortAsc");
      this.users=this.users.sort((a,b)=>{
        return a.age-b.age
      })
      console.log("this.users",this.users);

    },
    ageSortDesc(){
      console.log("ageSortDesc");
      this.users=this.users.sort((a,b)=>{
        return b.age-a.age
      })
      console.log("this.users",this.users);
    },
    distanceSortAsc(){
      console.log("diatanceSortAsc");
      this.users=this.users.sort((a,b)=>{
        return a.distance-b.distance
      })
      console.log("this.users",this.users);
    },

    scoreSortDesc(){
      console.log("scoreSortDesc");
      this.users=this.users.sort((a,b)=>{
        return b.pop_score-a.pop_score
      })
      console.log("this.users",this.users);
    },
    numberCommonElements(a,b){
      const list=a.filter((el)=>{
        return b.includes(el)
      })
      console.log("list.length:",list.length);
      return list.length
    },
    defineList(arr){
      var list=[];
      arr.forEach((item) => {
        list.push(item.tag_id)
      });
      console.log("list:",list);
      return list;
    },

    tagSortDesc(){
      const userId=localStorage.getItem("userId")
      console.log("userId:",userId);

      this.users.sort((a,b)=>{
        var first=this.taggeds.filter((el)=>{
          return el.user_id==a.id;
        })
        var first_list=this.defineList(first)

        var second=this.taggeds.filter((el)=>{
          return el.user_id==b.id;
        })
        var second_list=this.defineList(second)

        var user=this.taggeds.filter((el)=>{
          return el.user_id==userId;
        })
        var user_list=this.defineList(user)

        const x=this.numberCommonElements(first_list,user_list)
        const y=this.numberCommonElements(second_list,user_list)
        console.log("x:",x);
        console.log("y:",y);
        return y-x;

      })
      // this.taggeds.
    },

    sortUser()
    {
      if (this.filterByValue=="Age croissant") {
        this.ageSortAsc()
      }
      else if (this.filterByValue=="Age décroissant") {
        this.ageSortDesc()
      }
      else if (this.filterByValue=="Le plus proche") {
        this.distanceSortAsc()
      }
      else if (this.filterByValue=="Le plus popolair") {
        this.scoreSortDesc()
      }
      else if (this.filterByValue=="nombre centre intéret en commun") {
        this.tagSortDesc()
      }
    },

    async getAddress() {
      const position = await this.getCoordinates();
      this.position = position;
      Array.from(this.users, (item)=>{
        item.distance=this.getDistance(this.position.coords,
                              {latitude:item.latitude,longitude:item.longitude})
        item.distance=item.distance.toFixed(2)
      })
      console.log("this.position:",this.position);
      console.log("this.users:",this.users);

    },
    getCoordinates() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    updatePage(){
      this.size=Math.ceil(this.users.length/12);
      this.OnePageProducts=this.users.slice(0,12)
    },
    bySex(arr){
      console.log("bySex");
      const users=arr.filter((item) => {
        return item.sex==this.womanSelect;
      });
      return users;
    },
    byAge(arr){
      console.log("byAge");
      const users=arr.filter((item) => {
        var minVal=this.ageValue[0]<this.ageValue[1]?this.ageValue[0]:this.ageValue[1]
        var maxVal=this.ageValue[0]<this.ageValue[1]?this.ageValue[1]:this.ageValue[0]
        return item.age>=minVal && item.age<=maxVal;
      });
      return users;
    },
    byScore(arr){
      console.log("byScore");
      const users=arr.filter((item) => {
        var minVal=this.scoreValue[0]<this.scoreValue[1]?this.scoreValue[0]:this.scoreValue[1]
        var maxVal=this.scoreValue[0]<this.scoreValue[1]?this.scoreValue[1]:this.scoreValue[0]
        return item.pop_score>=minVal && item.pop_score<=maxVal;
      });
      return users;
    },
    byDistance(arr){
      console.log("byDistance");
      const users=arr.filter((item) => {
        return item.distance<=this.distanceValue
      });
      return users;
    },
    byHoobbie(arr){
      console.log("byHoobbie");
      // console.log("this.chips:",this.chips);
      console.log("users:",arr);
      const users=arr.filter((item) => {
        // console.log("tagged before:",this.taggeds);
        var taggeds_st=this.taggeds.filter((tagged)=>{
          // console.log("for this.taggeds");
          var chip=this.chips.find((chip)=>{

            // console.log("\n(chip.id:",chip.id);
            // console.log("tagged.tag_id:",tagged.tag_id+")\n");
            return chip.id==tagged.tag_id;
          })
          // console.log("chip:",chip);
          return chip != null
        })
        var tagged=taggeds_st.find((tagged)=>{
          return tagged.user_id==item.id
        })
        return tagged!=null
      });
      return users;
    },
    filterUser(){

      var arr=this.bySex(this.usersConst)
      arr=this.byAge(arr)
      arr=this.byScore(arr)
      arr=this.byDistance(arr)
      arr=this.byHoobbie(arr)
      this.users=arr
      this.sortUser();
      this.updatePage();

    },
    getTags(){
      this.axios.get("http://localhost:3001/tag/listTag")
      .then((result)=>{
        // console.log(result.data.res);
        // this.items=result.data.res
        this.chips=this.items=result.data.res
      })
    },
    getTaggeds(){
      this.axios.get("http://localhost:3001/tagged/listTagged")
      .then((result)=>{
        console.log("tagged",result.data.res);
        this.taggeds=result.data.res
        // this.items=result.data.res

      })
    },
    rad(x) {
      return x * Math.PI / 180;
    },

    getDistance(p1, p2) {
      console.log("p1:",p1);
      p2.latitude=parseFloat(p2.latitude)
      p2.longitude=parseFloat(p2.longitude)
      console.log("p2:",p2);
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = this.rad(p2.latitude - p1.latitude);
      var dLong = this.rad(p2.longitude - p1.longitude);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(p1.latitude)) * Math.cos(this.rad(p2.latitude)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c / 1000;

      return d; // returns the distance in kilometer
    },

    getAddressData: function (addressData, placeResultData, id) {
                this.address = addressData;
                console.log(placeResultData,id)
    },
  },

  watch:{
    currentPage:function (val) {
      var fist=12*(val-1);
      var last=fist+12
      this.OnePageProducts=this.allProducts.slice(fist,last)
      //console.log(this.OnePageProducts)
    },
    womanSelect:function () {
      this.filterUser();
    },
    ageValue:function () {
      this.filterUser();
    },
    scoreValue:function () {
      this.filterUser();
    },
    distanceValue:function () {
      this.filterUser();
    },
    chips:function () {
      this.filterUser();
    },
    filterByValue:function(){
      this.filterUser();
    }
  }
}
</script>

<style scoped>
.content{
  //background-color: #f7f7f7;
  margin-top:60px;
  margin-left: 20px;
}

.card{
  //min-height: 600px;
  padding-left: 15px;
  padding-right: 15px;
}

.product_title{
    margin: 0;
    font-size: 36px;
    line-height: 60px;
    font-weight:bold;
}
.dot {
  height: 10px;
  width: 10px;
  background-color: #0b0;
  border-radius: 50%;
  display: inline-block;
}

.search{
  text-align: center;
  font-size: 20px;

}

.sex_bound{
  //background-color: #aeaeae;
  text-align: center;
  cursor: pointer;
}

.icon{
  font-size: 30px;
}
.card{
  //padding: 10px 10px 10px 10px;
  padding-left: 10px;
  padding-right: 10px;
}
hr.style-one {

  border: 0;

  height: 1px;

  background: #333;

  background-image: linear-gradient(to right, #ccc, #333, #ccc);

}
.colorSelect{
  background-color: #e01f4d;
}
.colorNotSelect{
  background-color: #aeaeae;
}
</style>
