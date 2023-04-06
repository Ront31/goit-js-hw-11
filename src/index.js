import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { updateGallery } from './markup.js';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const galleryElement = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let lastQuery = '';
let page = 1;

async function fetchImage(query, options, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '34890588-9da305e6d5e870774c8e66624',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
        ...options,
      },
    });

    totalPages = Math.ceil(response.data.totalHits / 40);

    if (query === '') {
      Notify.failure(
        `Too many matches found. Please enter a more specific name.`,
        {
          position: 'right-top',
        }
      );
    } else if (response.data.totalHits === 0) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`,
        {
          position: 'right-top',
        }
      );
    } else if (page === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`, {
        position: 'right-top',
      });
    }
    return response.data.hits;
  } catch (error) {
    console.log(error);
  }
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  debouncedSearch();
});

loadMoreButton.addEventListener('click', async function () {
  page = +1;
  const imageData = await fetchImage(lastQuery, {}, page);
  updateGallery(imageData);
});

const debouncedSearch = debounce(async function () {
  const query = searchInput.value.trim();

  if (query === lastQuery) {
    Notify.info('Enter data to search!');
  } else {
    galleryElement.innerHTML = '';
  }

  const imageData = await fetchImage(query, {}, page);
  updateGallery(imageData);
}, 300);
