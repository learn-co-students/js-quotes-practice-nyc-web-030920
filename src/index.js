//√ fetch quotes
//√ append quotes to the dom 
//√ event listener on form submit
//√ creates a new quote, appends to DOM and adds to database
    //form is provided
//√ event listener on delete button
    //√ deletes quote off the dom and from the database
//√event listener on like button
    //√updates likes on the dom and in the database
    


const quotesContainer = document.querySelector('#quote-list')
       
document.addEventListener('DOMContentLoaded', () => {
    fetchQuotes()
    createNewQuote()
    buttonFunctionality()
})
    
const fetchQuotes = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => individualQuote(quotes))
};

const individualQuote = (quotesArray) => {
    quotesArray.forEach(data => renderQuote(data))
};

const renderQuote = (data) => {
    quotesContainer.innerHTML += `
    <li class='quote-card'>
        <blockquote class="blockquote">
            <p class="quote">${data.quote}</p>
            <footer class="blockquote-footer">${data.author}</footer>
            <br>
            <button data-id=${data.id} class='btn-success'>Likes: <span>0</span></button>
            <button data-id=${data.id} class='btn-danger'>Delete</button>
        </blockquote>
    </li>
    `
};

const createNewQuote = () => {
    const newQuoteForm = document.querySelector('#new-quote-form')
    newQuoteForm.addEventListener('submit', (event) => {
        event.preventDefault()
        let quoteData = event.target
        saveNewQuote(quoteData)
    })
};

const saveNewQuote = (quoteData) => {
    let newQuote = quoteData.quote.value
    let newAuthor = quoteData.author.value
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    })
    .then(response => response.json())
    .then(newQuote => renderQuote(newQuote))
};

const buttonFunctionality = () => {
    quotesContainer.addEventListener('click', event => {
        if (event.target.className === 'btn-danger') {
            const quoteId = event.target.dataset.id
            const quoteLi = event.target.parentElement.parentElement
            quoteLi.remove()
            deleteQuote(quoteId)
        } 
        if (event.target.className === 'btn-success') {
            const likesId = parseInt(event.target.dataset.id)
            let likesNum = event.target.querySelector('span').textContent
            let likeSpan = event.target.querySelector('span')
            likesNum++
            likeSpan.textContent = likesNum
            updateLikes(likesId)
        }
    })
};


const deleteQuote = (quoteId) => {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
    })
};

const updateLikes = (likesId) => {
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: likesId,
        })
    })
};