import { isObject, isString } from '@/libs/utils';

export default {
  zoomImg: {
    inserted(el, { value }) {
      const options = initValue(value);
      if (!options) return;
      el.style.cursor = el.tagName === 'IMG' ? 'zoom-in' : 'pointer';
      el.addEventListener('click', () => preview(options));
    },
  },
};

const preview = function (options) {
  const baseStyle = ';position: fixed;top: 0;right: 0; bottom: 0;left: 0;transition: all 0.35s ease-out;';
  let imgNode = createImgNode(options, baseStyle);
  let modalNode = createModal(imgNode, baseStyle);
  document.body.appendChild(modalNode);
  modalNode.onclick = function () {
    imgNode.style.transform = `scale(${1})`;
    this.style.backgroundColor = 'rgba(0, 0, 0, .15)';
    setTimeout(() => {
      modalNode.parentNode.removeChild(modalNode);
      modalNode = imgNode = null;
    }, 120);
  };
};

const initValue = function (value) {
  if (isString(value)) return { src: value };
  if (isObject(value)) return { ...value };
};

const getScale = function (img) {
  const [clientWidth, clientHeight] = [document.body.clientWidth, document.body.clientHeight];
  const scale = Math.min(clientWidth / img.width, clientHeight / img.height);
  return Math.floor(scale * 900) / 1000;
};

const createImgNode = function (options, style) {
  const img = new Image();
  img.src = options.src;
  img.style.cssText = style + 'margin: auto;cursor: zoom-out;';
  img.onload = () => (img.style.transform = `scale(${options.scale || getScale(img)})`);
  return img;
};

const createModal = function (imgNode, style) {
  const modalNode = document.createElement('div');
  modalNode.style.cssText = style + 'z-index: 10000;background-color: rgba(0, 0, 0, .65)';
  modalNode.appendChild(imgNode);
  return modalNode;
};
