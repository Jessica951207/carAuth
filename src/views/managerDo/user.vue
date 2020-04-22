<template>
  <div>
    <!-- <template "> -->
    <van-nav-bar title="实名认证" />
    <!-- </template>
    <template v-else>
      <van-nav-bar title="实名认证" left-text="返回" left-arrow @click-left="onClickLeft" />
    </template>-->
    <!-- 进度栏 -->
    <div v-show="state != 4" class="step">
      <van-steps :active="1">
        <van-step>车辆认证</van-step>
        <van-step>实名认证</van-step>
        <van-step>完成初筛</van-step>
      </van-steps>
    </div>
    <div class="form-title">
      <span>请填写客户基本信息</span>
    </div>
    <div>
      <van-form alidate-first @failed="onFailed" @submit="onSubmit">
        <van-field
          :style="readonlystyle"
          :readonly="readonly"
          v-model="name"
          name="name"
          label="姓名"
          placeholder="请填写姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          :style="readonlystyle"
          :readonly="readonly"
          v-model="idNum"
          name="idNum"
          label="身份证号码"
          placeholder="请填写身份证号码"
          :rules="[{validator:idNumValidator, required: true, message: '请填写正确的身份证号码' }]"
        />
        <van-field
          :style="readonlystyle"
          :readonly="readonly"
          v-model="phone"
          name="phone"
          label="手机号"
          placeholder="请填写手机号码"
          :rules="[{validator:phoneValidator, required: true, message: '请填写正确的手机号码' }]"
        />
        <div style="margin: 50px 16px;" v-show="showConfirmBtn">
          <van-button round block type="info" native-type="submit">确认</van-button>
        </div>

      </van-form>
    </div>

    <div style="margin:16px" v-show="showVerificateBtn">
      <van-button
        @click="getToken"
        style="margin-top:50px"
        round
        block
        type="info"
      >复制链接发给客户</van-button>
      <van-button style="margin-top:10px" round block type="info" @click="isAuth">验证客户是否完成实名认证</van-button>
    </div>
    <!--popup复制-->
    <van-popup v-model="show" :style="{width: '80%',padding:'3% 0 6% 0'}">
      <p style="text-align: center;">是否确认复制？</p>
      <div class="" style="text-align: center">
        <van-button
          @click="getTxt"
          style="margin-top:40px;width: 30%"
          round
          type="primary"
          v-clipboard:copy="copyTxt"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >确认</van-button>
        <van-button type="info" round @click="cancel" style="margin-top:40px;width: 30%;margin-left: 5%">取消</van-button>
      </div>
    </van-popup>

    <!--已完成实名验证-->
    <van-popup
      v-model="showCertificateResult"
      :style="{width:'80%'}"
    >
      <div class="CertificateResult">
        <span class="CertificateResult-title">客户完成进度</span>
        <div style="margin-top:20px">
          <van-icon name="checked" size="70px" color="#20CE43" />
        </div>
        <van-button style="margin-top:25px" round block type="info" @click="hasDone">客户已完成实名认证</van-button>
      </div>
    </van-popup>

    <!--未完成实名认证-->
    <van-popup
      v-model="failShow"
      :style="{width:'80%'}"
    >
      <div class="CertificateResult">
        <span class="CertificateResult-title">客户完成进度</span>
        <div style="margin-top:20px">
          <van-icon name="clear" size="70px" color="#ee0a24" />
        </div>
        <van-button style="margin-top:25px" round block type="info" @click="failBtn">客户暂未完成实名认证，请通知客户尽快完成实名认证</van-button>
      </div>
    </van-popup>

    <!--loading加载-->
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <van-loading type="spinner" />
      </div>
    </van-overlay>

  </div>
</template>

<script>
import { getUrlParam } from "../../common/common.js";
import {saveUserInfo,generateToken,queryUserInfo ,isAccessed ,updateLoanStatus} from '../../request/api'

