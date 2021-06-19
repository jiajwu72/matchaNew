
<template>
  <div class="">
    <v-carousel
      cycle
      height="770"
      hide-delimiter-background
      :show-arrows="false"
      style="max-height:600px;"
      reverse-transition="fade-transition"
      transition="fade-transition"
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
        :src="slides[i].src"
        class="bloc"
      >
      </v-carousel-item>
    </v-carousel>
  </div>



</template>

<script>
  export default {
    name:"Carousel",
    props: ['slides'],
    data () {
      return {
        isMobile:false,
      }
    },
    created() {
      console.log("Carousel");
      console.log(this.slides);
      this.isMobile=this.detectMob();
      console.log(this.isMobile)
    },

    methods: {
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
      redirige(){
        window.location="/products?promo=true"
      }
    }

  }
</script>
<!-- <script src="../../../public/js/jquery-1.11.0.min.js"></script>
<script src="../../../public/js/jquery.firefly-0.7.min.js"></script>
<script type="text/javascript">
</script> -->

<style scoped>
@import '/css/normalize.css';
@import '/css/style.css';
/* Commun */
.bloc{
  display: flex;
  height: 770px;
  position: relative;
}

.content{
  //border: 3px yellow solid;
  margin:0 auto;
  width: 100%;
  position: absolute;
  top: 50%;
  //margin: -50px 0 0 0;
  //line-height: 100px;
  transform: translateY(-50%);

}

label{
  font-size: 20px;
  font-family: NeueHelveticaforZara-BoldCn,Arial,sans-serif;
  color:white;
  font-weight: bold;
  line-height: 40px;

}
.vetical-middle{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin:0 auto;
}

.bigTitle{
  font-size:40px;
}

*{
  /* color: white; */
}

a{
  text-decoration: none;
  cursor:pointer;
}
.col{
  display: flex;
}


</style>
