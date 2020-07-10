<template>
  <div>
    <!-- 进度栏 -->
    <div class="step">
      <van-steps :active="2">
        <van-step>车辆认证</van-step>
        <van-step>实名认证</van-step>
        <van-step>完成初筛</van-step>
      </van-steps>
    </div>
    <div class="loading" v-if="showLoadingText">
      <p>正在进行初筛，请稍后...</p>
    </div>
    <div v-else>
      <div class="result">
        <div class="icon">
          <van-icon :name="iconName" :color="iconColor" size="100" />
        </div>
        <div class="info">
          <p>{{resultInfo}}</p>
        </div>
        
      </div>
      <div class="baseInfo">
          <div class="title">客户基本信息</div>
          <van-form alidate-first @submit="onSubmit">
            <van-field readonly v-model="name" name="name" label="姓名:" />
            <van-field readonly v-model="idNumcut" name="idNum" label="身份证号码:" />
            <van-field readonly v-model="phoneCut" name="phone" label="手机号:" />
          </van-form>
        </div>
    </div>
  </div>
</template>

<script>
import { queryUserInfo ,fourInOneAgain ,amountFiler ,updateLoanStatus ,wechat} from "../../request/api";
export default {
  data() {
    return {
      showLoadingText: false,
      result: "", //1-人工审批 2-初筛失败 3-成功
      name: "",
      idNum: "",
      idNumcut:'',
      phone: "",
      phoneCut:'',
      iconName: "", //1-info-o 2-close 3-checked
      iconColor: "", //1-1874CD 2-ee0a24 3-20CE43
      resultInfo: "",
      feedModel:'',
      clueId:''
    };
  },
  mounted(){
    this.clueId = this.$store.state.clueId;
    this.state = this.$store.state.state;
    console.log("this.clueId:",this.clueId);

    if(this.state == 2){
      this.feedModel = 1
    }
    else if(this.state == 3){
      this.feedModel = 2
    }
    else if(this.state == 6){
      this.feedModel =3
    }

    this.getUserInfo();

  },
  methods: {
    update(){
      var update = Object.assign(
        {state:'A040'},
        {clueId:this.$store.state.clueId}
      )
      updateLoanStatus(update).then(res => {
        if(res.data.data.stateCode === 0){
          this.$toast.fail('状态保存失败！')
        }
      })
    },
    //查询用户信息
    getUserInfo(){
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      var id = Object.assign({id:this.$store.state.id})
      queryUserInfo(id).then(res => {
        console.log(res.data.data);
        this.name = res.data.data.name;
        this.idNum = res.data.data.idNum;
        this.idNumcut = this.idNum.substr(0, 3) + '************' + this.idNum.substr(this.idNum.length - 4);
        this.phone = res.data.data.phone;
        this.phoneCut = '*******' + this.phone.substr(7);
        var four = Object.assign(
          {name:this.name},
          {idNum:this.idNum},
          {phone:this.phone},
          {feedModel:this.feedModel},
          {clueId:this.$store.state.clueId}
        )
        // 初筛大数据
        console.log("four:",four)
        fourInOneAgain(four).then(res =>{
          console.log(res.data.data)
          let fourData = res.data.data

          if(fourData.riskScoreResult == 'success' && fourData.regularLoanCustomerResult == "success" && fourData.complexNetworkResult == 'success' && fourData.phoneOnLineTimeResult == 'success' ){
            //决策引擎
            var clueId = Object.assign({clueId:this.$store.state.clueId})
            amountFiler(clueId).then(res => {
              toast.clear()
              console.log(res.data.data)
              if(res.data.data.result == 0){
                this.resultInfo = "恭喜！初筛成功！";
                this.iconName = 'checked';
                this.iconColor = '#20CE43';
              }else if(res.data.data.result == -1){
                this.resultInfo = "很遗憾！初筛拒绝！";
                this.iconName = 'close';
                this.iconColor = '#ee0a24';
              }
              //状态更新
              this.update();
              //微信推送接口
              this.wechatPush();

            })
          }
          if(fourData.complexNetworkResult === 'error' || fourData.phoneOnLineTimeResult === 'error' || fourData.regularLoanCustomerResult === 'error' || fourData.riskScoreResult === 'error'){
            toast.clear()
            this.resultInfo = '提交成功，需要人工审核';
            this.iconName = 'info';
            this.iconColor = '#1874CD';
            //微信推送接口
            this.wechatPush();
          }


        })
      })


      
    },
    wechatPush(){
      //微信推送
      var wxInfo = Object.assign(
        {branchLoanId:this.$store.state.branchLoanId},
        {type:2},
        {managerId:this.$store.state.managerId},
        {feedModel:this.feedModel},
        {clueId:this.clueId},
      )
      wechat(wxInfo).then(res => {
        console.log(res.data.data)
        if (res.data.data.stateCode === 1){
          this.$toast.success("已通知您的专属客户经理！")
        }else {
          this.$toast.fail("发送微信推送失败！")
        }
      })
    },
    onSubmit(){

    },
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}
.result {
  text-align: center;
}
.result .info {
  font-size: 25px;
  color: red;
}
.baseInfo {
}
.baseInfo .title {
  padding-left: 12px;
  height: 35px;
  background: #e8f0fe;
  line-height: 38px;
}
</style>
