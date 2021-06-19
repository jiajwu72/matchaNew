<template>

  <div>

    <!-- <Carousel :slides="slidesItem" >
    </Carousel> -->
    <!-- <v-parallax src="/images/bg1.jpg" height=900></v-parallax> -->
    <v-img src="/images/bg1.jpg">
      <!-- <v-dialog v-model="connect">

      </v-dialog> -->
      <div class="bg">
        <strong style="font-size:50px;color:white;">
          Match your love partner
        </strong><br><br><br><br>
        <v-btn icon @click="go">
          <v-icon style="font-size:80px;cursor:pointer;color:#EA1713;">mdi-hand-heart</v-icon>
        </v-btn>
      </div>

    </v-img>

  </div>

</template>

<script>

   // import Carousel from '@/components/common/Carousel';
   // import GoogleMap from '@/components/commun/GoogleMap';
   // import Card from '@/components/commun/Card';

  export default{
    name:"Home",
    components:{
       // Carousel,
       // GoogleMap,
       // Card,
    },
    // props:[
    //   //'category'
    //   'notConnected'
    // ],
    data() {
      return{
        connect:false,

      }
    },

    created() {
      console.log("notConnected:",this.notConnected)
      //localStorage.removeItem('jwt')
    },

    methods: {
      go(){
        window.location="/match"
      }
    },
  }
</script>

<style scoped>
.bg{
  /* background-color: green; */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}


</style>
