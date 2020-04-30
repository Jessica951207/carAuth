<template>
  <div class="draftBox">
    <!--S 拖动组件 -->
    <div class="drag" id="moveDiv"
         @mousedown="start($event)" @touchstart="start($event)"
         @mousemove="move($event)" @touchmove="move($event)"
         @mouseup="end($event)" @touchend="end($event)" @click="clickDraft">
      <slot name="drag-cont"></slot>
    </div>
    <!--E 拖动组件 -->
    <van-popup v-model="showMan" :style="{ width: '50%',padding:'3%' }" >
      <div>
        <p>客户经理姓名：{{managerName}}</p>
        <p>手机号：{{phoneNum}}</p>
      </div>
    </van-popup>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        position: {x: 0,y: 0}, // 鼠标点击的x轴和y轴的距离
        nx: '',    // 鼠标当前距离元素的左侧距离
        ny: '',    // 鼠标当前距离元素的顶部距离
        dx: '',    // 元素距离左侧的距离
        dy: '',    // 元素距离顶部的距离
        xPum: '',  // 元素移动的x轴距离
        yPum: '',  // 元素移动的y轴距离
        showMan:false,
        managerName:'与非',
        phoneNum:'12593333333'
      }
    },
    methods: {
      //点击
      clickDraft(){
        this.showMan = true;
        // this.$dialog.confirm({
        //   // title: '标题',
        //   message: '客户经理姓名',
        // })
        //   .then(() => {
        //     // on confirm
        //   })
        //   .catch(() => {
        //     // on cancel
        //   });
      },
      start(e){
        // 如果touches存在就说明是移动端
        // 否则为pc端直接获取事件源对象
        let touch = e.touches? e.touches[0] : e;
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.dx = moveDiv.offsetLeft;
        this.dy = moveDiv.offsetTop;
      },
      move(e){
        let touch = e.touches? e.touches[0] : e;
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx+this.nx;
        this.yPum = this.dy+this.ny;
        moveDiv.style.left = this.xPum + "px";
        moveDiv.style.top = this.yPum + "px";
        document.addEventListener("touchmove",function(){
          event.preventDefault();
        },{ passive: false });
        if(e.preventDefault){
          e.preventDefault();
        }else{
          window.event.returnValue == false;
        }
      },
      end(e){
        let sWidth = window.screen.width ;//屏幕分辨率的宽
        let sHeight = window.screen.height ;//屏幕分辨率的高

        let oWidth = moveDiv.offsetWidth; // Element Width
        let oWrapWidth = moveDiv.parentNode.offsetWidth; // Parent Element Width
        let oWrprapHeight = moveDiv.parentNode.offsetHeight; // Parent Element Height
        let sumWidth = moveDiv.offsetLeft + oWidth; // Element Left + Element Width
        let sumHeight = moveDiv.offsetTop + moveDiv.offsetHeight; // Element Top + Element Height
        // The Limit Deal
        if(moveDiv.offsetLeft < 0) {
          moveDiv.style.left = 0;
        } else if(sumWidth > oWrapWidth){
          moveDiv.style.left = oWrapWidth - oWidth + 'px';
        } else if(moveDiv.offsetTop < 0 ) {
          moveDiv.style.top = 0;
        } else if(sumHeight > oWrprapHeight) {
          moveDiv.style.top = oWrprapHeight - moveDiv.offsetHeight + 'px';
        }
        else if(moveDiv.offsetLeft <= sWidth / 2 && moveDiv.offsetTop > 150){
          moveDiv.style.left = 0;
        }else if(moveDiv.offsetLeft > sWidth / 2){
          moveDiv.style.left = oWrapWidth - oWidth + 'px';
        }else if(moveDiv.offsetTop <= sHeight / 2 ){
          moveDiv.style.top = 0;
        }else if(moveDiv.offsetTop > sHeight / 2){
          moveDiv.style.top = oWrprapHeight - moveDiv.offsetHeight + 'px';
        }
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }
</script>
​
<style scoped>
  .draftBox{
    width: 100%;
    height:800px;
  }
  .drag {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
  }
  .drag {
    width: 60px;
    height: 60px;
    background-color: rgba(0, 0, 0,.55);
    text-align: center;
    line-height: .6rem;
    font-size: .14rem;
    color: #ffffff;
    border-radius: 50%;
  }
</style>
