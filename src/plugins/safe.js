// 采用common.js语法，用于vue.config.js 引入

// 不断弹出debugger
function showDebugger() {
  (() => {
    function block() {
      setInterval(() => {
        Function("debugger")();
      }, 50);
    }
    block();
  })();
}

// 防调试
function devtools() {
  console.log(process.env.NODE_ENV);
  //此判断时在vue3的环境中使用, 仅当不是DEV时开启, 方便开发
  const emitEvent = (isOpen, orientation) => {
    window.dispatchEvent(
      new CustomEvent("devtoolsChange", {
        detail: {
          isOpen,
          orientation,
        },
      })
    );
  };
  (function () {
    "use strict";

    const devtools = {
      isOpen: false,
      orientation: undefined,
    };

    const threshold = 160;
    const main = ({ emitEvents = true } = {}) => {
      //
      var timeLimit = 50;
      var startTime = new Date();
      if (new Date() - startTime > timeLimit) {
        emitEvent(true, "");
      }

      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? "vertical" : "horizontal";

      if (
        !(heightThreshold && widthThreshold) &&
        ((window.Firebug &&
          window.Firebug.chrome &&
          window.Firebug.chrome.isInitialized) ||
          widthThreshold ||
          heightThreshold)
      ) {
        if (
          (!devtools.isOpen || devtools.orientation !== orientation) &&
          emitEvents
        ) {
          emitEvent(true, orientation);
        }

        devtools.isOpen = true;
        devtools.orientation = orientation;
      } else {
        if (devtools.isOpen && emitEvents) {
          emitEvent(false, undefined);
        }

        devtools.isOpen = false;
        devtools.orientation = undefined;
      }
    };

    main({ emitEvents: false });
    setInterval(main, 500);

    if (typeof module !== "undefined" && module.exports) {
      module.exports = devtools;
    } else {
      window.devtools = devtools;
    }
  })();

  window.addEventListener("devtoolsChange", (event) => {
    const { isOpen } = event.detail;
    if (isOpen) {
      let text =
        "检测到非法调试,您的信息将被上传并通知网站管理方,有关人员将进行调查,请关闭调试窗口后刷新重试!";
      document.body.innerHTML =
        "<h1 style='color:black'>" +
        text +
        "</h1><hr>" +
        "<h1 style='color:white'>" +
        text +
        "</h1>";
    }
  });
}

module.exports = {
  showDebugger,
  devtools,
};
