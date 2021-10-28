'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button scrolling

btnScroll.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(window.pageXOffset, window.pageYOffset);
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // //an old school way
  // window.scrollTo({
  //   //we should put an object
  //   top: s1coords.top + window.pageYOffset,
  //   left: s1coords.left + window.pageXOffset,
  //   behavior: 'smooth',
  // });

  //the modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//with event delegation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching stragedy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////
//Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //guard clause
  if (!clicked) return;

  //active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //activate content area

  document
    .querySelectorAll('.operations__content')
    .forEach(t => t.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//////////
//Sticky navigation

const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function (e) {
  window.scrollY > initialCoords.top
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
});

///////////////////////
//Sticky navigation : Intersection Observer API

// const obsCallback = function (entries) {
//   entries.forEach(entry => console.log(entry));
// };

// const ObsOptions = {
//   root: null, //entire viewport
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, ObsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');

  // if (!entry.isIntersecting) {
  //   nav.classList.add('sticky');
  // } else {
  //   nav.classList.remove('sticky');
  // }
};

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `10%`,
});
headerObserver.observe(header);

//Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//Lazy Loading  Images

const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.15,
  rootMargin: '10%',
});

imgTargets.forEach(function (images) {
  imgObserver.observe(images);
});

/////////////
//Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // slider.style.transform = 'scale(0.5) translateX(-600px)';
  // slider.style.overflow = 'visible';

  const createDots = function () {
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${index}'></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();

  ///////////////Handlers
  //Next Slide
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //NextSlide by keyword event

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      console.log(slide);
      goToSlide(slide);
      activateDots(slide);
    }
  });
};

slider();
/*

/////////////////LECTIONS

//Selectors
const header = document.querySelector('.header');
console.log(document.getElementById('section--1'));
console.log(document.getElementsByTagName('button'));
console.log(document.getElementsByClassName('btn'));

//Creating Elements

const message = document.createElement('div');
message.classList.add('cookie-message');
console.log(message);
// message.textContent = 'We always use cookie-messages';
message.innerHTML =
  'We use cookies for improving our functionality <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
header.append(message);

//delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//styles

message.style.backgroundColor = '#37383d';
message.style.width = '110%';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'purple');

//attributes

const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo.id);

//non-standart attributes
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');
console.log(logo.dataset.versionNumber); //special data attributes

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));




//EVENT LISTENERS

//mouseenter

const h1 = document.querySelector('h1');
const alertH1 = () => {
  console.log('done');
  h1.removeEventListener('mouseenter', alertH1);
};
h1.addEventListener('mouseenter', alertH1);

const navLinks = document.querySelector('.nav__links');
const navContainer = document.querySelector('.nav');

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColour = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColour();
  console.log('nav__link', e.target, e.currentTarget);
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColour();
  console.log('container', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColour();
  console.log('nav', e.target, e.currentTarget);
});



//DOM Travercy

//1.Downward : children
const h1 = document.querySelector('h1');
console.log(h1.querySelector('.highlights'));
console.log(h1.childNodes);
console.log(h1.children);
//also firstElementChild and lastElemebtChild

//2. Going Upward : Parents

//direct parents
console.log(h1.parentNode);
console.log(h1.parentElement);

//the closest one parent
h1.closest('header').style.background = 'var(--gradient-primary)';

//3.Going SideWay : sibling

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//for nodes
console.log(h1.nextSibling);
console.log(h1.previousSibling);

//for all siblings
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(2)';
});

*/

//jsmanifest

// function func1() {
//   return function () {
//     return 1;
//   };
// }
// function func2() {
//   return function () {
//     return 2;
//   };
// }

// console.log(func1()() + func2()());

// function test1() {
//   let num1 = 1;
//   let num2 = 5;
//   return function () {
//     return num1 + num2;
//   };
// }

// let num2 = 2;

// console.log(test1()());

// function test() {
//   let num = 1;

//   return function () {
//     return num;
//   };
// }

// let num = 2;
// let func = test();

// console.log(func());

// function getCount() {
//   let num = 0;
//   return function () {
//     num++;
//     return num;
//   };
// }

// const func = getCount();
// console.log(func());
// console.log(func());
// console.log(func());

// function getMinus() {
//   let num = 10;
//   return function () {
//     if (num !== 0) {
//       num--;
//       return num;
//     } else {
//       return 'Stop counting';
//     }
//   };
// }

// (function () {
//   alert('!'); // выведет '!'
// })();

document.addEventListener('DOMContentLoaded', function () {
  console.log('DONE');
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault;
//   console.log(e);
//   e.returnValue = '';
// });
