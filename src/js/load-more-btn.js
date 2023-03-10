export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.createLoadMoreBtn();
    this.refs = this.getRefs(selector);
    hidden && this.hide();
  }

  createLoadMoreBtn() {
    const loadMoreBtnMarkup = `<button type="button" class="load-more-btn" data-action="load-more-btn">
      <span class="label" id="label"></span>
      <span class="loader is-hidden" id="spinner"></span>
    </button>`;
    document.body.insertAdjacentHTML('beforeend', loadMoreBtnMarkup);
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = document.querySelector('#label');
    refs.spinner = document.querySelector('#spinner');
    return refs;
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  disabled() {
    this.refs.button.disabled = true;
    this.refs.label.textContent = 'Loading...';
    this.refs.spinner.classList.remove('is-hidden');
  }

  enabled() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = 'Load more';
    this.refs.spinner.classList.add('is-hidden');
  }
}
