<template>
  <div>
    <van-nav-bar title="实名认证" />

    <!-- 短信验证码 -->
    <van-popup v-model="isShowVerify" position="bottom" :close-on-click-overlay="false">
      <div class="getVerift">
        <div class="getVerift-title">正在完成实名认证操作</div>
        <div class="getVerift-content">已经向尾号{{this.phone.substr(7)}}发送短信验证码</div>
        <div class="getVerift-verift">
          <van-field maxlength="6" type="digit" v-model="verifyCode" label="短信验证码" placeholder="请输入短信验证码"
            :rules="[{ required: true, message: '请输入短信验证码'}]">
            <template #button>
              <van-button v-if="isShowSend" size="small" type="primary" button-type="info" native-type="button" @click="sendAuthCode" :disabled="isOK" >发送验证码</van-button>
              <van-button v-else size="small" type="primary" button-type="info" native-type="button">
                <template >
                  <van-count-down :time="60000" format=" ss 秒" @finish="isShowSend = true" style="color:#fff"/>
                </template>
              </van-button>
            </template>
          </van-field>
        </div>
        <div style="margin:20px">
          <van-button style="margin-top:25px" round block type="info" :disabled="isOK" @click="authCodeOK">确认</van-button>
        </div>
      </div>
    </van-popup>

    <div>
      <div class="getVerift-title">客户基本信息</div>
      <van-field v-model="name" name="name" label="姓名" />
      <van-field v-model="IdNumCut" name="IdNumCut" label="身份证号" />
      <van-field v-model="phoneCut" name="phoneCut" label="手机号" />
      <div class="getVerift-title">请上传身份证信息</div>
      <div class="verift-photo">
        <div class="item1">
          <!--身份证上传-->
          <van-uploader
            v-model="fileList1"
            :max-count="1"
            :after-read="afterReadEmblem"
            :max-size = "7 * 1024 * 1024"
            @oversize="oversize"
          />
        </div>
        <div class="item2">
          <van-uploader
            v-model="fileList2"
            :max-count="1"
            :after-read="afterReadFace"
            :max-size = "7 * 1024 * 1024"
            @oversize="oversize"
          />
        </div>
      </div>

      <!--<div class="verift-photo">-->
        <!--<div class="verift-photo-item">-->
          <!--<input-->
            <!--style="display:none"-->
            <!--type="file"-->
            <!--id="uploadFile1"-->
            <!--accept="image/*"-->
            <!--capture="camera"-->
            <!--v-on:change="select1()"-->
          <!--/>-->
          <!--<van-image class="verift-photo-item-image" :src="src1" @click="imgClick1" />-->
          <!--<div>国徽面</div>-->
        <!--</div>-->

        <!--<div class="verift-photo-item">-->
          <!--<input-->
            <!--style="display:none"-->
            <!--type="file"-->
            <!--id="uploadFile2"-->
            <!--accept="image/*"-->
            <!--capture="camera"-->
            <!--v-on:change="select2()"-->
          <!--/>-->
          <!--<van-image class="verift-photo-item-image" :src="src2" @click="imgClick2" />-->
          <!--<div>头像面</div>-->
        <!--</div>-->
      <!--</div>-->

      <van-overlay :show="showLoading">
        <div class="wrapper">
          <van-loading size="30px">ocr识别中...</van-loading>
        </div>
      </van-overlay>
    </div>
    <div style="margin:20px">
      <van-button style="margin-top:25px" round block type="info" @click="faceRecognize">开始人脸识别</van-button>
    </div>
  </div>
</template>

<script>
import { getUrlParam } from "../../common/common.js";
import { checkTokenAndSendMsg , checkSmsCodeDirectSale ,sendCodeAgain,OCRIdCard,saveUserIdCard ,startCheckFace ,authorizationState} from "../../request/api"

