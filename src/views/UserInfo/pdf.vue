<template>
  <div class="outBox">
    <div id="demo"></div>
    <van-button type="info" round class="button" @click="back">返回</van-button>
  </div>
</template>
<script>
  import Pdfh5 from 'pdfh5';
  import axios from 'axios';
  export default {
    name: 'App',
    data() {
      return {
        pdfh5: null
      };
    },
    mounted() {
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      console.log("this.$store.state.agreement",this.$store.state.agreement)

      // axios.get('http://zlhjapp.gz2vip.idcfengye.com/fileManage/getFile?type=pdf&fileCode=e59107a7c904446eb1c0457e7e9286fa' ,{
      axios.get(this.$store.state.agreement ,{
        responseType: 'arraybuffer'
      })
        .then(res => {
          console.log(res.data)
          toast.clear();
          this.pdfh5 = new Pdfh5('#demo', {
            data: res.data
          });
        });
    },
    methods:{
      back(){
        this.$router.go(-1)
      }
    }
  };
</script>

<style scoped>
  .outBox{
    position: relative;
  }
  .button{
    position: fixed;
    width: 80%;
    bottom: 2%;
    left: 10%;
  }
</style>
