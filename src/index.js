// 1. define the endpoint to which we will be fetching
// 2. define the function to fetch the quotes
// 3. invoke the fetchQuotes function
// 4. console log the data at first
// 5. select the quote list ul from the dom
// 6. for each quote, create the following structure.
{/* <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer class="blockquote-footer">Someone famous</footer>
        <br>
        <button class='btn-success'>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li> */}



const quotesURL = "http://localhost:3000/quotes?_embed=likes"
const quotesEndpoint = "http://localhost:3000/quotes"
const likesEndpoint = `http://localhost:3000/likes`

const quotesList = qs("#quote-list")

function ce(element){
    return document.createElement(element)
}

function qs(selector){
    return document.querySelector(selector)
}

const newQuoteForm = qs("#new-quote-form")

function renderQuote(quote){
    quotesList.innerHTML += `
        <li class='quote-card'>
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button data-id="${quote.id}" class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button data-id="${quote.id}" class='btn-danger'>Delete</button>
        </blockquote>
        </li>
        `
}


function renderQuotes(quotes){
    quotesList.innerHTML = ''
    quotes.forEach(quote => renderQuote(quote))
}


function fetchQuotes(){
    fetch(quotesURL)
    .then(resp => resp.json())
    .then(data => {
        renderQuotes(data)
    })
    .catch(err => console.log(err))
}

function handleNewQuote(e){
    e.preventDefault()
    console.log(e.target)
    const formData = {
        quote: e.target["quote"].value,
        author: e.target["author"].value
    }
    e.target.reset()
    const reqObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
    }
    fetch(quotesEndpoint, reqObj)
        .then(resp => resp.json())
        .then(newQuote => renderQuote(newQuote))
        .catch(console.log)
}

function handleDeleteQuote(id){

    fetch(quotesEndpoint + `/${id}`, {method: "DELETE"})
        .then(resp => resp.json())
        .then(data => {
            alert("successfully deleted!")
        })
        .catch(console.log)
}

function handleUpdateLikes(quoteId){
    console.log(quoteId)
    const formData = {
        quoteId: parseInt(quoteId)
    }
    const reqObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
    }
    fetch(likesEndpoint, reqObj)
        .then(resp => resp.json())
        .then(console.log)
}

function handleListClick(e){
    if (e.target.className === "btn-danger"){
        let id = e.target.dataset.id
        e.target.parentElement.parentElement.remove()
        handleDeleteQuote(id)
    } else if (e.target.className === 'btn-success'){
        let id = e.target.dataset.id
        let likes = parseInt(e.target.textContent.split(": ")[1])
        likes += 1
        e.target.textContent = `Likes: ${likes}`
        handleUpdateLikes(id)
    }
}



fetchQuotes()

newQuoteForm.addEventListener("submit", handleNewQuote)

quotesList.addEventListener("click", handleListClick)