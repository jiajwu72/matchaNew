//import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/common/Home'
import Match from '@/views/common/Match'
import ProfileOther from '@/views/common/ProfileOther'
import ProfileUser from '@/views/common/ProfileUser'
import Reset from '@/views/common/Reset'
import Confirm from '@/views/common/ConfirmMail'
import AuthMiddleware from '@/middleware/auth'


const router= new Router({
  routes:[
    {
      path:'/',
      name:'Home',
      component:Home,
      // meta: {
      //   // requiresAuth: true
      // }
    },
    {
      path:'/match',
      name:'match',
      component:Match,
      meta: {
        requiresAuth: true
      }
    },
    {
      path:'/profile/:id',
      name:'profileOther',
      component:ProfileOther,
      meta: {
        requiresAuth: true
      }
    },
    {
      path:'/myProfile',
      name:'myProfile',
      component:ProfileUser,
      meta: {
        requiresAuth: true
      },
    },
    {
        path:'/reset/:token',
        name:'reset',
        component:Reset,
    },
    {
        path:'/confirmMail/:token',
        name:'confirm',
        component:Confirm,
    },
  ],
  mode:'history',
})
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//
//     if (localStorage.getItem("jwt") == null) {
//       next({
//         path: "/match"
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });
router.beforeEach(AuthMiddleware)
export default router;
