// Initialize quotes array
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
            { text: "Be the change you wish to see in the world.", category: "Inspiration" },
            { text: "The only way to do great work is to love what you do.", category: "Work" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" }
        ];
        saveQuotes();
    }
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `
        <p>"${quote.text}"</p>
        <small>Category: ${quote.category}</small>
    `;
    // Store last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        alert('New quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both quote text and category.');
    }
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
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            showRandomQuote(); // Refresh display
        } catch (error) {
            alert('Error importing quotes. Please ensure the file is valid JSON.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    showRandomQuote();

    // Event listener for the "Show New Quote" button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Event listener for the "Export Quotes" button
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);

    // Event listener for the import file input
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);

    // Display last viewed quote if available
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quoteObj = JSON.parse(lastViewedQuote);
        alert(`Last viewed quote: "${quoteObj.text}" (Category: ${quoteObj.category})`);
    }
});
