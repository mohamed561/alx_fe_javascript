let quotes = [];
let categories = [];
let lastSyncTime = 0;

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        updateCategories();
    }
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    updateCategories();
}

function updateCategories() {
    categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function showRandomQuote(category = 'all') {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const filteredQuotes = category === 'all' ? quotes : quotes.filter(quote => quote.category === category);
    
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
        sessionStorage.setItem('lastQuote', JSON.stringify(quote));
    } else {
        quoteDisplay.innerHTML = '<p>No quotes available in this category.</p>';
    }
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        showNotification('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        showNotification('Please enter both quote text and category.');
    }
}

function exportToJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quotes.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = quotes.concat(importedQuotes);
        saveQuotes();
        showNotification('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function filterQuotes() {
    const category = document.getElementById('categoryFilter').value;
    showRandomQuote(category);
    localStorage.setItem('lastFilter', category);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    setTimeout(() => {
        notification.textContent = '';
    }, 3000);
}

function syncWithServer() {
    // Simulating server interaction with JSONPlaceholder
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            const serverQuotes = data.map(item => ({
                text: item.body,
                category: 'Server Quote'
            })).slice(0, 5); // Limiting to 5 quotes for demonstration

            // Simple conflict resolution: Server data takes precedence
            const mergedQuotes = [...quotes, ...serverQuotes];
            quotes = mergedQuotes.filter((quote, index, self) =>
                index === self.findIndex((t) => t.text === quote.text && t.category === quote.category)
            );

            saveQuotes();
            showNotification('Synced with server successfully!');
            lastSyncTime = Date.now();
        })
        .catch(error => {
            console.error('Error syncing with server:', error);
            showNotification('Failed to sync with server. Please try again later.');
        });
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', () => filterQuotes());
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('exportButton').addEventListener('click', exportToJson);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Initialize the application
loadQuotes();
updateCategories();

// Restore last filter
const lastFilter = localStorage.getItem('lastFilter') || 'all';
document.getElementById('categoryFilter').value = lastFilter;
filterQuotes();

// Periodically sync with server (every 5 minutes)
setInterval(() => {
    if (Date.now() - lastSyncTime > 300000) { // 5 minutes in milliseconds
        syncWithServer();
    }
}, 60000); // Check every minute

// Initial sync
syncWithServer();
