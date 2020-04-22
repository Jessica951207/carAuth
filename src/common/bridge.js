function setupWebViewJavascriptBridge (callback) {

      if (window.WebViewJavascriptBridge) {
    
        return callback(window.WebViewJavascriptBridge)  }
    
      if (window.WVJBCallbacks) {
    
        return window.WVJBCallbacks.push(callback)  }
    
      window.WVJBCallbacks = [callback]
    
      let WVJBIframe = document.createElement('iframe')
    
      WVJBIframe.style.display = 'none'
    
      WVJBIframe.src = 'https://__bridge_loaded__'  
      document.documentElement.appendChild(WVJBIframe)
    
      setTimeout(() => {
    
        document.documentElement.removeChild(WVJBIframe)  }, 0)
    
    }
    
    export default {
    	//js调用oc的方法  clickHeadImage(方法名与APP端保持一致)  大括号内是传递参数的方式
        callhandler (name, data, callback) {

                setupWebViewJavascriptBridge(function (bridge) {
                      bridge.callHandler(name, data, callback)    })
                },
     //oc调用Js的方法，并且有返回函数   callHeandler(方法名与app端保持一致)  data（IOS传过来的数据）
        registerhandler (name, callback) {
    
                setupWebViewJavascriptBridge(function (bridge) {
                          bridge.registerHandler(name, function (data, responseCallback) {

                    callback(data, responseCallback)

              })
    
          })
    
      }
    
    }
