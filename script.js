let books = JSON.parse(localStorage.getItem('books')) || [];

const BOOK_IMAGE_URL = "https://m.media-amazon.com/images/I/71ZB18P3INL._SY522_.jpg";

const addBookForm = document.getElementById('addBookForm');
const booksDisplay = document.getElementById('booksDisplay');
const sortAZButton = document.getElementById('sortAZ');
const sortZAButton = document.getElementById('sortZA');
const filterCategoryDropdown = document.getElementById('filterCategory');
const noBooksMessage = document.getElementById('noBooksMessage');

function renderBooks(filterCategory = filterCategoryDropdown.value) {
    let booksToRender = books;

    if (filterCategory !== 'All'){
        booksToRender = books.filter(book => book.category === filterCategory);
    }
    
    booksDisplay.innerHTML = '';

    if (booksToRender.length === 0){
        noBooksMessage.style.display = 'block';
        booksDisplay.appendChild(noBooksMessage);
        return;
    } else {
        noBooksMessage.style.display = 'none';
    }

    booksToRender.forEach((book, index) =>{
        const card = document.createElement('div');
        card.className = 'book-card';
        card.setAttribute('data-index', book.originalIndex); 

        card.innerHTML = `
            <img src="${BOOK_IMAGE_URL}" alt="${book.title} cover">
            <h4>${book.title}</h4>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <button class="delete-btn" data-index="${book.originalIndex}">Delete</button>
        `;

        booksDisplay.appendChild(card);
    });

    document.querySelectorAll('.delete-btn').forEach(button =>{
        button.addEventListener('click', handleDelete);
    });
}

function handleAddBook(event){
    event.preventDefault();

    const newBook = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        category: document.getElementById('category').value,
        imageUrl: BOOK_IMAGE_URL
    };

    newBook.originalIndex = books.length; 
    
    books.push(newBook);
    
    localStorage.setItem('books', JSON.stringify(books));

    addBookForm.reset();

    renderBooks(); 
}

function handleDelete(event){
    const indexToDelete = parseInt(event.target.getAttribute('data-index'));
    
    books = books.filter(book => book.originalIndex !== indexToDelete);

    books.forEach((book, i) => book.originalIndex = i); 

    localStorage.setItem('books', JSON.stringify(books));

    renderBooks(); 
}

function handleSort(direction){
    books.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        
        if (direction === 'az'){
            return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
        } else {
            return (titleA > titleB) ? -1 : (titleA < titleB) ? 1 : 0;
        }
    });

    localStorage.setItem('books', JSON.stringify(books));

    renderBooks(); 
}

addBookForm.addEventListener('submit', handleAddBook);

sortAZButton.addEventListener('click', () => handleSort('az'));
sortZAButton.addEventListener('click', () => handleSort('za'));

filterCategoryDropdown.addEventListener('change', () => {
    renderBooks(filterCategoryDropdown.value);
});

if (books.length > 0) {
    books.forEach((book, i) => book.originalIndex = i);
    renderBooks();
} else {
    noBooksMessage.style.display = 'block';
}