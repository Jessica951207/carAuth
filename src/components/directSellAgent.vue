<template>
  <div class="directBg">
    <!--<div v-show="state == 2" class="top">-->
      <!--<div class="top-image">-->
        <!--<van-image width="100" height="100" :src='headUrl' />-->
      <!--</div>-->
      <!--<div class="top-content">-->
        <!--<div>姓名：{{managerName}}</div>-->
        <!--<div>部门：{{department}}</div>-->
        <!--<div>职务：{{job}}</div>-->
        <!--<div>手机：{{phoneNumber}}</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="image">-->
      <!--<van-image width="100%" height="100%" src="http://iph.href.lu/500x400?text=占位图" />-->
    <!--</div>-->
    <div class="directLogo">
      <img class="directImg" src="../assets/logoMain2.png" alt="">
    </div>
    <div class="topBanner">
      <img class="directImg" src="../assets/DTopBanner2.png" alt="">
    </div>
    <div class="tag">
      <img class="directImg" src="../assets/drictHeart.png" alt="">
    </div>
    <div class="directTxt">
      <img class="directImg" src="../assets/directTxt2.png" alt="">
    </div>
    <!-- <div class="bottomBtn" :style="bottomBtnStyle"> -->
    <div class="bottomBtn">
      <van-button style="width:45%;" round block color="linear-gradient(#cbe4f3, #65bce7)" @click="toApply">立即申请</van-button>
      <van-button style="width:45%;" round block color="linear-gradient(#cbe4f3, #65bce7)" type="info" @click="toRRD">成为推荐人</van-button>
      <!--<van-button style="width:45%" round block color="#83c4e7" @click="toApply">贷款申请</van-button>-->
      <!--<van-button style="width:45%" round block color="#83c4e7" type="info" @click="toRRD">成为推荐人</van-button>-->
    </div>
    <div class="process">
      <img class="directImg" src="../assets/process3.png" alt="">
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
      bottomBtnStyle:{
        padding:""
      }
    };
  },
  mounted() {
    this.$store.commit('updateParam',getUrlParam())
    this.state = this.$store.state.state
    this.managerId = this.$store.state.managerId
    console.log("state=" + this.state + "managerId=",this.managerId)
    // this.getManagerData();    //代理人直销 暂不调此接口

    //获取屏幕高度
    this.sHeight = window.screen.height;
    console.log("this.sHeight",this.sHeight);
    this.sHeightCut = this.sHeight * 0.04
    this.bottomBtnStyle.padding = this.sHeightCut + "px" + " 20px 0px 20px"
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

        }
      });
    },
    //成为推荐人
    toRRD(){
       let that = this;
      this.$router.push({
        path: "/register",
        query: {
          state: that.state,
          managerId:that.managerId,
          type:that.$store.state.type,
          id:that.$store.state.id,
          clueId:that.$store.state.clueId,
          branchLoanId:that.$store.state.branchLoanId,
        }
      });
    },

  }
};
</script>

<style scoped>
  .directBg{
    width: 100%;
    background: url("../assets/bg_02.png") no-repeat;
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
    width: 76%;
    padding: 0 12%;
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
  width: 80%;
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
  color:#171C61 !important;
  font-weight: 550;
}
  /*@media screen and  (min-width: 375px) and (max-width: 375px){*/
    /*.bottomBtn{padding-top: 135%;}*/
  /*}*/
  /*@media screen and (min-width: 768px) and (max-width: 1024px){*/
    /*.bottomBtn{padding-top: 90%;}*/
  /*}*/
</style>
