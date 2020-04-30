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
    <div class="bottomBtn" :style="bottomBtnStyle">
      <van-button style="width:45%" round block color="#c9231e" @click="toApply">贷款申请</van-button>
      <van-button style="width:45%" round block color="#c9231e" type="info" @click="toRRD">成为推荐人</van-button>
      <!--<van-button style="width:45%" round block color="#83c4e7" @click="toApply">贷款申请</van-button>-->
      <!--<van-button style="width:45%" round block color="#83c4e7" type="info" @click="toRRD">成为推荐人</van-button>-->
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
    this.getManagerData();

    //获取屏幕高度
    this.sHeight = window.screen.height;
    console.log("this.sHeight",this.sHeight);
    this.sHeightCut = this.sHeight * 0.6
    this.bottomBtnStyle.padding = this.sHeightCut + "px" + " 20px 20px 20px"

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
    height: 100vh;
    background: url("../assets/managerBg.png") no-repeat;
    /*background: url("../assets/managerBg_02.jpg") no-repeat;*/
    background-size: 100% 100%;
  }
.bottomBtn{
  width: 80%;
  margin: 0 auto;
  /*padding: 120% 20px 20px 20px;*/
  /*padding: 125% 20px 20px 20px;*/
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
  /*@media screen and  (min-width: 375px) and (max-width: 375px){*/
    /*.bottomBtn{padding-top: 135%;}*/
  /*}*/
  /*@media screen and (min-width: 768px) and (max-width: 1024px){*/
    /*.bottomBtn{padding-top: 90%;}*/
  /*}*/
</style>
