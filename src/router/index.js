import Vue from 'vue'
import Router from 'vue-router'
//客户经理录入车辆和个人信息
import index from '@/components/index'
import carInfoOCR from '../views/managerDo/carInfoOCR'
import carInfoHandFill from '../views/managerDo/carInfoHandFill.vue'
import carEvaluatingPrice from '../views/managerDo/carEvaluatingPrice.vue'
import carNeedAuth from '../views/managerDo/carNeedAuth'
import user from '../views/managerDo/user.vue'
//完成初筛
import screening from '../views/managerDo/screening.vue'
import screenResult from '../views/managerDo/screenResult.vue'
import chooseInvestor from '../views/managerDo/chooseInvestor.vue'
//用户实名认证
import userCertificate from '../views/UserInfo/userCertificate.vue'
import startCertificate from '../views/UserInfo/startCertificate.vue'
import authorizationBook from '../views/UserInfo/authorizationBook'
import pdf from '../views/UserInfo/pdf.vue'
//签名
import signature from '../views/UserInfo/signature'
import certificateResult from '../views/UserInfo/certificateResult.vue'
//直销实名认证
import directSell from '@/components/directSell.vue'

//初筛结果
//查询结果
import search from '../views/Search/search'
//temp临时
import temp from '../views/Temp/index.vue'
import hover from '../views/Temp/hover'

//直销
import carModel from '../views/directSell/carModel'
import register from '../views/directSell/register'
import zhuanXiangDai from '../views/directSell/zhuanXiangDai'
import pushSuccess from '../views/directSell/pushSuccess'
//直销实名认证
import DirectSellUserCertificate from '../views/directSell/DirectSellUserCertificate'
import directSellScreening from '../views/directSell/directSellScreening'

//代理人直销
import directSellAgent from '@/components/directSellAgent.vue'
//渠道直销
import channelDirectSell from '@/components/channelDirectSell'
Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'temp',
      component: temp,
    },
    {
      path: '/hover',
      name: 'hover',
      component: hover,
    },
    {
      path: '/drag',
      name: 'drag',
      component: () => import("../views/Drag/drag"),
    },
    {
      path: '/dragDemo',
      name: 'dragDemo',
      component: () => import("../views/Drag/dragDemo"),
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import("../views/Drag/booking"),
    },
    {
      path: '/index',
      name: 'index',
      component: index,
    },
    {
      path: '/carInfoOCR',
      name: 'carInfoOCR',
      component: carInfoOCR,
    },
    {
      path: '/carInfoHandFill',
      name: 'carInfoHandFill',
      component: carInfoHandFill,
    },
    {
      path: '/carEvaluatingPrice',
      name: 'carEvaluatingPrice',
      component: carEvaluatingPrice,
    },
    {
      path: '/carNeedAuth',
      name: 'carNeedAuth',
      component: carNeedAuth,
    },
    {
      path: '/user',
      name: 'user',
      component: user,
    },
    {
      path: '/userCertificate',
      name: 'userCertificate',
      component: userCertificate,
    },
    {
      path: '/screening',
      name: 'screening',
      component: screening,
    },
    {
      path: '/startCertificate',
      name: 'startCertificate',
      component: startCertificate,
    },
    {
      path: '/authorizationBook',
      name: 'authorizationBook',
      component: authorizationBook,
    },
    {
      path: '/certificateResult',
      name: 'certificateResult',
      component: certificateResult,
    },

    {
      path: '/directSell',
      name: 'directSell',
      component: directSell,
    },
    {
      path: '/search',
      name: 'search',
      component: search,
    },
    {
      path: '/signature',
      name: 'signature',
      component: signature,
    },
    {
      path: '/carModel',
      name: 'carModel',
      component: carModel,
    },
    {
      path: '/screenResult',
      name: 'screenResult',
      component: screenResult,
    },
    {
      path: '/chooseInvestor',
      name: 'chooseInvestor',
      component: chooseInvestor,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/zhuanXiangDai',
      name: 'zhuanXiangDai',
      component: zhuanXiangDai,
      meta: {
        keepAlive: true,//此组件不需要被缓存
      }
    },
    {
      path: '/DirectSellUserCertificate',
      name: 'DirectSellUserCertificate',
      component: DirectSellUserCertificate,
    },
    {
      path: '/directSellScreening',
      name: 'directSellScreening',
      component: directSellScreening,
    },
    {
      path: '/pdf',
      name: 'pdf',
      component: pdf,
    },
    {
      path: '/pushSuccess',
      name: 'pushSuccess',
      component: pushSuccess,
    },
    {
      path: '/directSellAgent',
      name: 'directSellAgent',
      component: directSellAgent,
    },
    {
      path: '/channelDirectSell',
      name: 'channelDirectSell',
      component: channelDirectSell,
    }
  ]
})