export default {
  data() {
    return {
      copyUrl: "",
      name: "",
      idNum: "",
      phone: "",
      showCertificateResult: false,
      readonly:false,
      readonlystyle:'',
      showConfirmBtn:true,
      showVerificateBtn:false,
      token:'',
      copyTxt:'',
      show:false,
      failShow:false,
      showLoading:false,

      managerId:'',
      type:'',
      clueId:'',
      id:'',
      state:'',
      branchLoanId:'',
      feedModel:''

    };
  },
  mounted() {
    this.$store.commit('updateParam',getUrlParam())
    console.log(this.$store.state.managerId,this.$store.state.branchLoanId,this.$store.state.state,this.$store.state.id,this.$store.state.type,this.$store.state.clueId,)

    this.state = this.$store.state.state
    this.clueId = this.$store.state.clueId
    this.id = this.$store.state.id
    this.managerId = this.$store.state.managerId
    this.type = this.$store.state.type
    this.branchLoanId = this.$store.state.branchLoanId

    if(this.state == 2){
      this.feedModel = 1
    }
    else if(this.state == 3){
      this.feedModel = 2
    }

  },
  methods: {
    //验证客户是否完成认证
    isAuth() {
      var userInfo = Object.assign(
        {phone:this.phone},
        {name:this.name},
        {idNum:this.idNum},
      )
      isAccessed(userInfo).then(res => {
        console.log(res.data.data.stateCode)
        if(res.data.data.stateCode === 1){
          this.showCertificateResult = true;
        }else if(res.data.data.stateCode === -1){
          this.$toast.fail('vin码保存失败！')
        }else{
          this.failShow = true;
        }
      })
    },
    //复制链接
    async getToken(){
      let userInfo = Object.assign(
        {name:this.name},
        {idNum:this.idNum},
        {phone:this.phone}
      )
      const res = await generateToken(userInfo);
      console.log(res)
      // .then(res => {
        if(res.data.state === 'Y' && res.data.data.stateCode === 1){

          console.log('token------:',res.data.data.token)
          let TOKEN = res.data.data.token.replace("+","%2B");
          console.log('转换后的token：',TOKEN)
          this.copyUrl = window.location.origin +
            (process.env.NODE_ENV === "development"
              ? "/#/userCertificate?token=" + TOKEN + '&id='+ this.id + '&clueId='+ this.clueId + '&state=' + this.state + '&managerId=' + this.managerId + '&type=' + this.type + '&branchLoanId' +  this.branchLoanId
              : "/zlhj/app/carAuth/index.html#/userCertificate?token=" + TOKEN + '&id='+ this.id + '&clueId='+ this.clueId  + '&state=' + this.state + '&managerId=' + this.managerId + '&type=' + this.type + '&branchLoanId' +  this.branchLoanId);

          console.log('copyUrl----- :',this.copyUrl)
          this.show = true;
        }else{
          this.$toast(res.data.msg);
        }
      // })
    },
    getTxt(){
      this.copyTxt = this.copyUrl;
      setTimeout(()=>{
        this.show = false;
      },3000)
    },
    cancel(){
      this.show = false;
    },
    //提交保存
    onSubmit(values) {
      const toast = this.$toast.loading({
        duration: 0,
        message: '保存中...',
        forbidClick: true,
        loadingType: 'spinner',
      });

      var userData = Object.assign(values,
        {clueId:this.$store.state.clueId},
        {managerId:this.$store.state.managerId},
        {feedModel:this.$store.state.feedModel}
        )
      console.log("user界面保存三要素")
      saveUserInfo(userData).then(res => {
        toast.clear();
        console.log(res.data)
        if(res.data.data.stateCode === 1){
          //提交锁住页面
          this.readonly = true;
          this.readonlystyle = 'background:#e8f0fe';
          this.showConfirmBtn = false;
          this.showVerificateBtn = true;
          this.$toast.success('保存成功！');

          this.$store.state.id = res.data.data.id;
          this.id = res.data.data.id;

        }else if(res.data.data.stateCode === 0){
          this.$toast.fail('保存失败！')
        }else if(res.data.data.stateCode === -1){
          this.$toast.fail('信息不一致！')
        }

      })
    },
    //校验
    idNumValidator(val){
      //身份证正则表达式(15位)
      var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      //身份证正则表达式(18位)  .
      var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;

      if(isIDCard1.test(val) || isIDCard2.test(val)){
        return true
      }
      return false;
    },
    phoneValidator(val){
      return /^1[3456789]\d{9}/.test(val);
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
    },
// 复制成功时的回调函数
    onCopy (e) {
      this.$toast.success("内容已复制到剪切板！")
    },
// 复制失败时的回调函数
    onError (e) {
      this.$toast.fail("抱歉，复制失败！")
    },


    hasDone() {
      //更新状态
      var update = Object.assign(
        {state:'A030'},
        {clueId:this.$store.state.clueId}
      )
      updateLoanStatus(update).then(res => {
        if(res.data.data.stateCode === 1){
          this.$router.push({
            path: "/screening",
          });
        }else{
          this.$toast.fail('状态保存失败！')
        }
      })

    },
    //未完成验证
    failBtn(){
      this.failShow = false;
    }

  }
};
</script>

<style scoped>
.form-title {
  height: 30px;
  padding-left: 16px;
  background: #ff9900;
  line-height: 30px;
  color: #fff;
  font-weight: bold;
}
.CertificateResult {
  margin-top: 10px;
  padding: 16px;
  text-align: center;
}
.CertificateResult-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
