// Global variables for dynamic effects
let customBlur = 15;
let customOpacity = 0.25;
let customSaturation = 150;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParticleSystem();
    initializeScrollEffects();
    initializeTiltEffects();
    initializeNavigation();
});

// Modal Functions
function openModal() {
    const modal = document.getElementById('glass-modal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('glass-modal');
    modal.classList.remove('active');
}

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('glass-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Ripple Effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Dynamic Effect Controls
function updateBlur(value) {
    customBlur = value;
    updateGlassElements();
}

function updateOpacity(value) {
    customOpacity = value;
    updateGlassElements();
}

function updateSaturation(value) {
    customSaturation = value;
    updateGlassElements();
}

function updateGlassElements() {
    const elements = document.querySelectorAll('.glass-element');
    elements.forEach(element => {
        element.style.backdropFilter = `blur(${customBlur}px) saturate(${customSaturation}%)`;
        element.style.webkitBackdropFilter = `blur(${customBlur}px) saturate(${customSaturation}%)`;
        
        // Update background with new opacity
        const currentBg = element.style.background || getComputedStyle(element).background;
        if (element.classList.contains('sample-1')) {
            element.style.background = `rgba(255, 107, 107, ${customOpacity})`;
        } else if (element.classList.contains('sample-2')) {
            element.style.background = `rgba(78, 205, 196, ${customOpacity})`;
        } else if (element.classList.contains('sample-3')) {
            element.style.background = `rgba(255, 193, 7, ${customOpacity})`;
        }
    });
}

function resetEffects() {
    customBlur = 15;
    customOpacity = 0.25;
    customSaturation = 150;
    
    document.getElementById('blur-range').value = customBlur;
    document.getElementById('opacity-range').value = customOpacity;
    document.getElementById('saturation-range').value = customSaturation;
    
    updateGlassElements();
}

// Particle System
function initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Keep particles in bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) +
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Mouse interaction
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        particles.forEach(particle => {
            const distance = Math.sqrt(
                Math.pow(particle.x - mouseX, 2) +
                Math.pow(particle.y - mouseY, 2)
            );
            
            if (distance < 50) {
                const angle = Math.atan2(particle.y - mouseY, particle.x - mouseX);
                particle.vx += Math.cos(angle) * 0.5;
                particle.vy += Math.sin(angle) * 0.5;
            }
        });
    });
}

// Tilt Effects for Cards
function initializeTiltEffects() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.glass-card, .experiment-item, .effect-control');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

// Button Interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('glass-button')) {
        const button = e.target;
        const originalText = button.textContent;
        
        // Add click effect
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Special interactions for specific buttons
        if (button.textContent.includes('Interact')) {
            button.textContent = 'Interacting...';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1500);
        } else if (button.textContent.includes('Explore')) {
            button.textContent = 'Exploring...';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1500);
        } else if (button.textContent.includes('Animate')) {
            button.textContent = 'Animating...';
            const card = button.closest('.glass-card');
            card.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                button.textContent = originalText;
                card.style.animation = '';
            }, 1500);
        } else if (button.textContent.includes('Blend')) {
            button.textContent = 'Blending...';
            const card = button.closest('.glass-card');
            const originalBg = card.style.background;
            card.style.background = 'linear-gradient(45deg, rgba(255, 0, 150, 0.3), rgba(0, 255, 255, 0.3))';
            setTimeout(() => {
                button.textContent = originalText;
                card.style.background = originalBg;
            }, 1500);
        }
    }
});

// Pulse animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Parallax effect for background blobs
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const blobs = document.querySelectorAll('.animated-blob');
    
    blobs.forEach((blob, index) => {
        const speed = 0.5 + (index * 0.1);
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Dynamic background color based on scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrolled / maxScroll;
    
    const hue1 = 235 + (scrollPercent * 50); // Changes from blue to purple
    const hue2 = 280 + (scrollPercent * 30); // Changes throughout spectrum
    
    document.body.style.background = `linear-gradient(135deg, hsl(${hue1}, 60%, 60%) 0%, hsl(${hue2}, 55%, 55%) 100%)`;
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

console.log('Liquid Glass website initialized successfully! 💧✨');