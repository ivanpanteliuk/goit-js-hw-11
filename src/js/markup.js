export const markup = {
  createGalleryMarkup(imagesArr) {
    return (galleryMarkup = imagesArr
      .map(
        image =>
          `<a href=${image.largeImageURL} class="gallery__item">
        <div class="photo-card">
  <img src=${image.webformatURL} alt="${image.tags}" width="573" height="460" loading="lazy" />
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
      .join(''));
  },
  createScrollBtn() {
    const scrollUpBtnMarkup = `<div class="btn-container">
  <button type="button" class="scroll-up-btn is-hidden">
  <svg width="90" height="90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <g stroke="#94a9f4" stroke-width="2">
    <path d="M3 12c0-7.412 1.588-9 9-9s9 1.588 9 9-1.588 9-9 9-9-1.588-9-9Z"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="m15 13-2.799-2.799v0a.285.285 0 0 0-.402 0v0L9 13"/>
  </g>
</svg>
</button>  
  <button type="button" class="scroll-btn is-hidden">
  <svg width="90" height="90" xmlns="http://www.w3.org/2000/svg" fill="none" transform="rotate(180)" viewBox="0 0 24 24">
  <g stroke="#94a9f4" stroke-width="2">
    <path d="M3 12c0-7.412 1.588-9 9-9s9 1.588 9 9-1.588 9-9 9-9-1.588-9-9Z"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="m15 13-2.799-2.799v0a.285.285 0 0 0-.402 0v0L9 13"/>
  </g>
</svg>
</button>
  </div>`;
    document.body.insertAdjacentHTML('beforeend', scrollUpBtnMarkup);
  },
  ClearMarkup(ref) {
    ref.innerHTML = '';
  },
  renderMarkup(ref, markup) {
    ref.insertAdjacentHTML('beforeend', markup);
  },
};
