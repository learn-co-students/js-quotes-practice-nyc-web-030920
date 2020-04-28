window.addEventListener("DOMContentLoaded", function(e){
    console.log("the DOM has loaded")
    const quoteList = document.getElementById("quote-list")

    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(json => json.forEach(loadQuotes))

    function loadQuotes(quoteObj){
            const card = document.createElement("li")
            card.className = "quote-card"
            card.dataset.id = `${quoteObj.id}`
            card.innerHTML = `<blockquote class="blockquote">
            <p class="mb-0">${quoteObj.quote}.</p>
            <footer class="blockquote-footer">${quoteObj.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>`
        quoteList.append(card)
        }

    const newQuoteForm = document.getElementById("new-quote-form")
    newQuoteForm.addEventListener("submit", function (e){
        const quote = e.target.children[0].children[1].value
        const author = e.target.children[1].children[1].value
        const newQuote = {quote, author}

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify(newQuote)
            })
            .then(response => response.json())
            .then(json => console.log(json))
    })

    quoteList.addEventListener("click", function (e){
        if (e.target.textContent === "Delete"){
            const quote = e.target.parentNode.parentNode
            const quoteID = quote.dataset.id
            quote.remove()
            fetch(`http://localhost:3000/quotes/${quoteID}`, {
                method: 'DELETE'
                    })
        } else if (e.target.className === "btn-success"){
            console.log("clicked a like button")
            let span = e.target.children[0]
            let likes = parseInt(span.textContent)
            let quoteID = e.target.parentNode.parentNode.dataset.id
            likes = likes + 1
            span.textContent = likes
            
            fetch(`http://localhost:3000/likes`, {
            
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({quoteID: quoteID, likes: likes})
                })
                .then(response => response.json())
            // ? use next line to do something meaningful with the data
                .then(json => console.log(json))
        }
    })

//DOM listener END
})