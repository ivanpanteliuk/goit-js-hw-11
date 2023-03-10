import { Notify } from 'notiflix';
import { ImagesApiService } from './js/api-service';
import SimpleLightbox from 'simplelightbox';
import LoadMoreBtn from './js/load-more-btn';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchImgFormEl: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
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

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more-btn"]',
  hidden: true,
});

Notify.init(notifyOptions);

refs.searchImgFormEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  imagesApiService.query = evt.target.elements.searchQuery.value.trim();
  if (imagesApiService.searchQuery === '')
    return Notify.failure('Type search query, please');

  loadMoreBtn.hide();
  imagesApiService.resetPageAndHits();

  imagesApiService
    .fetchImages()
    .then(({ hits, total }) => {
      Notify.info(`Hooray! We found ${total} images.`);
      loadMoreBtn.show();
      loadMoreBtn.disabled();
      refs.gallery.innerHTML = createGalleryMarkup(hits);
      new SimpleLightbox('.gallery__item');
      loadMoreBtn.enabled();
      checkIfEndOfSearchResult(imagesApiService.hits, total);
    })
    .catch(err => Notify.failure(`${err}`));
}

function onLoadMoreBtnClick() {
  loadMoreBtn.disabled();

  imagesApiService
    .fetchImages()
    .then(({ hits, total }) => {
      Notify.info(`There are ${total - imagesApiService.hits} images left.`);
      refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
      new SimpleLightbox('.gallery__item');
      checkIfEndOfSearchResult(imagesApiService.hits, total);
      loadMoreBtn.enabled();
    })
    .catch(err => Notify.failure(`${err}`));
}

function createGalleryMarkup(imagesArr) {
  return imagesArr
    .map(
      image =>
        `<a href=${image.largeImageURL} class="gallery__item">
        <div class="photo-card">
  <img src=${image.webformatURL} alt=${image.tags} width="573" height="460" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${image.downloads}
    </p>
  </div>
</div>
</a>`
    )
    .join('');
}

function checkIfEndOfSearchResult(hitsLength, totalHits) {
  if (hitsLength >= totalHits) {
    loadMoreBtn.hide();
    throw new Error(
      `We're sorry, but you've reached the end of search results`
    );
  }
}
