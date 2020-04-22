<template>
  <div class="pdf">
    <pdf
      ref="pdf"
      :src="pdfUrl"
      @loaded="loadPdfHandler">
    </pdf>
    <div class="bottom-btn" >
      <van-button round block type="info" @click="toSignature">签名</van-button>
    </div>

  </div>
</template>

<script type='text/ecmascript-6'>
import pdf from "vue-pdf";
export default {
      components:{
      pdf
  },
  data() {
    return {
      pdfUrl:'http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf',
　 } 
  },
  mounted(){
    const toast = this.$toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    });

    this.pdfUrl = '';

  },
  methods:{
    loadPdfHandler(){
      this.$toast.clear()
    },
    toSignature(){
      this.$router.push({
        path:'/signature'
      })
    }
  }
};
</script>

<style scoped>
  .pdf{
    position: relative;
  }
  .bottom-btn{
    position: fixed;
    width: 80%;
    bottom: 0;
    left: 10%;
    margin: 16px 0;
  }
</style>
