<template>
  <div>
    <van-nav-bar title="实名认证" />
    <div class="result">
      <van-icon name="checked" size="70px" color="#20CE43" />
      <div class="result-text">
        <span>实名认证已完成!</span>
      </div>
    </div>
    <div>
        <div class="form-title">
            客户基本信息
        </div>
        <van-field readonly v-model="name" label="姓名:" />
        <van-field readonly v-model="IDcard" label="身份证号:" />
        <van-field readonly v-model="phone" label="手机号:" />
        <van-field  is-link readonly v-model="isAccredit" label="已授权:" @click="personalAuth"/>
    </div>
    <div style="margin: 50px 16px 0 16px;" v-show="showBtn">
      <van-button round block type="info" native-type="submit" @click="nextStep">下一步</van-button>
    </div>

  </div>
</template>

<script>
  import { getUrlParamSec } from "../../common/common.js";
  import { saveRealName ,queryUserInfo ,updateLoanStatus} from '../../request/api'
export default {
    data(){
        return{
          name:'',
          IDcard:'',
          phone:'',
          isAccredit:'个人信息查询授权书',
          clueId:'',
          state:'',
          showBtn:true,
          agreement:''
        }
    },
  mounted(){
    console.log('pdf链接是介个',this.$store.state.agreement)
    this.state = this.$store.state.state;
    this.clueId = this.$store.state.clueId;
    console.log('this.state',this.state,this.clueId,this.$store.state.id)
    if(this.state == 2 || this.state == 3 || this.state == 6){
      this.showBtn = true
    }else{
      this.showBtn = false
    }

    this.saveRealNameSuccess();
    this.getUserInfo();
    console.log(this.IDcard)
    if(this.IDcard.length > 0){
      this.IDcard = this.IDcard.substr(0, 3) + '************' + this.IDcard.substr(this.IDcard.length - 4);
      this.phone =  '*******' + this.phone.substr(7);
    }

  },
  methods:{
    nextStep(){
      this.$router.push({
        path:'/directSellScreening',
        query:{
          state:this.state
        }
      })
    },
      //保存实名认证标志位
    saveRealNameSuccess(){
      var id = Object.assign(
        {id:this.$store.state.id},
        {managerId:this.$store.state.managerId},
        )
      saveRealName(id).then(res => {
        console.log(res.data.data)
        if(res.data.data.stateCode === 0) {
          this.$toast.fail('保存失败！')
        }

      })
    },
    //查询用户信息
    getUserInfo(){
      var id = Object.assign({id:this.$store.state.id})
      console.log(id)
      queryUserInfo(id).then(res => {
        console.log(res.data.data)
        this.name = res.data.data.name
        this.IDcard = res.data.data.idNum
        this.phone = res.data.data.phone

        if(this.state == 5){
          this.$store.state.agreement = res.data.data.agreement;
          console.log("this.agreement",this.$store.state.agreement)
        }

        //更新状态
        if(this.state != 5){
          var update = Object.assign(
            {state:'A030'},
            {clueId:this.clueId}
          )
          updateLoanStatus(update).then(res => {
            if(res.data.data.stateCode === 0){
              this.$toast.fail('状态保存失败！')
            }
          })
        }

      })
    },

    //个人授权书
    personalAuth(){
      this.$router.push({
        path:'/pdf',
      })
    }
  }
};
</script>

<style scoped>
.result {
  text-align: center;
  width: 100%;
  margin-top: 30px;
}
.form-title {
  height: 30px;
  padding-left: 16px;
  background: #ff9900;
  line-height: 32px;
  color: #fff;
  font-weight: bold;
  margin-top: 30px;
}
</style>
