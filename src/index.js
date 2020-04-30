const getUrl = `http://localhost:3000/quotes?_embed=likes`
const ulForQuotes = document.getElementById('quote-list')
const form = document.getElementById('new-quote-form')

document.addEventListener('DOMContentLoaded', event => {
    // import page quotes
    getQuotes()
    formSubmit()
    
    
    function getQuotes() {
        fetch(getUrl)
        .then(resp => resp.json())
        .then(obj => renderQuotes(obj))
    }
    
    function renderQuotes(array) {
        array.forEach(quotes => {
            // console.log(quote.likes) // array of hashes
            // let likes 
            renderQuote(quotes)
        })
    }
    function renderQuote(quote) {
        let li = document.createElement('li')
        li.dataset.id = quote.id
        li.innerHTML = `
        <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
        `
        ulForQuotes.appendChild(li)
    }
    
    function formSubmit() {
        
        form.addEventListener('submit', event => {
            let quote = form[0].value
            let author = form[1].value
            event.preventDefault()
            let li = document.createElement('li')
            // li.dataset.id =
            li.innerHTML = `
            <blockquote class="blockquote">
            <p class="mb-0">${quote}</p>
            <footer class="blockquote-footer">${author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>0</span></button>
            <button class='btn-danger'>Delete</button>
            </blockquote>`
            ulForQuotes.appendChild(li)
        })
    }
    
    deleteButton()
    
    function deleteButton (){

        ulForQuotes.addEventListener('click', event =>{
            if(event.target.className == "btn-danger"){
                let button = event.target
                let li = event.target.parentNode.parentNode
                let id = li.dataset.id
                li.remove()
                fetch(`http://localhost:3000/quotes/${id}`,{
                    method:"DELETE"
                }).then(resp => resp.json())
                .then( resp => console.log(resp))
            }
        })
    }
    
    likeButton()

    function likeButton (){
        ulForQuotes.addEventListener('click', event =>{
            if(event.target.className ==="btn-success"){
                let span = event.target.querySelector('span')
                let currentLikes = parseInt(event.target.querySelector('span').innerText)
                currentLikes += 1
                span.innerText = currentLikes

                let id = event.target.parentNode.parentNode.dataset.id
                fetch(`http://localhost:3000/likes`,{
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        quoteId: parseInt(id),
                    })
                }).then(resp => resp.json())
                .then(resp => console.log(resp))
            }
        })
    }
})