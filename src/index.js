quotesURL = "http://localhost:3000/quotes" 
likesURL = "http://localhost:3000/likes"

document.addEventListener('DOMContentLoaded', (event) => {

const quoteList = document.querySelector("#quote-list")

const likesObj = {}

fetch(likesURL)
.then(response => response.json())
.then(likes => {
    likes.forEach(like => {
        const quoteLike = like.quoteId
        if (likesObj[`${quoteLike}`]) {
            likesObj[`${quoteLike}`] += 1
        }
        else {likesObj[`${quoteLike}`]= 1}
    }) // end forEach   
    console.log(likesObj)
}) // end of fetch 


fetch(quotesURL)
.then(response => response.json())
.then(quotes => {
    quotes.forEach(quote => {
        addQuote(quote)
        
    }) // end forEach   
}) // end of fetch 




document.addEventListener("click", function(e){

    if (e.target.className === "btn-danger") { 
        let quote = e.target.parentNode.parentNode
        let quoteID = quote.dataset.id
            fetch(`${quotesURL}/${quoteID}`, {
            method: 'delete'
            })
            quote.remove()
    } // end of if "click is a delete button"

    else if (e.target.className === "btn-success"){
       let quote = e.target.parentNode.parentNode
       let quoteID = quote.dataset.id
       console.log(quoteID)
    //    let likes = quote.querySelector("span").textContent
    //    let newLikes = likes +=1
        let newLike = {}
        newLike.quoteId = quoteID
        newLike.createdAt = Math.round(Date.now()/1000)
        console.log(newLike)

          // change in db
          fetch(likesURL, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLike)
          }) 
          // end of patch
        
    } // end of like btn else if 

    else if (e.target.type === "submit"){
        e.preventDefault();
        let form = document.querySelector("#new-quote-form")
        let newQuote = {}
        newQuote.quote = form.querySelector("#new-quote").value
        newQuote.author = form.querySelector("#author").value

            // add to db
            fetch(quotesURL, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(newQuote)
              }) 
              .then(quote => addQuote(newQuote))
              // end of POST

        form.reset()

    } // end of else if 


}) // end of click listener

function addQuote(quoteObj) {
    let li = document.createElement('li')
    li.className = "quote-card"
    li.dataset.id = quoteObj.id
    li.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quoteObj.quote}</p>
    <footer class="blockquote-footer">${quoteObj.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>0</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    quoteList.append(li)
}


}) // end of Content Loaded