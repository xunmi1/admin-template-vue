import { isObject, isString, appendNode, removeNode, setStyleProperty, addOnceEvent, delay } from '@/libs/utils';

const BASE_STYLE = ';position: fixed;top: 0;right: 0; bottom: 0;left: 0;transition: all 300ms ease-out;';
const PREVIEW_CONTEXT = '__PREVIEW_CONTEXT__';

const isImageTag = el => el.tagName === 'IMG';

const initialize = (el, value) => {
  if (isString(value)) return { src: value };
  if (isObject(value)) return { ...value };
  // if `el` is `<img />`, and use the `src` attribute
  if (isImageTag(el) && el.src) return { src: el.src };
};

const getScreenSize = () => {
  const html = document.documentElement;
  return { width: html.clientWidth, height: html.clientHeight };
};

const getStartingSize = el => {
  const screen = getScreenSize();
  const [width, height] = [screen.width / 2, screen.height / 2];
  if (isImageTag(el)) return { width: Math.min(el.width, width), height: Math.min(el.height, height) };
  return { width, height };
};

const getScale = img => {
  const screen = getScreenSize();
  const scale = Math.min(screen.width / img.width, screen.height / img.height);
  return Math.floor(scale * 900) / 1000;
};

const createImgNode = (options, el) =>
  new Promise((resolve, reject) => {
    const { width, height } = getStartingSize(el);
    const img = new Image(width, height);
    img.src = options.src;
    img.setAttribute('style', BASE_STYLE + 'margin:auto;object-fit:contain;');
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

const createModal = () => {
  const modalNode = document.createElement('div');
  const style = BASE_STYLE + 'z-index:10000;background:rgba(0,0,0,.45);cursor:zoom-out;';
  modalNode.setAttribute('style', style);
  return modalNode;
};

const bindCloseEvent = (target, close) => {
  addOnceEvent(target, 'click', close);

  const filter = event => {
    const key = event.key ?? event.keyCode;
    // Close if escape key is pressed
    return key === 'Escape' || key === 'Esc' || key === 27;
  };

  addOnceEvent(document, 'keyup', close, {}, filter);
};

const preview = el => {
  const options = el[PREVIEW_CONTEXT].options;
  createImgNode(options, el).then(imgNode => {
    let modalNode = createModal();
    appendNode(modalNode, imgNode);
    appendNode(document.body, modalNode);

    const scale = options.scale ?? getScale(imgNode);
    setStyleProperty(imgNode, 'transform', `scale(${scale})`);
    const remove = () => {
      removeNode(modalNode);
      modalNode = imgNode = null;
    };
    const close = () => {
      if (!modalNode) return;
      setStyleProperty(imgNode, 'transform', 'scale(1)');
      delay(300).then(remove);
    };

    bindCloseEvent(modalNode, close);
    el[PREVIEW_CONTEXT].remove = remove;
  });
};

export default {
  bind(el, { value }) {
    const options = initialize(el, value);
    if (!options) return;

    const cursor = isImageTag(el) ? 'zoom-in' : 'pointer';
    setStyleProperty(el, 'cursor', cursor);

    const handler = () => preview(el);
    el[PREVIEW_CONTEXT] = { options, handler };
    el.addEventListener('click', handler);
  },

  update(el, { value }) {
    el[PREVIEW_CONTEXT].options = initialize(el, value);
  },

  unbind(el) {
    el.removeEventListener('click', el[PREVIEW_CONTEXT].handler);
    // remove modal
    el[PREVIEW_CONTEXT].remove?.();
    el[PREVIEW_CONTEXT] = undefined;
  },
};
