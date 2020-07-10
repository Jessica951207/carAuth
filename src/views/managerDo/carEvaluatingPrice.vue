<template>
  <div>
    <van-nav-bar title="评估价格" />

    <!-- 进度栏 -->
    <div v-if="state != 4" class="step">
      <van-steps :active="0">
        <van-step>车辆认证</van-step>
        <van-step>实名认证</van-step>
        <van-step>完成初筛</van-step>
      </van-steps>
    </div>

    <div class="result-icon">
      <p class="iconPosition">
        <van-icon name="checked" color="#07c160" size="50"/>
      </p>
      <span>恭喜您!</span>
    </div>
    <div class="bottom-div">
      <span>您的额度为：</span>
      <div>{{price}}元</div>
    </div>
    <!-- 单一功能不显示下一步按钮 -->
    <div v-show="state != 4" style="margin: 50px 16px 0 16px;">
      <van-button round block type="info" @click="next">继续</van-button>
    </div>
  </div>
</template>

<script>
import { updateLoanStatus } from '../../request/api'

export default {
  data() {
    return {
      price: "",
      state: "",
      managerId:''
    };
  },
  mounted() {
    console.log(this.$store.state.managerId,this.$store.state.branchLoanId,this.$store.state.state,this.$store.state.id)
    this.state = this.$store.state.state;
    this.managerId = this.$store.state.managerId;

    this.price = this.$store.state.price;
    this.updateState();
  },
  methods: {
    //更新状态
    updateState(){

      var update = Object.assign(
        {state:'A020'},
        {clueId:this.$store.state.clueId}
      )
      updateLoanStatus(update).then(res => {
        if(res.data.data.stateCode === 0){
          this.$toast.fail('状态保存失败！')
        }
      })
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    next() {
      //1-初筛 2-助手app直销 3-车惠贷直销 4-单个功能
      if (this.state == 1) {
        this.$router.push({
          path: "/user",
          query: {
            state: this.state,
            managerId:this.managerId,
            type:this.$store.state.type,
            id:this.$store.state.id,
            clueId:this.$store.state.clueId,
            branchLoanId:this.$store.state.branchLoanId,
          }
        });
      }
      else if (this.state == 2 || this.state == 3 || this.state == 6) {
        this.$router.push({
          path: "/DirectSellUserCertificate",
          query: {
            state: this.state,
            managerId:this.managerId,
            type:this.$store.state.type,
            id:this.$store.state.id,
            clueId:this.$store.state.clueId,
            branchLoanId:this.$store.state.branchLoanId,
            serialNumber:this.$store.state.serialNumber,
          }

        });
      }


    }
  }
};
</script>

<style scoped>
.result-icon {
  width: 70%;
  height: 70%;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
  color: red;
  font-size: 20px;
}
.bottom-div {
  margin-top: 30px;
}
.bottom-div span {
  margin-left: 15%;
}
.bottom-div div {
  font-size: 35px;
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
}
</style>
