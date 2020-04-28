let quoteList = document.querySelector('#quote-list');
let quoteForm = document.querySelector('#new-quote-form');
const baseUrl = 'http://localhost:3000/quotes?_embed=likes';

document.addEventListener('DOMContentLoaded', function () {
    fetchQuotes();
    listenToForm();
})

function fetchQuotes() {
    fetch(baseUrl)
        .then(res => res.json())
        .then(function (quotes) {
            quotes.forEach(function (quote) {
                quoteList.append(showQuote(quote));
            })
        })
}

function showQuote(quote) {
    let li = document.createElement('li');
    li.setAttribute('class', 'quote-card');

    let likeBtn = document.createElement('button');
    likeBtn.setAttribute('class', 'btn-success')
    likeBtn.innerHTML = `Likes: <span>${quote['likes'].length}</span>`
    let deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class', 'btn-danger');
    deleteBtn.textContent = 'Delete';
    let blockQuote = document.createElement('blockquote')
    blockQuote.dataset.quoteId = quote.id;
    blockQuote.setAttribute('class', 'blockquote')
    blockQuote.innerHTML = `
    <p class="mb-0">${quote['quote']}</p>
    <footer class="blockquote-footer">${quote['author']}</footer>
    <br>
    `
    blockQuote.append(likeBtn);
    blockQuote.append(deleteBtn);
    li.append(blockQuote);
    //quoteList.append(li);

    likeBtn.addEventListener('click', function (event) {
        plusLikeNum(event);
    })

    deleteBtn.addEventListener('click', function (event) {
        deleteThisQuote(event);
    })
    return li;
}

//add like 
function plusLikeNum(event) {
    let eventTarget = event.target;
    
    let quoteDiv = eventTarget.parentElement;
    let id = parseInt(quoteDiv.dataset.quoteId);
    let likeBtn = quoteDiv.querySelector('span');
    let likeNum = parseInt(likeBtn.textContent);
    likeNum++;
    let newObj = {
        'quoteId': id,
        'createdAt': Date.now()
    }

    let url = `http://localhost:3000/likes`
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json'
        },
        body: JSON.stringify(newObj)
    })
    likeBtn.textContent = likeNum;
}
//delete this quote
function deleteThisQuote(event) {
    let eventTarget = event.target;
    let id = eventTarget.parentElement.dataset.quoteId;
    let url = `http://localhost:3000/quotes/${id}`
    fetch(url, {
        method: 'DELETE'
    })
        .then(res => res.json())
    eventTarget.parentElement.parentElement.remove();
}

function listenToForm() {
    quoteForm.addEventListener('submit', function (event) {
        let form = event.target;
        let newQuote = {
            'quote': form.quote.value,
            'author': form.author.value,
        }
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
        form.reset();
    })
}