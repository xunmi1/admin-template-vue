/* eslint-disable */
(function () {
    var getAlertNode = function (text) {
        var alertNode = document.createElement('div');
        alertNode.innerHTML = text;
        alertNode.style.cssText = '; position: fixed; z-index: 100000;' +
            'width: 100%; top: 0; line-height: 36px;text-align: center;' +
            'color: #fff; background: #ffad14; transition: all .3s';
        return alertNode;
    };

    var getCloseNode = function () {
        var closeNode = document.createElement('span');
        closeNode.innerText = '关闭';
        closeNode.style.cssText = ';float:right; padding: 0 16px; cursor: pointer';
        return closeNode;
    };

    var closeAlert = function () {
        var dom = this.parentNode;
        this.parentNode.style.top = '-36px';
        this.parentNode.style.opacity = '.6';
        setTimeout(function () {
            document.documentElement.removeChild(dom);
        }, 3000);
    };

    var UA = typeof window !== 'undefined' && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    var is360 = isIE && !/net clr/.test(UA);
    var alertText = '您的浏览器浏览效果不佳，推荐使用' +
        '<a href="https://www.google.cn/chrome/"> Chrome </a>或' +
        '<a href="https://www.mozilla.org/zh-CN/firefox/"> Firefox </a>浏览器';
    if (isIE) {
        if (is360) {
            alertText = '您的浏览器浏览效果不佳，请将浏览器切换到极速模式';
        }
        var alertNode = getAlertNode(alertText);
        var closeNode = getCloseNode();
        closeNode.onclick = closeAlert;
        alertNode.appendChild(closeNode);
        document.documentElement.appendChild(alertNode);
    }
})();
