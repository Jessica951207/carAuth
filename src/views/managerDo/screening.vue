<template>
  <div>
    <div>
      <van-nav-bar title="初筛" />
    </div>
    <!-- 进度栏 -->
    <div class="step">
      <van-steps :active="2">
        <van-step>车辆认证</van-step>
        <van-step>实名认证</van-step>
        <van-step>完成初筛</van-step>
      </van-steps>
    </div>

    <template>
      <div class="form-title">
      <span>客户基本信息</span>
    </div>
      <van-form alidate-first @submit="onSubmit">
        <van-field
          readonly
          v-model="name"
          name="name"
          label="姓名"
          placeholder="请填写姓名"
        />
        <van-field
          readonly
          v-model="idNumber"
          name="idNum"
          label="身份证号码"
          placeholder="请填写身份证号码"
        />
        <van-field
          readonly
          v-model="phoneNumber"
          name="phone"
          label="手机号"
          placeholder="请填写手机号码"
        />
      </van-form>
    </template>
    <template>
      <div class="form-title">
        <span>大数据查询结果</span>
      </div>
      <div class="bigData">
        <div class="flexDiv">
          <div class="air">风险评分</div>
          <div class="air colorst">{{riskResult}}</div>
          <van-button type="info" size="small" @click="riskSearch" v-show="riskShow">重新查询</van-button>
        </div>
        <div class="flexDiv">
          <div class="air">常贷客</div>
          <div class="air colorst">{{complexNetResult}}</div>
          <van-button type="info" size="small" @click="regularSearch" v-show="regularShow">重新查询</van-button>
        </div>
        <div class="flexDiv">
          <div class="air">复杂网络</div>
          <div class="air colorst">{{regularLoanResult}}</div>
          <van-button type="info" size="small" @click="complexSearch" v-show="complexShow">重新查询</van-button>
        </div>
        <div class="flexDiv">
          <div class="air">手机在网时间</div>
          <div class="air colorst">{{phoneOResult}}</div>
          <van-button type="info" size="small" @click="phoneSearch" v-show="phoneShow">重新查询</van-button>
        </div>
      </div>
      <div style="width: 90%;margin: 0 auto">
        <van-button style="margin-top:30px" round block type="info" @click="start">初筛</van-button>
      </div>
    </template>



  </div>
</template>

<script>
  import { getUrlParam } from "../../common/common.js";
  import {queryUserInfo,riskScoreAgain,regularLoanAgain,complexNetAgain,phoneOnlineAgain,fourInOneAgain ,amountFiler } from '../../request/api'
