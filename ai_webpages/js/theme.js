// Add the toggle switch HTML to the body
function addThemeToggle() {
    const toggleHTML = `
        <div class="theme-switch-wrapper">
            <label class="theme-switch" for="checkbox">
                <input type="checkbox" id="checkbox" />
                <div class="slider round"></div>
            </label>
            <span class="theme-label">Dark Mode</span>
        </div>
    `;
    
    // Create a container for the toggle
    const toggleContainer = document.createElement('div');
    toggleContainer.innerHTML = toggleHTML;
    
    // Insert it at the beginning of the body
    document.body.insertBefore(toggleContainer.firstElementChild, document.body.firstChild);
    
    // Initialize theme toggle functionality
    initThemeToggle();
}

// Initialize the theme toggle functionality
function initThemeToggle() {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    // Check for saved theme preference
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    // Handle theme toggle
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }    
    }

    toggleSwitch.addEventListener('change', switchTheme, false);
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    addThemeToggle();
});