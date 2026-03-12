gsap.registerPlugin(MotionPathPlugin);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const orbitIcons = Array.from(document.querySelectorAll(".js-orbit-icon"));
const staticIcons = Array.from(document.querySelectorAll(".orbit-icon--static"));

let orbitTweens = [];
let sceneTweens = [];

function debounce(fn, delay = 200) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function clearOrbitTweens() {
  orbitTweens.forEach((tween) => tween.kill());
  orbitTweens = [];
}

function clearSceneTweens() {
  sceneTweens.forEach((tween) => tween.kill());
  sceneTweens = [];
}

function positionOrAnimateIcons() {
  clearOrbitTweens();

  orbitIcons.forEach((icon) => {
    const pathSelector = icon.dataset.path;
    const duration = Number(icon.dataset.duration) || 30;
    const start = Number(icon.dataset.start) || 0;
    const path = document.querySelector(pathSelector);

    if (!path) return;

    if (prefersReducedMotion) {
      gsap.set(icon, {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
          start: start
        }
      });
      return;
    }

    const tween = gsap.to(icon, {
      duration: duration,
      repeat: -1,
      ease: "none",
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
        start: start,
        end: start + 1
      }
    });

    orbitTweens.push(tween);
  });
}

function animateStaticIcons() {
  if (prefersReducedMotion) return;

  staticIcons.forEach((icon, index) => {
    const tween = gsap.to(icon, {
      y: index % 2 === 0 ? -4 : 4,
      opacity: 0.96,
      duration: 3.8 + index * 0.35,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    sceneTweens.push(tween);
  });
}

function animateScene() {
  clearSceneTweens();

  if (prefersReducedMotion) return;

  const orbitScene = document.querySelector(".orbit-scene");
  const vortexGlow = document.querySelector(".vortex-glow");
  const haze = document.querySelectorAll(".scene-haze-a, .scene-haze-b");
  const orbitBlur = document.querySelectorAll(".orbit-blur");
  const orbitBackRing = document.querySelectorAll(".orbit-back-ring");

  if (orbitScene) {
    const orbitSceneTween = gsap.to(orbitScene, {
      x: 24,
      y: -12,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      force3D: true
    });

    sceneTweens.push(orbitSceneTween);
  }

  if (vortexGlow) {
    const glowTween = gsap.to(vortexGlow, {
      scale: 1.06,
      opacity: 1,
      duration: 5.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "50% 50%",
      force3D: true
    });

    sceneTweens.push(glowTween);
  }

  if (haze.length) {
    const hazeTween = gsap.to(haze, {
      opacity: "+=0.06",
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3
    });

    sceneTweens.push(hazeTween);
  }

  if (orbitBlur.length) {
    const blurTween = gsap.to(orbitBlur, {
      opacity: "+=0.05",
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.25
    });

    sceneTweens.push(blurTween);
  }

  if (orbitBackRing.length) {
    const ringTween = gsap.to(orbitBackRing, {
      opacity: "+=0.03",
      duration: 6.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    });

    sceneTweens.push(ringTween);
  }
}

function initAnimations() {
  positionOrAnimateIcons();
  animateScene();
  animateStaticIcons();
}

initAnimations();

window.addEventListener(
  "resize",
  debounce(function () {
    positionOrAnimateIcons();
    animateScene();

    if (window.AOS) {
      AOS.refresh();
    }
  }, 220)
);


window.addEventListener("load", function () {
  const sceneWrap = document.querySelector(".scene-aos-wrap");

  if (sceneWrap) {
    requestAnimationFrame(() => {
      sceneWrap.classList.add("is-visible");
    });
  }
});