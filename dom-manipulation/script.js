// Initialize quotes array
let quotes = [
    { id: 1, text: "Be the change you wish to see in the world.", category: "Inspiration" },
    { id: 2, text: "The only way to do great work is to love what you do.", category: "Work" },
    { id: 3, text: "Life is what happens when you're busy making other plans.", category: "Life" }
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
    updateCategoryFilter();
}

// Function to display quotes based on selected category
function displayQuotes() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const filteredQuotes = filterQuotesByCategory();
    quoteDisplay.innerHTML = filteredQuotes.map(quote => 
        `<div>
            <p>"${quote.text}"</p>
            <small>Category: ${quote.category}</small>
        </div>`
    ).join('');
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
    `;
    document.body.appendChild(formContainer);

    // Add event listener to the Add Quote button
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { 
            id: Date.now(), 
            text: newQuoteText, 
            category: newQuoteCategory 
        };
        quotes.push(newQuote);
        saveQuotes();
        updateCategoryFilter();
        displayQuotes();
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to update category filter options
function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = ['All Categories', ...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = categories.map(category => 
        `<option value="${category}">${category}</option>`
    ).join('');
    
    // Restore last selected category
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

// Function to filter quotes by selected category
function filterQuotesByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    if (selectedCategory === 'All Categories') {
        return quotes;
    } else {
        return quotes.filter(quote => quote.category === selectedCategory);
    }
}

// Function to handle category filter change
function filterQuotes() {
    displayQuotes();
    localStorage.setItem('lastSelectedCategory', document.getElementById('categoryFilter').value);
}

// Simulated server data
const serverQuotes = [
    { id: 4, text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { id: 5, text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// Function to simulate server interaction
function simulateServerInteraction() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(serverQuotes);
        }, 1000);
    });
}

// Function to sync data with server
async function syncWithServer() {
    try {
        const serverData = await simulateServerInteraction();
        let conflicts = [];

        serverData.forEach(serverQuote => {
            const localQuote = quotes.find(q => q.id === serverQuote.id);
            if (localQuote) {
                if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
                    conflicts.push({ local: localQuote, server: serverQuote });
                }
            } else {
                quotes.push(serverQuote);
            }
        });

        if (conflicts.length > 0) {
            handleConflicts(conflicts);
        } else {
            saveQuotes();
            updateCategoryFilter();
            displayQuotes();
            showNotification('Data synced successfully!');
        }
    } catch (error) {
        showNotification('Error syncing data with server.');
    }
}

// Function to handle conflicts
function handleConflicts(conflicts) {
    const conflictResolutionDiv = document.createElement('div');
    conflictResolutionDiv.id = 'conflictResolution';
    conflictResolutionDiv.innerHTML = `
        <h2>Conflicts Detected</h2>
        ${conflicts.map((conflict, index) => `
            <div>
                <p>Local: "${conflict.local.text}" (${conflict.local.category})</p>
                <p>Server: "${conflict.server.text}" (${conflict.server.category})</p>
                <button onclick="resolveConflict(${index}, 'local')">Keep Local</button>
                <button onclick="resolveConflict(${index}, 'server')">Keep Server</button>
            </div>
        `).join('')}
    `;
    document.body.appendChild(conflictResolutionDiv);
}

// Function to resolve a conflict
function resolveConflict(index, choice) {
    const conflict = conflicts[index];
    if (choice === 'server') {
        const quoteIndex = quotes.findIndex(q => q.id === conflict.server.id);
        if (quoteIndex !== -1) {
            quotes[quoteIndex] = conflict.server;
        } else {
            quotes.push(conflict.server);
        }
    }
    conflicts.splice(index, 1);
    if (conflicts.length === 0) {
        document.body.removeChild(document.getElementById('conflictResolution'));
        saveQuotes();
        updateCategoryFilter();
        displayQuotes();
        showNotification('All conflicts resolved!');
    } else {
        handleConflicts(conflicts);
    }
}

// Function to show notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = '#f0f0f0';
    notification.style.border = '1px solid #ccc';
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();
    displayQuotes();

    // Event listeners
    document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
    document.getElementById('syncButton').addEventListener('click', syncWithServer);

    // Periodic sync (every 5 minutes)
    setInterval(syncWithServer, 300000);
});