export default {
  data() {
    return {
      state: "",
      isShowVerify: true,
      time: 60000,
      verifyCode:'',
      name: "",
      idNum: "",
      IdNumCut:'',
      phone:'',
      phoneCut:'',
      token:'',
      fileList1:[],
      fileList2:[],
      id:'',
      showLoading:false,
      IdNumber:'',
      idCardUrlEmblem: "",
      idCardUrlFace: "",
      isShowSend:true,
      scanFaceUrl:'',
      isOK:false

    };
  },
  mounted() {
    this.$store.commit('updateParam',getUrlParam())
    this.token = this.$store.state.token;
    console.log("this.$store.state.token",this.$store.state.token)
    console.log("this.$store.state.id",this.$store.state.id)
    console.log(this.$store.state.managerId,this.$store.state.branchLoanId,this.$store.state.state,this.$store.state.id,this.$store.state.type,this.$store.state.clueId)

    this.getVerifyToken();
  },
  methods: {
    //图片超过7M
    oversize(){
      this.$toast.fail("图片大小不能超过7M！")
    },
    //人脸识别
    faceRecognize() {
      console.log("人脸识别id",this.$store.state.id)

      if(this.idCardUrlFace != "" && this.idCardUrlEmblem !=""){
        const toast = this.$toast.loading({
          duration: 0,
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
        });

        var userIdCard = Object.assign(
          {phone:this.phone},
          {name:this.name},
          {idNum:this.idNum},
          {idCardFront:this.idCardUrlFace},
          {idCardBack:this.idCardUrlEmblem}

        )
        var personState = Object.assign(
          {name:this.name},
          {idNumber:this.idNum},
          {phone:this.phone},
        )
        //todo later
        var userVo = Object.assign(
          {name:this.name},
          {idNo:this.idNum},
          {from:'App'},
          {state:this.$store.state.state},
          {id:this.$store.state.id},
          {managerId:this.$store.state.managerId},
          {type:this.$store.state.type},
          {clueId:this.$store.state.clueId},
          {branchLoanId:this.$store.state.branchLoanId}
        )
        console.log("userVo is====",userVo)
        //todo later
        //保存身份证正反面信息
        saveUserIdCard(userIdCard).then(res => {
          console.log(res.data.data)
          if(res.data.data.stateCode === 1){
            //人员签约状态
            authorizationState(personState).then(res => {
              console.log(res.data.data)
              //未完成签约认证，去人脸核身 已签约为00000，未签约为20000
              if(res.data.data.state == "20000"){
                //人脸核身
                startCheckFace(userVo).then(res => {
                  toast.clear()
                  this.scanFaceUrl = res.data.data;
                  console.log(this.scanFaceUrl)
                  //todo later
                  window.location.href = this.scanFaceUrl;
                })
              }else{
                toast.clear()
                this.$store.state.agreement = res.data.data.agreement;
                this.$router.push({
                  path:'/certificateResult',
                })

              }
            })

          }else{
            this.$toast.fail('保存失败！')
          }
        })

        //test
        // this.$router.push({path:'/startCertificate'})

      }else{
        this.$toast.fail("请上传身份证！");
      }



    },
    //国徽面识别
    afterReadEmblem(file){
      var baseImgUrl = file.content;
      const toast = this.$toast.loading({
        duration: 0,
        message: 'ocr识别中...',
        forbidClick: true,
        loadingType: 'spinner',
      });

      OCRIdCard(baseImgUrl).then(res => {
        toast.clear();
        if(res.data.data != ""){
          console.log(res.data.data)
          if(res.data.data.userInfo.IdNum == ""){
            this.$toast.success(res.data.msg);
            this.idCardUrlEmblem = res.data.data.idCardUrl
          }else{
            this.$toast.fail("请上传国徽面！")
          }

        }
        else{
          this.$toast.fail(res.data.msg)
        }

      })

    },
    //人像面识别
    afterReadFace(file){
      var baseImgUrl = file.content;
      const toast = this.$toast.loading({
        duration: 0,
        message: 'ocr识别中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      OCRIdCard(baseImgUrl).then(res => {
        toast.clear();
        if(res.data.data != ""){
          console.log(res.data.data)
          if(res.data.data.userInfo.IdNum != ""){
            this.$toast.success(res.data.msg);
            this.IdNumber = res.data.data.userInfo.IdNum;

            if(this.idNum === this.IdNumber){
              this.idCardUrlFace = res.data.data.idCardUrl;
            }else {
              this.$toast.fail('身份证不一致！');
            }
          }else{
            this.$toast.fail("请上传人像面！")
          }

        }
        else{
          this.$toast.fail(res.data.msg)
        }


      })
    },
    //发送验证码
    sendAuthCode(){
      this.isShowSend = false;
      var phone = this.phone;
      sendCodeAgain(phone).then(res => {
        if(res.data.state === 'Y' && res.data.data.stateCode === 1){
          this.$toast.success('发送成功！')
        }else{
          this.$toast.fail('发送失败！')
        }
      })
    },
    //验证码确认
    authCodeOK() {
      var code = Object.assign(
        // {phone:this.phone},
        {token:this.token},
        {verifyCode:this.verifyCode}
      )
      console.log(code)
      checkSmsCodeDirectSale(code).then(res => {
        console.log("获取三要素",res.data)
        if(res.data.state === 'Y' && res.data.data.stateCode === 1){
          this.$toast.success('验证成功！')
          this.name = res.data.data.name;
          this.idNum = res.data.data.idNum;
          this.phone = res.data.data.phone;

          this.IdNumCut = this.idNum.substr(0, 3) + '************' + this.idNum.substr(this.idNum.length - 4);
          this.phoneCut = '*******' + this.phone.substr(7);

          this.isShowVerify = false;
        }else{
          this.$toast.fail('验证失败！')
        }

      })

    },
    //验证token并发短信
    getVerifyToken(){
      var token = this.token;
      console.log('token is:',token)

      checkTokenAndSendMsg(token).then(res => {
        console.log(res.data)
        if(res.data.state === 'Y'){
          if(res.data.data.stateCode === 1){
            this.phone = res.data.data.phone;
            this.$toast.success("短信发送成功！")
          }else {
            //todo later
            this.isOK = true
            this.$toast(res.data.msg)

          }
        }else{
          this.$toast.fail("获取手机号失败！ ")
        }

      })
    },

    },


    // imgClick1: function() {
    //   document.getElementById("uploadFile1").click();
    // },
    // imgClick2: function() {
    //   document.getElementById("uploadFile2").click();
    // },
    // select1() {
    //   let that = this;
    //   var localFile = document.getElementById("uploadFile1").files[0];
    //   var reader = new FileReader();
    //   var content;
    //   reader.onload = function(event) {
    //     content = event.target.result;
    //     that.src1 = content;
    //   };
    //   reader.onerror = function(event) {
    //     alert("error");
    //   };
    //   content = reader.readAsDataURL(localFile, "UTF-8");
    //   var sss = document.getElementById("uploadFile").value;
    //   console.log(sss);
    // },
    // select2() {
    //   let that = this;
    //   var localFile = document.getElementById("uploadFile2").files[0];
    //   var reader = new FileReader();
    //   var content;
    //   reader.onload = function(event) {
    //     content = event.target.result;
    //     that.src2 = content;
    //   };
    //   reader.onerror = function(event) {
    //     alert("error");
    //   };
    //   content = reader.readAsDataURL(localFile, "UTF-8");
    //   var sss = document.getElementById("uploadFile").value;
    //   console.log(sss);
    // }

};
</script>

