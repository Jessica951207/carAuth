<template>
  <div class="directBg">
    <div class="directLogo">
      <img class="directImg" src="../assets/logoMain2.png" alt="">
    </div>
    <div class="topBanner">
      <img class="directImg" src="../assets/DTopBanner3.png" alt="">
    </div>
    <div class="directTit">
      <img class="directImg" src="../assets/directTit3.png" alt="">
    </div>
    <div class="tag">
      <img class="directImg" src="../assets/drictHeart2.png" alt="">
    </div>
    <div class="directTxt">
      <img class="directImg" src="../assets/directTxt3.png" alt="">
    </div>
    <!-- <div class="bottomBtn" :style="bottomBtnStyle"> -->
    <div class="bottomBtn">
      <van-button style="width:70%" round block color="linear-gradient(#fee9d1, #fad3a9)" @click="toApply">立即申请</van-button>
    </div>
    <div class="process">
      <img class="directImg" src="../assets/process4.png" alt="">
    </div>
    <div class="provider">
      <img class="directImg" src="../assets/provider.png" alt="">
    </div>
  </div>
</template>

<script>
import { getUrlParam } from "../common/common.js";
import {directSell,managerInfo} from '../request/api'
export default {
  data() {
    return {
      state: "",
      headUrl:'',
      managerName:'',
      department:'',
      job:'',
      phoneNumber:'',
      managerId:'',
      sHeight:'',
      sHeightCut:'',
    };
  },
  mounted() {
    this.$store.commit('updateParam',getUrlParam())
    console.log('this.$store.state.franchiserId==========',this.$store.state.franchiserId)
    this.state = this.$store.state.state
    this.managerId = this.$store.state.managerId
    console.log("state=" + this.state + "managerId=",this.managerId)
    this.getManagerData();
  },
  methods: {
    getManagerData(){
      var manInfo = Object.assign({managerId:this.managerId})
      managerInfo(manInfo).then(res => {
        console.log(res.data.data);
        this.headUrl = res.data.data.HEADSCULPTURE;
        this.managerName = res.data.data.MANAGERNAME;
        this.department = res.data.data.DEPT;
        this.job = res.data.data.POSITION;
        this.phoneNumber = res.data.data.MANAGERPHONE;
        this.$store.state.managerName = res.data.data.MANAGERNAME;
        this.$store.state.managerTel = res.data.data.MANAGERPHONE;
      })

    },
    //贷款申请
    toApply() {
      let that = this;
      console.log('toApply',that.state,that.managerId)
      this.$router.push({
        path: "/zhuanXiangDai",
        query: {
          state: that.state,
          managerId:that.managerId,
          type:that.$store.state.type,
          id:that.$store.state.id,
          clueId:that.$store.state.clueId,
          branchLoanId:that.$store.state.branchLoanId,
          franchiserId:that.$store.state.franchiserId
        }
      });
    }

  }
};
</script>

<style scoped>
  .directBg{
    width: 100%;
    background: url("../assets/bg_03.jpg") no-repeat;
    position: absolute; 
    right: 0; 
    top: 0;
    min-width: 100%; 
    min-height: 100%;
    background-size: cover;
    z-index: -999;
    /* background-size: 100% 100%; */
    /*background: url("../assets/managerBg_02.jpg") no-repeat;*/
  }
  .directLogo{
    width: 88%;
    padding: 24px 6%;
  }
  .directLogo img{
    width: 30%;
  }
  .directImg{
    width: 100%;
  }
  .topBanner{
    width: 52%;
    padding: 0 24%;
  }
  .directTit{
    width: 72%;
    padding: 0 14%;
  }
  .directTit2{
    width: 54%;
    padding: 0 23%;
  }
  .directTxt{
    width: 76%;
    padding: 0 12%;
    margin-top: 10px;
  }
  .tag{
    width: 42%;
    padding: 0 29%;
  }
  .process{
    width: 80%;
    padding: 0 10%;
    margin-top: 16%;
  }
  .provider{
    width: 78%;
    padding: 2% 11%;
    height: 24px;
  }
  .main{
    color:#3e3129;
    font-family: '方正兰亭中黑简体';
    font-size: 13px;
    font-weight: 550;
    width: 62px;
  }
  .mainPic{
    width:80%;
  }
.bottomBtn{
  width: 100%;
  margin: 0 auto;
  /*padding: 120% 20px 20px 20px;*/
  /*padding: 125% 20px 20px 20px;*/
  margin-top: 20%;
  display: flex;
  justify-content: space-around;
}
.top {
  width: 100%;
  height: 120px;
  display: flex;
}
.top-image {
  width: 100px;
  height: 100px;
  padding: 10px;
}
.top-content {
  height: 100px;
  padding: 10px 10px 10px 0;
}
.image {
  padding: 10px;
  margin-top: 10px;
}
.van-button__text{
  color:#E83828 !important;
  font-weight: 550;
}
</style>
