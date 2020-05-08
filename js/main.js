'use strict';

const cartButton = document.querySelector('#cart-button'),
modal = document.querySelector('.modal'),
close = document.querySelector('.close'),
buttonAuth = document.querySelector('.button-auth'),
modalAuth = document.querySelector('.modal-auth'),
closeAuth = document.querySelector('.close-auth'),
logInForm = document.querySelector('#logInForm'),
loginInput = document.querySelector('#login'),
userName = document.querySelector('.user-name'),
buttonOut = document.querySelector('.button-out'),
cardsRestaurants = document.querySelector('.cards-restaurants'),
containerPromo = document.querySelector('.container-promo'),
restaurants = document.querySelector('.restaurants'),
menu = document.querySelector('.menu'),
logo = document.querySelector('.logo'),
cardsMenu = document.querySelector('.cards-menu'),
restaurantTitle = document.querySelector('.restaurant-title'),
cardInfo = document.querySelector('.card-info');

let login = localStorage.getItem('login');

const getData = async function(url) {
  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url},
       статус ошибки ${response.status}`);
  };

  return await response.json();
};

function toggleModal() {
  modal.classList.toggle("is-open");
}
function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  function logOut() {
    login = null;
    localStorage.removeItem('login');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    cardsRestaurants.removeEventListener('click', openGoods);
    
    checkAuth();
  }

  cardsRestaurants.addEventListener('click', openGoods);
  buttonOut.addEventListener('click', logOut);
}
function notAuthorized(){
  function logIn(event){
    event.preventDefault();

    login = loginInput.value;
    localStorage.setItem('login', login);
    if (login){
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      cardsRestaurants.removeEventListener('click', toggleModalAuth);

      toggleModalAuth();
      logInForm.reset();
      checkAuth();

    } else {
      alert('Введите логин');
    }
    
  }

  cardsRestaurants.addEventListener('click', toggleModalAuth);
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth(){
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant({ image, kitchen, name,
  price, stars, products,
  time_of_delivery: timeOfDelivery }) {

  const card = `
    <a class="card card-restaurant" data-products="${products}"
    data-restaurant="${name},${stars},${price},${kitchen}">
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createRestaurantSectionHeading([ name, stars, price, kitchen ]){
  restaurantTitle.textContent = `${name}`;
  const cardInfoFill = `
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
  `
  cardInfo.insertAdjacentHTML('beforeend', cardInfoFill);
}

function createCardGood({ description, id, image, name, price }) {

  const card  = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('afterbegin', `
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend',card)
}

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if(restaurant) {
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    cardInfo.textContent = '';
    createRestaurantSectionHeading(restaurant.dataset.restaurant.split(','));
    getData(`./db/${restaurant.dataset.products}`).then(function(data) {
      data.forEach(createCardGood);
    });
  }
}

function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant);
  });
  
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
  
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  
  checkAuth();
};

init();

