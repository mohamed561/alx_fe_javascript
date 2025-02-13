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
        updateQuotesList();
        syncQuotes();
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to create and update the list of all quotes
function updateQuotesList() {
    const quotesList = document.getElementById('quotesList') || createQuotesList();
    quotesList.innerHTML = '';
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
        syncQuotes();
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

    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    updateQuotesList();
}

// Function to fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        return JSON.parse(data.body || '[]');
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Function to post quotes to server
async function postQuotesToServer(quotes) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(quotes),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        console.log('Quotes posted to server:', data);
    } catch (error) {
        console.error('Error posting quotes to server:', error);
    }
}

// Function to sync quotes with server
async function syncQuotes() {
    updateSyncStatus('Syncing...');
    const serverQuotes = await fetchQuotesFromServer();
    
    // Simple conflict resolution (server data takes precedence)
    if (serverQuotes.length > quotes.length) {
        const newQuotes = serverQuotes.slice(quotes.length);
        quotes.push(...newQuotes);
        saveQuotes(); // Update local storage
        populateCategories();
        updateQuotesList();
        showNotification('New quotes synced from server');
    } else {
        showNotification('Quotes synced with server!'); // Added notification here
    }
    
    // Post local quotes to server
    await postQuotesToServer(quotes);
    
    updateSyncStatus('Sync complete');
}

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.padding = '10px';
    notification.style.margin = '10px 0';
    notification.style.borderRadius = '5px';
    notification.style.backgroundColor = type === 'error' ? '#ffcccc' : '#ccffcc';
    document.body.insertBefore(notification, document.body.firstChild);
    setTimeout(() => notification.remove(), 5000);
}

// Function to update sync status
function updateSyncStatus(status) {
    const syncStatus = document.getElementById('syncStatus');
    syncStatus.textContent = `Sync Status: ${status}`;
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

// Periodic sync with server (every 5 minutes)
setInterval(syncQuotes, 5 * 60 * 1000);

// Initial sync on page load
syncQuotes();

// Display last viewed quote from session storage (if available)
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
    const lastQuote = JSON.parse(lastViewedQuote);
    console.log('Last viewed quote:', lastQuote);
}

