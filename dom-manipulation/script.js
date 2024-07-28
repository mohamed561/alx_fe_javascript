let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "An unexamined life is not worth living.", category: "Philosophy" }
];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    populateCategories();
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        alert('Quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        populateCategories();
    } else {
        alert('Please enter both quote text and category.');
    }
    filterQuotes(); // Update the displayed quotes after adding a new one
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'quotes.json');
    linkElement.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = quotes.concat(importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories();
        filterQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to populate the category filter
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(quotes.map(quote => quote.category));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    const filteredQuotes = categoryFilter === 'all' ? quotes : quotes.filter(quote => quote.category === categoryFilter);
    quoteDisplay.innerHTML = filteredQuotes.map(quote => `"${quote.text}" - ${quote.category}`).join('<br>');
    localStorage.setItem('lastFilter', categoryFilter);
}

// Function to fetch quotes from server (mock API)
function fetchQuotesFromServer() {
    return fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => data.slice(0, 5).map(post => ({
            text: post.body.split('\n')[0],
            category: 'Server Quote'
        })));
}

// Function to sync quotes with server
function syncQuotes() {
    fetchQuotesFromServer()
        .then(serverQuotes => {
            const mergedQuotes = [...quotes, ...serverQuotes];
            quotes = mergedQuotes.filter((quote, index, self) =>
                index === self.findIndex((t) => t.text === quote.text && t.category === quote.category)
            );
            saveQuotes();
            populateCategories();
            filterQuotes();
            showNotification('Quotes synced with server successfully!');
        })
        .catch(error => {
            console.error('Error syncing quotes:', error);
            showNotification('Failed to sync quotes with server.');
        });
}

// Function to show notifications
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Load quotes from local storage when the page loads
window.onload = function() {
    loadQuotes();
    const lastFilter = localStorage.getItem('lastFilter') || 'all';
    document.getElementById('categoryFilter').value = lastFilter;
    filterQuotes();
    
    // Set up periodic sync
    setInterval(syncQuotes, 300000); // Sync every 5 minutes
};

// Event listener for the Show New Quote button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
