import { Notify } from 'notiflix';
import { ImagesApiService } from './js/api-service';
import SimpleLightbox from 'simplelightbox';
import LoadMoreBtn from './js/load-more-btn';
import { markup } from './js/markup';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

markup.createScrollBtn();

export const refs = {
  searchImgFormEl: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  scrollBtn: document.querySelector('.scroll-btn'),
  scrollUpBtn: document.querySelector('.scroll-up-btn'),
};

const imagesApiService = new ImagesApiService();

const notifyOptions = {
  width: '450px',
  position: 'right-top',
  distance: '20px',
  timeout: 2000,
  clickToClose: true,
  fontSize: '20px',
  cssAnimationStyle: 'zoom',
};

export const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more-btn"]',
  hidden: true,
});

const lightboxOptions = {
  captionDelay: 250,
  captionsData: 'alt',
};

const lightbox = new SimpleLightbox('.gallery__item', lightboxOptions);

Notify.init(notifyOptions);

refs.searchImgFormEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);
refs.scrollBtn.addEventListener('click', onScrollBtnClick);
window.addEventListener('scroll', throttle(onScroll, 700));
refs.scrollUpBtn.addEventListener('click', onBtnUpClick);

async function onFormSubmit(evt) {
  evt.preventDefault();
  markup.ClearMarkup(refs.gallery);
  showOrHideScrollBtn();
  loadMoreBtn.hide();
  imagesApiService.resetPageAndHits();

  imagesApiService.query = evt.target.elements.searchQuery.value.trim();
  if (imagesApiService.searchQuery === '')
    return Notify.failure('Type search query, please');

  try {
    const { hits, total } = await imagesApiService.fetchImages();
    Notify.info(`Hooray! We found ${total} images.`);
    loadMoreBtn.disabled();
    markup.renderMarkup(refs.gallery, markup.createGalleryMarkup(hits));
    lightbox.refresh();
    loadMoreBtn.enabled();
    showOrHideScrollBtn();
    checkIfEndOfSearchResult(imagesApiService.hits, total);
  } catch (err) {
    errorHandle(err);
  }
}

async function onLoadMoreBtnClick() {
  loadMoreBtn.disabled();
  try {
    const { hits, total } = await imagesApiService.fetchImages();
    Notify.info(`There are ${total - imagesApiService.hits} images left.`);
    markup.renderMarkup(refs.gallery, markup.createGalleryMarkup(hits));
    lightbox.refresh();
    checkIfEndOfSearchResult(imagesApiService.hits, total);
    loadMoreBtn.enabled();
  } catch (err) {
    errorHandle(err);
  }
}

function checkIfEndOfSearchResult(hitsLength, totalHits) {
  if (hitsLength >= totalHits) {
    loadMoreBtn.hide();
    throw new Error(
      `We're sorry, but you've reached the end of search results`
    );
  }
}

function errorHandle(err) {
  Notify.failure(`${err}`);
}

function onScrollBtnClick() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  const scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  const totalScrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  if (scrollPosition > totalScrollHeight - cardHeight * 3) {
    onLoadMoreBtnClick();
  }
}

function onScroll() {
  const scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  if (scrollPosition > window.innerHeight / 2) {
    refs.scrollUpBtn.classList.remove('is-hidden');
  } else {
    refs.scrollUpBtn.classList.add('is-hidden');
  }
}

function onBtnUpClick() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function showOrHideScrollBtn() {
  const scrollHeight = document.documentElement.scrollHeight;

  if (scrollHeight > window.innerHeight) {
    refs.scrollBtn.classList.remove('is-hidden');
  } else {
    refs.scrollBtn.classList.add('is-hidden');
  }
}
