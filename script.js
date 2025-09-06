// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Data Visualization Chart
function createChart() {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Sample data for a line chart
    const data = [
        { x: 50, y: 200 },
        { x: 100, y: 150 },
        { x: 150, y: 100 },
        { x: 200, y: 120 },
        { x: 250, y: 80 },
        { x: 300, y: 60 },
        { x: 350, y: 90 }
    ];
    
    // Chart styling
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
    
    // Draw the line chart
    ctx.beginPath();
    ctx.moveTo(data[0].x, data[0].y);
    
    for (let i = 1; i < data.length; i++) {
        ctx.lineTo(data[i].x, data[i].y);
    }
    ctx.stroke();
    
    // Fill area under the curve
    ctx.lineTo(data[data.length - 1].x, height - 50);
    ctx.lineTo(data[0].x, height - 50);
    ctx.closePath();
    ctx.fill();
    
    // Draw data points
    ctx.fillStyle = '#fbbf24';
    data.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Add grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 50; x <= width - 50; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, height - 50);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 50; y <= height - 50; y += 30) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(width - 50, y);
        ctx.stroke();
    }
    
    // Add labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    // X-axis labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    months.forEach((month, index) => {
        const x = 50 + (index * 50);
        ctx.fillText(month, x, height - 20);
    });
    
    // Y-axis label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Performance', 0, 0);
    ctx.restore();
    
    // Chart title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Data Analysis Performance', width / 2, 30);
}

// Animate numbers in stats
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent.replace('+', ''));
                let currentValue = 0;
                const increment = finalValue / 30;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue + '+';
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(currentValue) + '+';
                    }
                }, 50);
                
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Initialize animations and chart
window.addEventListener('load', function() {
    createChart();
    animateStats();
});

// Responsive chart resize
window.addEventListener('resize', function() {
    setTimeout(createChart, 100);
});

// Add typing effect to hero title
function typeWriter() {
    const text = "Hi, I'm Hanmei Zhang";
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    heroTitle.innerHTML = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === 'H' && text.substring(i, i + 6) === 'Hanmei') {
                heroTitle.innerHTML += '<span class="highlight">';
            }
            heroTitle.innerHTML += text.charAt(i);
            if (i === text.length - 1) {
                heroTitle.innerHTML += '</span>';
            }
            i++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 1000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.about, .skills, .projects, .experience, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Animate skill bars when they come into view
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Contact form submission
function handleFormSubmission() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert(`Thank you ${name}! Your message has been sent. I'll get back to you soon.`);
        form.reset();
    });
}

// Parallax effect for hero section
function addParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Initialize all animations and effects
window.addEventListener('load', function() {
    createChart();
    animateStats();
    animateSkillBars();
    handleFormSubmission();
    addParallaxEffect();
});

// Add scroll indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrollPercent + '%';
    });
}

// Add loading animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loader);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.firstElementChild.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 500);
        }, 1500);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    showLoadingAnimation();
    createScrollIndicator();
    initializeMoreProjectsButton();
});

// More Projects functionality
function initializeMoreProjectsButton() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const showLessBtn = document.getElementById('showLessBtn');
    const additionalProjects = document.getElementById('additionalProjects');
    
    if (viewMoreBtn && showLessBtn && additionalProjects) {
        viewMoreBtn.addEventListener('click', function() {
            additionalProjects.style.display = 'block';
            viewMoreBtn.style.display = 'none';
            
            // Smooth scroll to additional projects
            setTimeout(() => {
                additionalProjects.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        });
        
        showLessBtn.addEventListener('click', function() {
            additionalProjects.style.display = 'none';
            viewMoreBtn.style.display = 'inline-block';
            
            // Scroll back to main projects section
            document.getElementById('projects').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    }
}