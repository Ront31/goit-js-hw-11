import axios from 'axios';

let page = 0;

const perPage = 40;

axios.defaults.baseURL = 'https://pixabay.com/api/';

let lastQuery = '';

async function fetchImages(query) {
  if (query === lastQuery) {
    page += 1;
  } else {
    page = 1;
    lastQuery = query;
  }
  const params = {
    q: `${query}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${page}`,
    per_page: `${perPage}`,
  };

  const urlAXIOS = '?key=34890588-9da305e6d5e870774c8e66624';

  const { data } = await axios.get(urlAXIOS, { params });

  return data;
}

export { page, perPage, fetchImages, axios };
