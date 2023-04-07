const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const galleryElement = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

import './sass/form.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { page, perPage, API_KEY, fetchImages, axios } from './API.js';

loadMoreButton.classList.add('is-hidden');

searchForm.addEventListener('submit', handleSearchImage);
loadMoreButton.addEventListener('click', handleLoadMore);

async function handleSearchImage(event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    clearPage();
    Notiflix.Notify.failure(`Please, enter your request in the field.`);
    return;
  }

  try {
    const result = await fetchImages(query);

    if (result.hits.length === 0) {
      clearPage();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      clearPage();
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      }
      showFoundImages(result);
      loadMoreButton.classList.remove('is-hidden');

      const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      });
      lightbox.refresh();

      scrollPage();

      if (result.totalHits <= page * perPage) {
        loadMoreButton.classList.add('is-hidden');
        Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Keep calm and try again.');
    console.log(error);
  }
}

async function handleLoadMore() {
  const query = searchInput.value.trim();
  const result = await fetchImages(query);

  if (result.hits.length > 0) {
    showFoundImages(result);

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    lightbox.refresh();

    scrollPage();

    if (result.totalHits <= page * perPage) {
      loadMoreButton.classList.add('is-hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  }
}

function clearPage() {
  galleryElement.innerHTML = '';
  loadMoreButton.classList.add('is-hidden');
}

function showFoundImages(result) {
  const imageInfo = result.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
    <figure class="gallery__figure">
      <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy">
      <figcaption class="gallery__figcaption">
        <div class="gallery__caption">Likes: ${likes}</div>
        <div class="gallery__caption">Views: ${views}</div>
        <div class="gallery__caption">Comments: ${comments}</div>
        <div class="gallery__caption">Downloads: ${downloads}</div>
  </figcaption>
    </figure>
  </a>`;
      }
    )
    .join('');

  galleryElement.insertAdjacentHTML('beforeend', imageInfo);

  return imageInfo;
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
