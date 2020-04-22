<template>
  <div>
    <van-nav-bar title="成为推荐人" left-text="返回" left-arrow @click-left="onClickLeft" />

    <van-form @submit="onSubmit" style="margin-top:20px">
      <van-field
        :readOnly="isReadOnly"
        v-model="invitationCode"
        name="invitationCode"
        label="邀请码:"
        placeholder="请填写邀请码"
        @blur="isHaveInvite"
      />
      <van-field v-model="recommendName" name="recommendName" center readonly label="推荐人姓名:" :rules="[{ required: isRequired, message: '请识别推荐人姓名' }]">
        <template #button>
          <van-button size="small"  native-type="button" type="primary" @click="Identify">识别推荐人</van-button>
        </template>
      </van-field>
      <van-field v-model="agentName" name="agentName" label="真实姓名:" placeholder="请填写真实姓名" :rules="[{ required: true, message: '请填写真实姓名' }]"/>
      <van-field v-model="userPhone" name="userPhone" label="手机号:" placeholder="请填写手机号" :rules="[{validator:phoneValidator, required: true, message: '请填写正确的手机号'}]"/>

      <van-field v-model="verifyCode" name="verifyCode"  center clearable label="短信验证码:" placeholder="请输入短信验证码" :rules="[{ required: true, message: '请输入验证码'}]">
        <template #button>
          <van-button v-if="isShowSend" size="small" type="primary" button-type="info" native-type="button" @click="getValidateCode" >发送验证码</van-button>
          <van-button v-else size="small" type="primary" button-type="info" native-type="button">
            <template >
              <van-count-down :time="60000" format=" ss 秒" @finish="isShowSend = true" style="color:#fff"/>
            </template>
          </van-button>
        </template>
      </van-field>
      <van-field type="password" v-model="originPassword" name="originPassword" label="密码:" placeholder="数字/字母/下划线且至少6位" :rules="[{validator: pwdValidator, required: true, message: '请输入正确的密码' }]"/>
      <van-field type="password" v-model="confirmPassword" name="confirmPassword" label="确认密码:" placeholder="请再次输入密码" :rules="[{validator: pwdAgaValidator, required: true, message: '请输入正确的密码' }]"/>
      <div style="margin: 50px 16px 0 16px;">
        <van-button round block type="info" native-type="submit">注&nbsp&nbsp&nbsp&nbsp册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  import { getUrlParam } from '../../common/common.js';
  import {invitateCode, IdentifyRefer ,tobeReferee ,validateCode ,sendCodeAgain ,invitateCodeMan} from '../../request/api'
export default {
  data() {
    return {
      state:'',
      isReadOnly:false,
      isRequired:false,
      invitationCode: "",
      recommendName:"",
      agentName: "",
      userPhone: "",
      verifyCode: "",
      originPassword: "",
      confirmPassword: "",
      isShowSend: true,
      isShowNameCountDown:false,
      isShowResult: false,
      managerId:''

    };
  },
  mounted(){
    this.state = this.$store.state.state
    this.managerId = this.$store.state.managerId
    console.log(this.managerId)

    if(this.state == 2){
      this.getInvitateCodeMan();
    }else if(this.state == 3){
      this.getInvitateCode();
    }

  },
  methods: {
    //校验
    phoneValidator(val){
      return /^1[3456789]\d{9}/.test(val);
    },
    pwdValidator(val){
      return /^[a-zA-Z\d_]{6,}$/.test(val);
    },
    pwdAgaValidator(val){
      return this.originPassword === val
    },
    //邀请码是否有值
    isHaveInvite(){
      if(this.invitationCode){
        this.isReadOnly = true;
        this.isRequired = true;
      }else{
        this.isReadOnly = false;
        this.isRequired = false;
      }
    },
    //代理人获取邀请码
    getInvitateCode(){
      //todo later
      // var userId = Object.assign({userId:"658"})
      var userId = Object.assign({userId:this.managerId})
      invitateCode(userId).then(res => {
        console.log(res.data.data)
        if(res.data.data.inviteCode){
          this.invitationCode = res.data.data.inviteCode;
          this.isReadOnly = true;
          this.isRequired = true;
        }else{
          this.isReadOnly = false;
          console.log('this.invitationCode is null')
        }

      })
    },
    //客户经理或区域邀请码
    getInvitateCodeMan(){
      //todo later
      var userId = Object.assign({managerId:this.managerId})
      invitateCodeMan(userId).then(res => {
        console.log(res.data.data)
        if(res.data.data.inviteCode){
          this.invitationCode = res.data.data.inviteCode;
          this.isReadOnly = true;
          this.isRequired = true;
        }else{
          this.isReadOnly = false;
          console.log('this.invitationCode is null')
        }

      })
    },
    //识别推荐人
    Identify() {
      var invitationCode = Object.assign({invitationCode:this.invitationCode})
      IdentifyRefer(invitationCode).then(res => {
        console.log(res.data.data);
        this.recommendName = res.data.data;
      })
    },
    //获取手机要验证码
    getValidateCode(){
      var phone = Object.assign({phone:this.userPhone})
      validateCode(phone).then(res => {
        console.log(res.data);
        this.$toast.success(res.data.msg);
      })
      this.isShowSend = false;
    },
    //注册成为推荐人
    onSubmit(values) {
      console.log(values)
      var refeeInfo = Object.assign(values);
      tobeReferee(refeeInfo).then(res => {
        console.log(res.data.data);
        this.$toast(res.data.data.msg);
        this.$router.push('/')

      })
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  }
};
</script>

<style>
</style>
