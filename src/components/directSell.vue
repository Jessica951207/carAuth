<template>
  <div>

    <div v-show="state == 2" class="top">
      <div class="top-image">
        <van-image width="100" height="100" :src='headUrl' />
      </div>
      <div class="top-content">
        <div>姓名：{{managerName}}</div>
        <div>部门：{{department}}</div>
        <div>职务：{{job}}</div>
        <div>手机：{{phoneNumber}}</div>
      </div>
    </div>
    <div class="image">
      <van-image width="100%" height="100%" src="http://iph.href.lu/500x400?text=占位图" />
    </div>
    <div class="bottomBtn">
      <van-button style="width:40%" round block type="info" @click="toApply">贷款申请</van-button>
      <van-button style="width:40%" round block type="info" @click="toRRD">成为推荐人</van-button>
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
      managerId:''
    };
  },
  mounted() {
    this.$store.commit('updateParam',getUrlParam())
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
.bottomBtn{
  margin: 20px;
  display: flex;
  justify-content: space-between;
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
</style>