<style>
.getVerift-title {
  padding: 15px;
  font-size: 18px;
  color: #3085be;
}
.getVerift-content {
  padding-left: 20px;
  font-size: 14px;
}
.getVerift-verift {
  margin-top: 15px;
  display: flex;
}

.verift-photo-item-image {
  width: 100%;
  height: 100px;
}
</style>

<style>
  .verift-photo {
    width: 90%;
    margin: 0 auto;
    margin-top: 10%;
  }
  .item1{
    width: 75%;
    margin: 0 auto;
    height: 180px;
    border-radius: 6px;
    background: url("../../assets/emblem.png") no-repeat ;
    background-size: contain;
    margin-bottom: 5%;
  }
  .item2{
    width: 75%;
    margin: 0 auto;
    height: 180px;
    border-radius: 6px;
    background: url("../../assets/face.png") no-repeat;
    background-size: contain;
  }
  .verift-photo .van-uploader__input{
    width: auto;
  }
  .verift-photo .van-uploader{
    width: 100%;
  }
  .verift-photo .van-uploader__upload{
    background-color: transparent;
    width: 100%;
    height: 180px;
  }
  .verift-photo .van-uploader__preview-image,.van-uploader__preview{
    width: 100%;
    height: 180px;
    margin: 0;
  }
</style>
