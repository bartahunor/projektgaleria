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

function lerpelFestmenysz() {
    const tobbi = document.querySelector('.tobbi');
    const fest = document.querySelector('.festmenysz');
    if (!tobbi || !fest) return;

    const rectTobbi = tobbi.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Csak akkor kezdjen csúszni, amikor a .tobbi teteje látszik
    if (rectTobbi.top < windowHeight) {
        let progress = (windowHeight - rectTobbi.top) / rectTobbi.height;
        progress = Math.min(Math.max(progress, 0), 1);

        const speedFactor = 1.5; // ugyanolyan, mint a tobbi
        let translateY = 100 - progress * 100 * speedFactor;

        // jobban rámenni: 0% alá is engedjük, max -20%
        translateY = Math.min(100, Math.max(-30, translateY));

        fest.style.transform = `translateY(${translateY}%)`;
    } else {
        fest.style.transform = 'translateY(100%)';
    }
}

window.addEventListener('scroll', lerpelFestmenysz);
window.addEventListener('resize', lerpelFestmenysz);
document.addEventListener('DOMContentLoaded', lerpelFestmenysz);


const container = document.getElementById('parallaxContainer');
const images = document.querySelectorAll('.parallax-image');

let speed = 1; // pixel/másodperc
let paused = false;

function animate() {
  if(!paused) {
    const firstChild = container.firstElementChild;
    let translateX = parseFloat(container.style.transform?.replace('translateX(', '') || 0);
    translateX -= speed;
    
    // ha az első kép teljesen kiment, tegyük a végére
    const firstWidth = firstChild.offsetWidth + 40; // margin
    if(Math.abs(translateX) >= firstWidth) {
      container.appendChild(firstChild);
      translateX += firstWidth;
    }
    
    container.style.transform = `translateX(${translateX}px) translateY(-50%)`;
  }
  requestAnimationFrame(animate);
}

images.forEach(img => {
  img.addEventListener('mouseenter', () => {
    paused = true;
    img.classList.add('hovered');
  });
  img.addEventListener('mouseleave', () => {
    paused = false;
    img.classList.remove('hovered');
  });
});

animate();
