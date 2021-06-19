<template>
  <Frame1 :chat_with_user="chat_user">
    <router-view @chat_with="chat_with_user"></router-view>
  </Frame1>
</template>

<script>
import Frame1 from './components/common/Frame1';
export default {
  name: 'App',
  components: {
    //HelloWorld,
    Frame1,
  },
  data: () => ({
    chat_user:-1,
  }),
  methods: {
    chat_with_user(e) {
      // console.log(e);
      this.chat_user=e;
      // this.$set("chat_user",e)
      console.log(this.chat_user);
    }
  },
};
</script>
