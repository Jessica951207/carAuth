<template>
  <div>
    <van-nav-bar title="中联惠捷" />

    <div style="margin:30px">
      <h4 style="color:red">临时功能展示，上线后无此界面</h4>
      <van-button style="margin-top:25px" round block type="info" @click="one">初筛</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="two">助手APP直销</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="three">车惠贷APP直销</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="four">车辆评估单一需求</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="five">实名认证单一需求</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="six">结果查询</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="eight">渠道直销</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="seven">悬浮</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="nine">拖拽</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="eleven">拖拽Demo</van-button>
      <van-button style="margin-top:25px" round block type="info" @click="ten">booking</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    eleven(){
      this.$router.push('/dragDemo')
    },
    ten(){
      this.$router.push('/booking')
    },
    nine(){
      this.$router.push('/drag')
    },
    seven(){
      this.$router.push('/hover')
    },
    //初筛
    one() {
      this.$router.push({
        path: "/index",
        query: {
          state: 1,
          managerId:101,
          type:1,
          branchLoanId:"",
          id:"",
          clueId:""
        }
      });
    },
    //客户经理直销
    two() {
      this.$router.push({
        path: "/directSell",
        query: {
          state: 2,
          managerId:101,
          type:2,
          branchLoanId:"",
          id:"",
          clueId:""
        }
      });
    },
    //代理人直销
    three() {
      this.$router.push({
        path: "/directSellAgent",
        query: {
          state: 3,
          managerId:228,
          type:2,
          branchLoanId:"",
          id:"",
          clueId:""
        }
      });
    },
    //车辆评估（单一功能）
    four() {
      this.$router.push({
        path: "/index",
        query: {
          state: 4,
          managerId:101,
          type:1,
          branchLoanId:"",
          id:"",
          clueId:""
        }
      });
    },
    //实名认证（单一功能）
    five() {
      this.$router.push({
        path: "/user",
        query: {
          state: 5,
          managerId:101,
          type:1,
          branchLoanId:"",
          id:"",
          clueId:""
        }
      });
    },
    //结果查询
    six() {
      this.$router.push({
        path: "/search",
        query:{
          state: 1,
          managerId:101,
          type:1,
          branchLoanId:"",
          id:"",
          clueId:"",
          franchiserId:'100'
        }

      });
    },
    //渠道直销
    eight(){
      this.$router.push(
      {
        path: "/channelDirectSell",
        query: {
          state: 6,
          managerId:101,
          type:4,
          branchLoanId:"",
          id:"",
          clueId:"",
          franchiserId:'100'
        }
      })
    },
  }
};
</script>

<style>
</style>
