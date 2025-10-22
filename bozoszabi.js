(function() {
  // Variables
  var $curve = document.getElementById("curve");
  var last_known_scroll_position = 0;
  var defaultCurveValue = 350;
  var curveRate = 3;
  var ticking = false;
  var curveValue;

  // Handle the functionality
  function scrollEvent(scrollPos) {
    if (scrollPos >= 0 && scrollPos < defaultCurveValue) {
      curveValue = defaultCurveValue - parseFloat(scrollPos / curveRate);
      $curve.setAttribute(
        "d",
        "M 800 300 Q 400 " + curveValue + " 0 300 L 0 0 L 800 0 L 800 300 Z"
      );
    }
  }

  // Scroll Listener
  // https://developer.mozilla.org/en-US/docs/Web/Events/scroll
  window.addEventListener("scroll", function(e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function() {
        scrollEvent(last_known_scroll_position);
        ticking = false;
      });
    }

    ticking = true;
  });
})();


function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }

  function checkScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-anim');
    elements.forEach(el => {
      if (isInViewport(el)) {
        el.classList.add('in-view');
      } else {
        el.classList.remove('in-view');
      }
    });
  }

  document.addEventListener('scroll', checkScrollAnimations);
  document.addEventListener('DOMContentLoaded', checkScrollAnimations);

function lerpelScroll() {
  const ism = document.querySelector('.ism');
  const tobbi = document.querySelector('.tobbi');

  if (!ism || !tobbi) return;

  const rect = ism.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  let progress = (windowHeight - rect.bottom) / rect.height;
  progress = Math.min(Math.max(progress, 0), 1);

  const speedFactor = 1.5; // nagyobb szám = gyorsabb, nagyobb csúszás
  let translateY = 100 - progress * 100 * speedFactor;
  translateY = Math.min(100, Math.max(0, translateY));

  tobbi.style.transform = `translateY(${translateY}%)`;
}

window.addEventListener('scroll', lerpelScroll);
window.addEventListener('resize', lerpelScroll);
document.addEventListener('DOMContentLoaded', lerpelScroll);