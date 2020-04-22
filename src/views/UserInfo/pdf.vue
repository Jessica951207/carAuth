<template>
  <div class="pdf">
    <pdf
      ref="pdf"
      :src="pdfUrl"
      @loaded="loadPdfHandler">
    </pdf>
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
      pdfUrl:'',
　 } 
  },
  mounted(){
    const toast = this.$toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    console.log('pdf链接鸭',this.$store.state.agreement)
    this.pdfUrl = this.$store.state.agreement;

    // this.pdfUrl = 'http://zlhjweb.5gzvip.idcfengye.com/fileManage/getFile?type=pdf&fileCode=91b4f823d7c7469ba7d76eb32f21cb96';
    //  this.pdfUrl = 'http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf'
    // window.open(this.pdfUrl)

  },
  methods:{
    loadPdfHandler(){
      this.$toast.clear()
    }
  }
};
</script>

<style>
</style>
