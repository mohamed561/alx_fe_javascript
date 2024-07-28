// Initial quotes array
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h2>Add a New Quote</h2>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
    `;
    document.body.appendChild(formContainer);

    // Add event listener to the new "Add Quote" button
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Update the DOM to reflect the new quote
        const quotesList = document.getElementById('quotesList') || createQuotesList();
        const newQuoteItem = document.createElement('li');
        newQuoteItem.textContent = `"${newQuoteText}" - ${newQuoteCategory}`;
        quotesList.appendChild(newQuoteItem);
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to create a list of all quotes
function createQuotesList() {
    const quotesList = document.createElement('ul');
    quotesList.id = 'quotesList';
    document.body.appendChild(quotesList);
    quotes.forEach(quote => {
        const quoteItem = document.createElement('li');
        quoteItem.textContent = `"${quote.text}" - ${quote.category}`;
        quotesList.appendChild(quoteItem);
    });
    return quotesList;
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial setup
createAddQuoteForm();
createQuotesList();
showRandomQuote();
