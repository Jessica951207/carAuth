<template>
      <section class="signature">
        <div class="signatureBox">
              <div class="canvasBox" ref="canvasHW">
                <canvas ref="canvasF" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd' @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></canvas>
                <p class="title">请填写您的真实姓名</p>
                <div class="btnBox">
                  <van-button type="info" @click="overwrite">重写</van-button>
                  <van-button type="info" @click="checkImg">查看</van-button>
                </div>
                <van-popup v-model="show">
                  <img class="imgCanvas" :src="imgUrl">
                  <div class="btnBox">
                    <van-button type="info" v-show="showBtn" @click="commit">提交签名</van-button>
                  </div>
                </van-popup>
              </div>
          </div>
        <van-overlay :show="showLoading">
          <div class="wrapper">
            <van-loading type="spinner" />
          </div>
        </van-overlay>
      </section>
</template>

<script>
  import { GetOs } from '../../common/common'
  import { personSign } from '../../request/api'
  export default {
    data() {
      return {
        imgUrl:'',
        client: {},
        points: [],
        canvasTxt: null,
        startX: 0,
        startY: 0,
        moveY: 0,
        moveX: 0,
        endY: 0,
        endX: 0,
        w: null,
        h: null,
        isDown: false,
        isViewAutograph: this.$route.query.isViews > 0,
        contractSuccess: this.$route.query.contractSuccess,
        show:false,
        checkOrder:'',
        lng:'',
        lat:'',
        ip:'',
        deviceInfo:'',
        gpsAddress:'',
        agreement:'',
        flag:'',
        showBtn:false,
        showLoading:false

      }
    },
    mounted() {
      console.log(this.$store.state.managerId,this.$store.state.branchLoanId,this.$store.state.state,this.$store.state.id,this.$store.state.type,this.$store.state.clueId)

      this.id = this.$store.state.id;
      this.checkOrder = this.$store.state.checkOrder;
      console.log(this.id,this.checkOrder)

      let canvas = this.$refs.canvasF
      canvas.height = this.$refs.canvasHW.offsetHeight
      canvas.width = this.$refs.canvasHW.offsetWidth
      this.canvasTxt = canvas.getContext('2d')

      //获取经纬度
      AMap.service(["AMap.Geolocation"], () => {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: false, //是否使用高精度定位，默认:true
          timeout: 5000 //超过5秒后停止定位，默认：无穷大
        });
        //  获取位置信息
        geolocation.getCurrentPosition((status, result) => {
          if (result && result.position) {
            this.lng = result.position.lng;
            this.lat = result.position.lat;
            // alert(this.lng +','+ this.lat)
          }
        });
      });

      // ip
      this.ip = returnCitySN['cip']
      console.log('this.ip',this.ip)
      //获取设备信息
      this.deviceInfo = GetOs();
      console.log('this.deviceInfo',this.deviceInfo)

    },
    watch:{
      flag(newFlag,oldFlag){
        if(this.flag != ""){
          this.showBtn = true;
          console.log(newFlag,oldFlag)
        }else{
          this.showBtn = false;
        }

      }
    },
    methods: {
      //提交签名
      commit() {
        const toast = this.$toast.loading({
          duration: 0,
          message: '提交中...',
          forbidClick: true,
          loadingType: 'spinner',
        });

        //判断touchStart方法有没有调用
        this.imgUrl=this.$refs.canvasF.toDataURL();
        console.log(this.imgUrl) //签名img回传后台
        this.show = false;
        if(this.lng == '' || this.lat ===''){
          this.gpsAddress = "";
        }else{
          this.gpsAddress = this.lng +','+ this.lat;
        }
        //todo later
        var personInfo = Object.assign(
          {id:this.id},
          {gpsAddress: this.gpsAddress},
          {ipAddress:this.ip},
          {deviceInfo:this.deviceInfo},
          {checkOrder:this.checkOrder},
          {signature:this.imgUrl},

        )
        console.log(personInfo)
        personSign(personInfo).then(res => {
          toast.clear();
          console.log(res.data.data)
          if(res.data.data.state === "00000"){
            console.log("这是pdf链接",res.data.data.agreement)
            this.agreement = res.data.data.agreement;
            this.$store.state.agreement = res.data.data.agreement;
            this.$toast.success(res.data.data.erMsg)
            this.$router.push({
              path:'/certificateResult',
            })
            console.log(this.agreement)
          }else if(res.data.data.state === "30000"){
            this.$toast.fail(res.data.data.error_msg)
          }
        })
      },
      //查看图片
      checkImg(){
        this.imgUrl=this.$refs.canvasF.toDataURL();
        this.show = true;
      },
      //mobile
      touchStart(ev) {
        ev = ev || event
        ev.preventDefault()
        if (ev.touches.length == 1) {
          let obj = {
            x: ev.targetTouches[0].clienX,
            y: ev.targetTouches[0].clientY - 20
          }
          this.startX = obj.x
          this.startY = obj.y
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
        }

      },
      touchMove(ev) {
        ev = ev || event
        ev.preventDefault()
        if (ev.touches.length == 1) {
          let obj = {
            x: ev.targetTouches[0].clientX-0,
            y: ev.targetTouches[0].clientY - 20
          }
          this.moveY = obj.y
          this.moveX = obj.x
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.startY = obj.y
          this.startX = obj.x
          this.points.push(obj)
        }
      },
      touchEnd(ev) {
        ev = ev || event
        ev.preventDefault()
        if (ev.touches.length == 1) {
          let obj = {
            x: ev.targetTouches[0].clientX-0,
            y: ev.targetTouches[0].clientY - 20
          }
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
        }
        return this.flag = 1;
      },
      //pc
      mouseDown(ev) {
        ev = ev || event
        ev.preventDefault()
        console.log(ev)
        if (1) {
          let obj = {
            x: ev.offsetX,
            y: ev.offsetY
          }
          console.log(obj)
          this.startX = obj.x
          this.startY = obj.y
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
          this.isDown = true
        }
      },
      mouseMove(ev) {
        ev = ev || event
        ev.preventDefault()
        if (this.isDown) {
          let obj = {
            x: ev.offsetX,
            y: ev.offsetY
          }
          this.moveY = obj.y
          this.moveX = obj.x
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.startY = obj.y
          this.startX = obj.x
          this.points.push(obj)
        }
      },
      mouseUp(ev) {
        ev = ev || event
        ev.preventDefault()
        if (1) {
          let obj = {
            x: ev.offsetX,
            y: ev.offsetY
          }
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
          this.points.push({x: -1, y: -1})
          this.isDown = false
        }
      },
      //重写
      overwrite() {
        this.showBtn = false;
        this.flag = '';
        this.canvasTxt.clearRect(0, 0, this.$refs.canvasF.width, this.$refs.canvasF.height)
        this.points = []
      },

    }
  }
</script>

<style scoped>
  .title{
    text-align: center;
  }
  .signature{
    width: 100%;
  }
  .signatureBox {
    width: 90%;
    margin: 5% auto;
    box-sizing: border-box;
    /*background: red;*/

  }
  .canvasBox {
    box-sizing: border-box
  }
  canvas {
    border: 1px solid #7d7d7d;
  }
  .btnBox {
    padding: 10px;
    text-align: center;
  }
  /*.btnBox button:first-of-type {*/
    /*background: transparent;*/
    /*border-radius: 4px;*/
    /*height: 40px;*/
    /*width: 80px;*/
    /*font-size: 14px;*/
  /*}*/
  /*.btnBox button:last-of-type {*/
    /*background: #71b900;*/
    /*color: #fff;*/
    /*border-radius: 4px;*/
    /*height: 40px;*/
    /*width: 80px;*/
    /*font-size: 14px;*/
  /*}*/
</style>
