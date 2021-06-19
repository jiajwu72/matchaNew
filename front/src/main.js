
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
//import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(require('vue-cookies'))
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSocketIO from 'vue-socket.io'
import Chat from 'vue-beautiful-chat'
import * as VueGoogleMaps from 'vue2-google-maps';
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';
Vue.use(Chat)

// VueGoogleMaps.loaded.then(() => {
//            var map = new google.maps.Map(document.getElementById('map'))
//         })

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3001',
    vuex: {
        // store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },

}))
require('dotenv').config()

// import 'vue-suggestion/dist/vue-suggestion.css';

// es2015 module
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// set default config
Vue.$cookies.config('7d')

// set global cookie
Vue.$cookies.set('theme','default');
Vue.$cookies.set('hover-time','1s');

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.use(router)
Vue.use(VueRouter)

Vue.use(VueGoogleMaps,
  {
    load: {
      key: 'AIzaSyBvq0zBoCt1a14pp8hGfYf9HRPM81DEx4k',
      libraries: 'places', // This is required if you use the Autocomplete plugin
    },
  }
)
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: "AIzaSyBvq0zBoCt1a14pp8hGfYf9HRPM81DEx4k", // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  vueGoogleMapsCompatibility: true, // Optional (default: false) - true, requires vue2-google-maps to be configured see https://github.com/xkjyeah/vue-google-maps
});

new Vue({
  el:'#app',
  router,
  vuetify,
  render:h=>h(App)
})
