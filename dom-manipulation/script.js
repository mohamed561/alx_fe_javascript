// Initial quotes array
let quotes = [];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
            { text: "Stay hungry, stay foolish.", category: "Motivation" }
        ];
        saveQuotes();
    }
    populateCategories();
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
        // Store last viewed quote in session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    } else {
        quoteDisplay.innerHTML = "<p>No quotes available. Add some quotes!</p>";
    }
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
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Update the DOM to reflect the new quote
        updateQuotesList();
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to create and update the list of all quotes
function updateQuotesList() {
    const quotesList = document.getElementById('quotesList') || createQuotesList();
    quotesList.innerHTML = ''; // Clear existing list
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    quotes.forEach(quote => {
        if (selectedCategory === 'all' || quote.category === selectedCategory) {
            const quoteItem = document.createElement('li');
            quoteItem.textContent = `"${quote.text}" - ${quote.category}`;
            quotesList.appendChild(quoteItem);
        }
    });
}

function createQuotesList() {
    const quotesList = document.createElement('ul');
    quotesList.id = 'quotesList';
    document.body.appendChild(quotesList);
    return quotesList;
}

// Function to export quotes to JSON file
function exportToJsonFile() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        updateQuotesList();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to populate categories
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    
    categoryFilter.innerHTML = categories.map(category => 
        `<option value="${category}">${category === 'all' ? 'All Categories' : category}</option>`
    ).join('');

    // Restore the last selected category
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    updateQuotesList();
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportJson').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Initial setup
loadQuotes();
createAddQuoteForm();
updateQuotesList();
showRandomQuote();

// Display last viewed quote from session storage (if available)
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
    const lastQuote = JSON.parse(lastViewedQuote);
    console.log('Last viewed quote:', lastQuote);
}
