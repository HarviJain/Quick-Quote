const quote = document.getElementById("quote");
const author = document.getElementById("author");
const loading = document.getElementById("loading");
const shareBtn = document.getElementById("shareBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("quoteCanvas");
const ctx = canvas.getContext("2d");

const api_url = "https://api.quotable.io/random";

async function getquote(url) {
    showLoading();
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateQuote(data.content, data.author);
    } catch (error) {
        console.error('Error fetching quote:', error);
        updateQuote('An error occurred while fetching the quote.', 'Error');
    } finally {
        hideLoading();
    }
}

function showLoading() {
    loading.style.display = 'block';
    quote.style.opacity = '0';
    author.style.opacity = '0';
}

function hideLoading() {
    loading.style.display = 'none';
    quote.style.opacity = '1';
    author.style.opacity = '1';
}

function updateQuote(quoteText, authorName) {
    quote.textContent = quoteText;
    author.textContent = authorName;
}

function fetchNewQuote() {
    getquote(api_url);
}

function shareQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text="${quote.textContent}" - ${author.textContent}`;
    window.open(twitterUrl, '_blank');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', isDarkMode);
}

shareBtn.addEventListener('click', shareQuote);
darkModeToggle.addEventListener('click', toggleDarkMode);

fetchNewQuote();

if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode();
}

function downloadQuote() {
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#2c3e50");
    gradient.addColorStop(1, "#3498db");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add a subtle pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let i = 0; i < width; i += 20) {
        for (let j = 0; j < height; j += 20) {
            ctx.beginPath();
            ctx.arc(i, j, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Add a decorative element
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.lineTo(150, 200);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fill();

    // Set text styles for quote
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 48px 'Arial', sans-serif";

    // Draw quote with shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    wrapText(ctx, `"${quote.textContent}"`, width/2, height/2 - 30, width - 200, 60);

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw author
    ctx.font = "italic 32px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(`- ${author.textContent}`, width/2, height - 100);

    // Draw Quick Quote bookmark
    ctx.font = "24px 'Arial', sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText("Quick Quote", width - 40, height - 40);

    // Add a border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Create download link
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "quick_quote.png";
    link.click();
}

// Update the wrapText function for better text wrapping
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        }
        else {
            line = testLine;
        }
    }
    lines.push(line);

    let startY = y - (lineHeight * (lines.length - 1)) / 2;
    lines.forEach((line, index) => {
        context.fillText(line, x, startY + index * lineHeight);
    });
}

downloadBtn.addEventListener('click', downloadQuote);

