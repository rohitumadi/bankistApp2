'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});
//page navigation(smooth scrolling) using event delegation
// normal way
document.querySelectorAll('.nav__link').forEach(el => {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

//using delegation
//1.add event listener to common parent ele
//2. determine what ele originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //matching stretegy
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  //gaurd clause
  if (!clicked) return;
  //active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation

const nav = document.querySelector('.nav');

const handleHover = function (e) {
  console.log(e.currentTarget, this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
/*
In this case handleHover.bind(0.5), 0.5
 is assigned to the 'this' keyword, and the event
  object passed by addEventListener() is assigned
   to the e parameter (the first parameter of handleHover()).

The bind() method creates a copy of a
function with predefined value of 'this'.
 Everything passed as the first argument to
 bind() will become the value of 'this' inside
  of that copied function.


What we want to achieve here is to have a single handleHover() 
function that slightly changes its behavior based on the 
value we "pass" to it.

Normally, we would pass this 0.5 or 1 as a normal argument, 
but in this case, handleHover() is a callback of addEventListener(). 
We can't pass arguments to this callback without calling it,
 which breaks our code, because this callback is meant to be 
 called by addEventListener()

// This doesn't work as expected
nav.addEventListener('mouseover', handleHover(0.5));
The bind() method solves this problem. It allows us to 
preset arguments without calling a function so that we can 
pass our callback as an argument to addEventListener().

However, there is another problem. The callback of
 addEventListener() always gets the event object as the 
 first argument. This means that we can't preset the first
  argument of handleHover() because we would lose the event
   object (e) that we use inside of handleHover(). The only 
   possibility to pass a value to handleHover() without calling 
   it, and without loosing the event object is to pass this value 
   as the first argument of the bind() method (as the value of 
    'this').

*/

//sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
//sticky navigation--Intersection observer api
// entries are array of threshold values

// A threshold of 1.0 means that when 100% of the target
// is visible within the element specified by the root option,
// the callback is invoked.
// The options object passed into the IntersectionObserver()
// constructor let you control the circumstances under which the
//  observer's callback is invoked. It has the following fields:

// root:The element that is used as the viewport for checking visibility of
// the target. Must be the ancestor of the target. Defaults to the browser
// viewport if not specified or if null.

// threshold:Either a single number or an array of
// numbers which indicate at what percentage of the target's
// visibility the observer's callback should be executed.
//  If you only want to detect when visibility passes the
//  50% mark, you can use a value of 0.5. If you want the
//  callback to run every time visibility passes another 25%,
//  you would specify the array [0, 0.25, 0.5, 0.75, 1]. The
//  default is 0 (meaning as soon as even one pixel is visible,
//    the callback will be run). A value of 1.0 means that the
//     threshold isn't considered passed until every pixel is visible.
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {});
// };
// const obsOption = {
//   root: null,
//   threshold: 0.1,
// };
// const observer = new IntersectionObserver(obsCallBack, obsOption);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//revealing elements on scroll
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
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
  section.classList.add('section--hidden');
});

//lazy loading

const imgTarget = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //remove class img-lazy which blurs the img
  // entry.target.classList.remove('lazy-img'); //can't do this
  // browser will remove the class very fast
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTarget.forEach(img => imgObserver.observe(img));

//slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const dotContainer = document.querySelector('.dots');
  const maxSlide = slides.length;
  // slider.style.transform = 'scale(0.4) translateX(-1200px)';
  // slider.style.overflow = 'visible';
  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  //0% 100% 200% 300%
  //functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `
    <button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (curSlide == maxSlide - 1) {
      curSlide = 0;
    } else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide == 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//learning 1
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);
console.log(document.querySelector('.section'));
const allSection = document.querySelectorAll('.section');
console.log(allSection);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log('🚀 ~ file: script.js ~ line 42 ~ allButtons', allButtons);
document.getElementsByClassName('btn');
console.log(
  "🚀 ~ file: script.js ~ line 44 ~ document.getElementsByClassName('btn');",
  document.getElementsByClassName('btn')
);

const div = document.createElement('div');
div.classList.add('cookie-message');
div.textContent = 'we use cookies to improve';
div.innerHTML =
  'we use cookies to improve <button class="btn btn--close-cookie">Got it</button>';
const header = document.querySelector('.header');
// header.prepend(div);
// header.append(div);//can only exists once
// to use multiple we clone the element
// header.append(div.cloneNode(true));
// header.before(div);
header.after(div);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    div.remove();
  });
div.style.backgroundColor = '#37383d';
div.style.width = '120%';

console.log(div.style.width); //will work for inline style

console.log(getComputedStyle(div).color);
console.log(getComputedStyle(div).height);
div.style.height =
  Number.parseFloat(getComputedStyle(div).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

//attributes
const logo = document.querySelector('.nav__logo');
console.log('🚀 ~ file: script.js ~ line 80 ~ logo', logo.alt);
console.log('🚀 ~ file: script.js ~ line 80 ~ logo', logo.src);

logo.alt = 'beautiful logo';
//nonstandard--if added explicitly
console.log(
  '🚀 ~ file: script.js ~ line 80 ~ logo',
  logo.getAttribute('designer')
);

logo.setAttribute('company', 'bankist');
logo.getAttribute('src'); //relative to folder
log.src; //absolute

logo.className = 'jonas'; //will overwrite all classes
// use methods like add n remove instead
*/
//learning 2
/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(e.target.getBoundingClientRect());
  console.log('current scroll x,y', window.pageXOffset, window.pageYOffset);
  console.log(
    'height width viewport',
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );
  //scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // old way
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//new way
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('reading h1 ');
};
h1.addEventListener('mouseenter', alertH1);
//old way
// h1.onmouseenter=function(e){
//   alert('reading h1 ');

// }
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  //stop event propagation
  // e.stopPropagation();//not a good idea to stop it
});

//add event listener is listening to events while
//bubling phase i.e while traversing up the DOM tree
//we can catch then in the capturing events
//by adding 3 parameter as true
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
*/

//DOM traversal
/*
const h1 = document.querySelector('h1');
//going downwards:child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'white';

//going upwards:parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//sideways:siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el != h1) el.style.transform = 'scale(0.5)';
});
*/
