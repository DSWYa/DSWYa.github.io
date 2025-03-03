document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AI Creations",
        "url": "https://www.aicreations.com",
        "logo": "https://www.aicreations.com/images/logo.png",
        "sameAs": [
            "https://twitter.com/aicreations",
            "https://github.com/aicreations",
            "https://linkedin.com/company/aicreations"
        ]
    };
    
    // Structured Data for Website
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AI Creations",
        "url": "https://www.aicreations.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.aicreations.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
    
    // Function to add structured data to the page
    function addStructuredData() {
        // Create script elements for each schema
        const orgSchemaScript = document.createElement('script');
        orgSchemaScript.type = 'application/ld+json';
        orgSchemaScript.textContent = JSON.stringify(organizationSchema);
        
        const websiteSchemaScript = document.createElement('script');
        websiteSchemaScript.type = 'application/ld+json';
        websiteSchemaScript.textContent = JSON.stringify(websiteSchema);
        
        // Append to document head or body
        document.body.appendChild(orgSchemaScript);
        document.body.appendChild(websiteSchemaScript);
    }
    
    // Call the function when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', addStructuredData);
});
const subscribeForm = document.querySelector('.subscribe-form');
    
subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}! You will receive updates on our latest AI projects.`);
    this.reset();
});