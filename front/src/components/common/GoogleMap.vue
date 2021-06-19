<template>
  <div>
    <v-card :color="'beige'" class="card_box">

      <GmapMap
          :center="position"
          :zoom="12"
          map-type-id="terrain"
          style="width: auto; height: 400px"
      >
      <GmapMarker ref="myMarker"
      :position="position" />
        <!-- :position="{lat:49.0954795, lng:2.7483926}" /> -->
      </GmapMap>
    </v-card>
  </div>
</template>

<script>
  // import Card from '@/components/commun/Card';
  // import {gmapApi} from 'vue2-google-maps'
  export default{
    name:"GoogleMap",
    // components:{
    //   Card,
    // },
    props: ['position'],


    computed: {
      // google: gmapApi
    }
  }
</script>
<style scoped>
.card_box{
  -webkit-transition-duration: 1s;
  -moz-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  opacity: 0.7;
}
.card_box:hover{
  opacity: 1;
}
</style>
