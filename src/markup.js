const galleryElement = document.querySelector('.gallery');

export function showFoundImages(result) {
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
