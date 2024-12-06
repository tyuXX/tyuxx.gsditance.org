function createFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Check if light theme is active
    const isLightTheme = document.body.classList.contains("light-theme");
    
    // Set colors based on theme
    const backgroundColor = isLightTheme ? '#FFFFFF' : '#121212';
    const textColor = '#bb86fc';
    
    // Draw rounded rectangle background
    ctx.fillStyle = backgroundColor;
    const radius = 8; // Corner radius
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(32 - radius, 0);
    ctx.quadraticCurveTo(32, 0, 32, radius);
    ctx.lineTo(32, 32 - radius);
    ctx.quadraticCurveTo(32, 32, 32 - radius, 32);
    ctx.lineTo(radius, 32);
    ctx.quadraticCurveTo(0, 32, 0, 32 - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('tX', 16, 16);
    
    // Create favicon link element
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    
    // Set favicon
    favicon.href = canvas.toDataURL('image/png');
}

// Create initial favicon after DOM is loaded
document.addEventListener('DOMContentLoaded', createFavicon);

// Update favicon when theme changes
toggle.addEventListener('click', createFavicon);
