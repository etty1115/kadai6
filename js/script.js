// script.js
const form = document.getElementById('search-form');
const previousResults = [];
const favoriteBooks = [];

form.addEventListener('submit', e => {
  e.preventDefault();

  const experienceOptions = document.querySelectorAll('input[name="experience"]:checked');
  const selectedExperiences = Array.from(experienceOptions).map(option => option.value);

  selectedExperiences.forEach(experience => {
    const keyword = getKeywordByExperience(experience);
    searchBooks(keyword, experience);
  });
});

function getKeywordByExperience(experience) {
  let keyword = '';

  switch (experience) {
    case '営業経験':
      keyword = '営業向け書籍';
      break;
    case '人事労務経験':
      keyword = '初心者向けの人事労務関連図書';
      break;
    case 'カスタマーサクセス経験':
      keyword = 'カスタマーサクセス関連書籍';
      break;
    case 'SaaS経験':
      keyword = 'SaaSのビジネスモデルが理解できる書籍';
      break;
    default:
      break;
  }

  return keyword;
}

async function searchBooks(keyword, experience) {
  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('search-results');

  const heading = document.createElement('h2');
  heading.textContent = `${experience} のおすすめ書籍`;
  resultsDiv.appendChild(heading);

  const paragraph = document.createElement('p');
  paragraph.textContent = `検索結果が表示される部分です。${experience} に関連する ${keyword} が表示されます。`;
  resultsDiv.appendChild(paragraph);

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=5`);
    const data = await response.json();

    const bookList = document.createElement('ul');
    const existingTitles = [];

    if (data && data.items) {
      data.items.forEach(item => {
        const volumeInfo = item.volumeInfo;
        const title = volumeInfo.title;
        const authors = volumeInfo.authors;
        const imageLinks = volumeInfo.imageLinks;
        const thumbnail = imageLinks ? imageLinks.thumbnail : 'noimage.png';

        if (!existingTitles.includes(title)) {
          const bookItem = createBookItem(title, authors, thumbnail);
          bookList.appendChild(bookItem);
          existingTitles.push(title);
        }
      });
    }

    resultsDiv.appendChild(bookList);

    // 直前の検索結果を非表示にする
    const previousResult = previousResults.find(result => result.experience === experience);
    if (previousResult) {
      previousResult.element.style.display = 'none';
    }

    // 現在の検索結果を保存
    previousResults.push({ experience, element: resultsDiv });

    // 新しいウェブサイトタブで検索結果を表示
    const newWindow = window.open('', '_blank');
    newWindow.document.write(resultsDiv.outerHTML);
    newWindow.document.close();
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = '<p>検索結果を取得できませんでした。</p>';
  }

  document.body.appendChild(resultsDiv);
}

function createBookItem(title, authors, thumbnail) {
  const bookItem = document.createElement('li');

  const imageElement = document.createElement('img');
  imageElement.src = thumbnail;
  imageElement.alt = title;
  bookItem.appendChild(imageElement);

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  bookItem.appendChild(titleElement);

  const authorElement = document.createElement('p');
  authorElement.textContent = `著者: ${authors.join(', ')}`;
  bookItem.appendChild(authorElement);

  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = 'お気に入り';
  favoriteButton.classList.add('favorite-button');
  favoriteButton.addEventListener('click', () => {
    toggleFavorite(favoriteButton, title);
  });
  bookItem.appendChild(favoriteButton);

  return bookItem;
}

function toggleFavorite(button, title) {
  const index = favoriteBooks.findIndex(book => book.title === title);

  if (index > -1) {
    // お気に入りが既に存在する場合は削除
    favoriteBooks.splice(index, 1);
    button.textContent = 'お気に入り';
    button.classList.remove('favorited');
  } else {
    // お気に入りが存在しない場合は追加
    favoriteBooks.push({ title });
    button.textContent = 'お気に入り解除';
    button.classList.add('favorited');
  }

  // お気に入り書籍の表示を更新
  renderFavoriteBooks();
}

function renderFavoriteBooks() {
  const favoriteBooksDiv = document.getElementById('favorite-books');
  favoriteBooksDiv.innerHTML = '';

  if (favoriteBooks.length === 0) {
    favoriteBooksDiv.textContent = 'お気に入りがありません。';
    return;
  }

  const heading = document.createElement('h2');
  heading.textContent = 'お気に入り書籍';
  favoriteBooksDiv.appendChild(heading);

  const bookList = document.createElement('ul');

  favoriteBooks.forEach(book => {
    const bookItem = document.createElement('li');
    bookItem.textContent = book.title;
    bookList.appendChild(bookItem);
  });

  favoriteBooksDiv.appendChild(bookList);
}

