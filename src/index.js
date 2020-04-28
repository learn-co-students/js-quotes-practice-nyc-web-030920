
const baseURL = "http://localhost:3000"

let quoteList = null;

const headers = {
    "content-type": "application/json",
    "accept": "application/json"
};

document.addEventListener("DOMContentLoaded", event => {
    quoteList = document.getElementById("quote-list");

    const quoteForm = document.getElementById("new-quote-form");

    quoteList.addEventListener("click", event => {
        if(event.target.className === "btn-success"){
            addLike(event.target.parentNode.parentNode);
        }
        else if(event.target.className === "btn-danger"){
            deleteQuote(event.target.parentNode.parentNode);
        }
        else if(event.target.className === "btn-warning"){
            displayQuoteEdit(event.target.parentNode.parentNode);
        }
    });

    quoteForm.addEventListener("submit", createNewQuote);

    document.getElementById("sort-button").addEventListener("click", toggleSort);

    getQuotes();
});

//
//
function getQuotes(sortByAuthor = false){

    let url = `${baseURL}/quotes?_embed=likes`;
    if(sortByAuthor){
        url += "&_sort=author";
        console.log(url);
    }

    fetch(url)
    .then(res => res.json())
    .then(data => {
        displayAllQuotes(data);
    })
    .catch(err => console.log("error", err));
}

//
//
function displayAllQuotes(quotes){
    quoteList.innerHTML = "";
    quotes.forEach(quote => displayIndividualQuote(quote));
}

//
//
function displayIndividualQuote(quote){
    const li = createIndividualQuote(quote);
    quoteList.append(li);
}

function createIndividualQuote(quote){
    const li = document.createElement("li");
    const likeCount = quote.likes ? quote.likes.length : 0;

    li.className = "quote-card";
    li.dataset.id = quote.id;
    li.dataset.likes = likeCount;
    li.dataset.author = quote.author;

    li.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${likeCount}</span></button>
        <button class='btn-warning'>Edit</button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    `;
    return li;
}

//
//
function toggleSort(event){
    const button = event.target;
    if(button.dataset.sort === "id"){
        getQuotes();
        button.dataset.sort = "author";
        button.innerText = "Sort by Author";
    }
    else if(button.dataset.sort === "author"){
        getQuotes(true);
        button.dataset.sort = "id";
        button.innerText = "Sort by ID";
    }
}

//
//
function createNewQuote(event){
    event.preventDefault();
    const form = event.target;

    const quote = {
        quote: form.quote.value,
        author: form.author.value
    };

    form.reset();

    fetch(`${baseURL}/quotes`, {
        method: "POST",
        headers,
        body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(data => {
        displayIndividualQuote(data);
    })
    .catch(err => console.log("error", err));
}

//
//
function addLike(quoteCard){
    console.log("like quote");

    const id = parseInt(quoteCard.dataset.id);
    const likeCount = parseInt(quoteCard.dataset.likes) + 1;

    fetch(`${baseURL}/likes`, {
        method: "POST",
        headers,
        body: JSON.stringify({ quoteId: id, createdAt: Date.now() })
    })
    .then(res => res.json())
    .then(data => {
        quoteCard.dataset.likes = likeCount;
        const likeSpan = quoteCard.querySelector(".btn-success span");
        likeSpan.innerText = likeCount;
    })
    .catch(err => console.log("error", err));
}

//
//
function deleteQuote(quoteCard){
    console.log("delete",quoteCard);
    const id = quoteCard.dataset.id;

    fetch(`${baseURL}/quotes/${id}`, {
        method: "DELETE",
        headers
    })
    .then(res => {
        quoteCard.remove();
    })
    .catch(err => console.log("error", err));
}

function displayQuoteEdit(quoteCard){
    const quoteId = quoteCard.dataset.id;
    const quoteAuthor = quoteCard.dataset.author;
    const quoteTextP = quoteCard.querySelector("p");
    const quote = quoteTextP.innerText;

    const form = document.createElement("form");

    form.innerHTML = `
        <label for="edit_quote">Quote</label>
        <input type="text" id="edit_quote" name="quote"value="${quote}" />
        <br />
        <label for="edit_author">Author</label>
        <input type="text" id="edit_author" name="author" value="${quoteAuthor}" />
        <br />
        <input type="submit" class="btn-warning" value="Edit" />
    `;

    editFunction = (event) => {
        event.preventDefault();
        console.log("edit function");

        fetch(`${baseURL}/quotes/${quoteId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({author: form.author.value, quote: form.quote.value})
        })
        .then(res => res.json())
        .then(data => {
            console.log("edited")
            const li = createIndividualQuote(data);
            quoteCard.after(li);
            quoteCard.remove();
        })
        .catch(err => console.log("error", err));

        form.removeEventListener("submit", editFunction);
        form.remove();
    };

    form.addEventListener("submit", editFunction);

    quoteCard.append(form);
}