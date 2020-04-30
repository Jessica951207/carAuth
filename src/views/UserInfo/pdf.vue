<template>
  <div class="pdf" v-show="fileType === 'pdf'">
    <pdf
      ref="pdf"
      :src="pdfUrl"
      :page="currentPage"
      @num-pages="pageCount=$event"
      @page-loaded="currentPage=$event"
      @loaded="loadPdfHandler">
    </pdf>

    <div class="bottom-btn" >
      <p class="arrow">
        <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
        {{currentPage}} / {{pageCount}}
        <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">下一页</span>
      </p>
      <van-button round block type="info" @click="nextStep">下一步</van-button>
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
      pdfUrl:'',// pdf文件地址
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
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


  },
  methods:{
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage (val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
        // console.log(this.currentPage)
      }
    },
    loadPdfHandler(e){
      this.$toast.clear();
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    nextStep(){
      this.$router.push('/certificateResult')
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
    margin: 5% auto;
  }
.arrow{
  text-align: center;
}
</style>
