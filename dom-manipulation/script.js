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

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const filteredQuotes = filterQuotesByCategory();
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `
            <p>"${quote.text}"</p>
            <small>Category: ${quote.category}</small>
        `;
        // Store last viewed quote in session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    } else {
        quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
    }
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
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        showRandomQuote();
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
    showRandomQuote();
    localStorage.setItem('lastSelectedCategory', document.getElementById('categoryFilter').value);
}

// Function to export quotes to JSON file
function exportToJsonFile() {
    const jsonStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
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
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes = [...quotes, ...importedQuotes];
            saveQuotes();
            updateCategoryFilter();
            showRandomQuote();
            alert('Quotes imported successfully!');
        } catch (error) {
            alert('Error importing quotes. Please ensure the file is valid JSON.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simulated server interaction
function simulateServerInteraction() {
    // Simulated server data
    const serverQuotes = [
        { id: 4, text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
        { id: 5, text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
    ];

    // Simulate fetching data from server
    setTimeout(() => {
        const newQuotes = serverQuotes.filter(serverQuote => 
            !quotes.some(localQuote => localQuote.id === serverQuote.id)
        );

        if (newQuotes.length > 0) {
            quotes = [...quotes, ...newQuotes];
            saveQuotes();
            updateCategoryFilter();
            showRandomQuote();
            alert('New quotes synced from server!');
        }
    }, 5000); // Simulate a 5-second delay
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();

    // Event listeners
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
    document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

    // Restore last selected category
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
        filterQuotes();
    }

    // Display last viewed quote if available
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quoteObj = JSON.parse(lastViewedQuote);
        alert(`Last viewed quote: "${quoteObj.text}" (Category: ${quoteObj.category})`);
    }

    // Simulate server interaction
    simulateServerInteraction();
});
