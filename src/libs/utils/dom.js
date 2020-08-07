/**
 * append node
 * @param parent {Node}
 * @param child {Node}
 * @return {void}
 */
export function appendNode(parent, child) {
  parent.appendChild(child);
}

/**
 * remove node
 * @param node
 * @return {void}
 */
export function removeNode(node) {
  node.parentNode?.removeChild(node);
}

/**
 * Set a Style property
 * @param target {ElementCSSInlineStyle}
 * @param propertyName {string}
 * @param value {number|string}
 * @param [priority] {string}
 */
export function setStyleProperty(target, propertyName, value, priority) {
  target.style.setProperty(propertyName, String(value), priority);
}

/**
 * add a one-time event
 * @param target {EventTarget}
 * @param eventName {string}
 * @param listener {Function}
 * @param [options] {EventListenerOptions}
 * @param [filter] {Event => boolean}
 */
export function addOnceEvent(target, eventName, listener, options, filter) {
  const wrappedListener = event => {
    listener(event);
    if (!filter || filter(event)) {
      target.removeEventListener(eventName, wrappedListener, options);
    }
  };

  target.addEventListener(eventName, wrappedListener, options);
}