export default {
  data() {
    return {
      riskResult:'',
      regularLoanResult:'',
      complexNetResult:'',
      phoneOResult:'',
      name: "",
      idNum: "",
      idNumber:'',
      phoneNumber:'',
      phone: "",
      info:'',
      state:'',
      feedModel:'',
      riskShow:false,
      regularShow:false,
      complexShow:false,
      phoneShow:false,
      managerId:'',
      type:"",
      id:""

    };
  },
  mounted(){
    this.managerId = this.$store.state.managerId;
    this.clueId = this.$store.state.clueId;
    this.type = this.$store.state.type;
    this.id = this.$store.state.id;
    this.state = this.$store.state.state;

    if (this.state == 2) {
      //客户经理
      this.feedModel = 1;
    }
    else if(this.state == 3){
      //代理人
      this.feedModel = 2;
    }

    this.getUserInfo();


  },
  methods: {
    //单独查询
    //风险评估
    riskSearch(){
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      riskScoreAgain(this.info).then(res => {
        toast.clear();
        console.log(res.data.data)
        if(res.data.data.riskScoreResult === 'success'){
          this.riskShow = false;
          this.riskResult = '查询成功'
        }else{
          this.riskShow = true;
          this.riskResult = '查询失败'
        }
      })
    },
    //常贷客
    regularSearch(){
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      regularLoanAgain(this.info).then(res => {
        toast.clear();
        console.log(res.data.data)
        if(res.data.data.regularLoanCustomerResult === 'success'){
          this.regularShow = false;
          this.complexNetResult = '查询成功'
        }else{
          this.regularShow = true;
          this.complexNetResult = '查询失败'
        }
      })
    },
    //复杂网络
    complexSearch(){
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      complexNetAgain(this.info).then(res => {
        toast.clear();
        console.log(res.data.data)
        if(res.data.data.complexNetworkResult === 'success'){
          this.complexShow = false;
          this.regularLoanResult = '查询成功'
        }else{
          this.complexShow = true;
          this.regularLoanResult = '查询失败'
        }
      })
    },
    //手机在网时间
    phoneSearch(){
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      phoneOnlineAgain(this.info).then(res => {
        toast.clear();
        console.log(res.data.data.phoneOnLineTimeResult)
        if(res.data.data.phoneOnLineTimeResult === 'success'){
          this.phoneShow = false;
          this.phoneOResult = '查询成功'
        }else{
          this.phoneShow = true;
          this.phoneOResult = '查询失败'
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
        this.phone = res.data.data.phone;

        this.idNumber = this.idNum.substr(0, 3) + '************' + this.idNum.substr(this.idNum.length - 4);
        this.phoneNumber =  '*******' + this.phone.substr(7);


        this.info = Object.assign(
          {name:this.name},
          {idNum:this.idNum},
          {phone:this.phone},
          {id:this.id},
        )

        //四合一接口
        var four = Object.assign(
          {name:this.name},
          {idNum:this.idNum},
          {phone:this.phone},
          {feedModel:this.feedModel},
          {clueId:this.$store.state.clueId}
        )

        fourInOneAgain(four).then(res =>{
          console.log(res.data.data)
          toast.clear();
          //风险评估
          if(res.data.data.riskScoreResult === 'success'){
            //todo later
            this.riskShow = false;
            this.riskResult = '查询成功'
          }else{
            this.riskShow = true;
            this.riskResult = '查询失败'
          }
          //常贷客
          if(res.data.data.regularLoanCustomerResult === 'success'){
            this.regularShow = false;
            this.complexNetResult = '查询成功'
          }else{
            this.regularShow = true;
            this.complexNetResult = '查询失败'
          }
          //复杂网络
          if(res.data.data.complexNetworkResult === 'success'){
            this.complexShow = false;
            this.regularLoanResult = '查询成功'
          }else{
            this.complexShow = true;
            this.regularLoanResult = '查询失败'
          }
         //手机在网时间
          if(res.data.data.phoneOnLineTimeResult === 'success'){
            this.phoneShow = false;
            this.phoneOResult = '查询成功'
          }else{
            this.phoneShow = true;
            this.phoneOResult = '查询失败'
          }

        })

      })
    },
    start() {
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      //如果都成功
      // var clueId = Object.assign({clueId:216})
      var clueId = Object.assign({clueId:this.$store.state.clueId})
      if(this.riskResult == '查询成功' && this.complexNetResult == '查询成功' && this.regularLoanResult == '查询成功' && this.phoneOResult == '查询成功'){
        amountFiler(clueId).then(res => {
          toast.clear();
          console.log(res.data.data)
          if(res.data.data.code == 0){
            this.$router.push({
              path:'/screenResult',
            })
            this.$store.state.ScreenResult = res.data.data.result
          }else{
            this.$toast.fail("初筛结果查询失败！")
          }

        })
      }else{
        toast.clear();
        this.$toast.fail("查询失败，请重新查询！")
      }
    },
    onSubmit() {
      // this.$toast.success("成功！");
    }
  }
};
</script>

<style scoped>
  .flexDiv{
    width: 90%;
    margin: 0 auto;
    font-size: 14px;
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
    border-bottom: 1px solid #ebedf0;

  }
  .flexDiv .air{
    width: 40%;
    padding: 5% 0;
  }
  .colorst{
    color: #969799;
  }
.form-title {
  height: 35px;
  padding-left: 12px;
  background:#e8f0fe;
  line-height: 38px;
}

</style>
