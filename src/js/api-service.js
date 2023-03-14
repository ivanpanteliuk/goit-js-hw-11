import axios from 'axios';
import { loadMoreBtn } from '..';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34181989-96de03d33496f95df1ee3a725';
let resultsPerPage = 40;

export class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.hitsLength = 0;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      q: this.searchQuery,
      key: API_KEY,
      per_page: resultsPerPage,
      page: this.currentPage,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    const URL = `${BASE_URL}?${searchParams}`;

    const response = await axios.get(URL);

    if (response.data.hits.length === 0) {
      loadMoreBtn.hide();
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    this.incrementPage();
    this.incrementHits(response.data.hits);

    return response.data;
  }

  incrementPage() {
    this.currentPage += 1;
  }

  resetPageAndHits() {
    this.currentPage = 1;
    this.hitsLength = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementHits(arr) {
    this.hitsLength += arr.length;
  }

  get hits() {
    return this.hitsLength;
  }
}
