<template>
  <div>
    <h3 slot="header">Connexion</h3>
    <div slot="body">

      <v-row>
        <v-text-field label="Email*" required></v-text-field>
      </v-row>
      <v-row>
        <v-text-field label="Mot de passe*" required></v-text-field>
      </v-row>
      <v-row>
        <v-btn dark>
          Valider
        </v-btn>
      </v-row>
      <v-row>
        <v-col>
          <a style="color:green">
            inscription
          </a>
        </v-col>
        <v-col>
          <a style="color:green">
            mot de passe oublié
          </a>
        </v-col>
      </v-row>
    </div>
  </div>

</template>

<script>

export default{
  //import Carousel from '@/components/commun/Carousel';
  name:"Auth",
  components:[

  ],
  props:[

  ],
  data () {
    return {

    }
  },
  created() {

  },

  methods: {

  }

}
</script>

<style scoped>

</style>
