const helper = {
  decodeHtml,
  scrollToElement,
};

export default helper;

/************************************
* public functions
************************************/
function decodeHtml(html) {
  let txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function scrollToElement(container, target, duration = 500, easing = 'easeInQuad') {
  let topPos = 0;
  let parent = target;
  while (parent !== container && !!parent) {
    topPos += parent.offsetTop;
    parent = parent.offsetParent;
  }

  if ('requestAnimationFrame' in window === false) {
    container.scrollTop = topPos;
    return;
  }

  const start = container.scrollTop;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  var prevPos = null
  var direction = (start - topPos) >= 0;

  var scroll = () => {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easingTimeGetters(easing)(time);

    container.scrollTop =  Math.ceil((timeFunction * (topPos - start)) + start);

    if (direction * (container.scrollTop - topPos) <= 0 || container.scrollTop === prevPos) {
      return;
    }

    prevPos = container.scrollTop

    requestAnimationFrame(scroll);
  }

  scroll();
  return false;
}

/************************************
* private functions
************************************/
function easingTimeGetters(easing) {
  var getters = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  return getters[easing];
}
