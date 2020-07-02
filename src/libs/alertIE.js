const UA = window.navigator.userAgent.toLowerCase();
const isIE = UA && /msie|trident/.test(UA);

const createAlertNode = function (text) {
  const alertNode = document.createElement('div');
  alertNode.innerHTML = text;
  alertNode.style.cssText =
    '; position: fixed; z-index: 100000;' +
    'width: 100%; top: 0; line-height: 36px;text-align: center;' +
    'color: #fff; background: #ffad14; transition: all .3s';
  return alertNode;
};

const createCloseNode = function () {
  const closeNode = document.createElement('a');
  closeNode.innerText = '关闭';
  closeNode.style.cssText = ';float:right; padding: 0 16px; cursor: pointer';
  return closeNode;
};

const closeAlert = function () {
  const dom = this.parentNode;
  this.parentNode.style.top = '-36px';
  this.parentNode.style.opacity = '.6';
  setTimeout(function () {
    document.documentElement.removeChild(dom);
  }, 3000);
};

if (isIE) {
  let alertText =
    '您的浏览器浏览效果不佳，推荐使用' +
    '<a href="https://www.google.cn/chrome/"> Chrome </a>或' +
    '<a href="https://www.mozilla.org/zh-CN/firefox/"> Firefox </a>浏览器';

  const alertNode = createAlertNode(alertText);
  const closeNode = createCloseNode();
  closeNode.onclick = closeAlert;
  alertNode.appendChild(closeNode);
  document.documentElement.appendChild(alertNode);
}
