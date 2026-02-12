// Global variables for dynamic effects
let customBlur = 15;
let customOpacity = 0.25;
let customSaturation = 150;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeParticleSystem();
    initializeScrollEffects();
    initializeTiltEffects();
    initializeNavigation();
    initializeNewExperiments();
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
document.addEventListener('click', function (e) {
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

// Particle System 2.0 - Organic "Digital Liquid"
function initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 60;
    const mouse = { x: -1000, y: -1000, radius: 100 };

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 2 + 0.5;
            this.baseRadius = this.radius;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
        }

        update() {
            // Organic drift
            this.x += this.vx;
            this.y += this.vy;

            // Mouse Repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force * 0.2;
                this.vy += Math.sin(angle) * force * 0.2;
                this.radius = this.baseRadius + force * 2;
            } else {
                this.radius = this.baseRadius;
            }

            // Friction/Damping for liquid feel
            this.vx *= 0.99;
            this.vy *= 0.99;

            // Wall bounce
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw fluid ties
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 60) {
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 60)})`;
                }
            }
        }
        ctx.stroke();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    animate();
}

// Global Mouse Tracking for Mesh Gradient and Cards
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    // Update Mesh Gradient positions via CSS variables
    document.body.style.setProperty('--mesh-x', `${x}%`);
    document.body.style.setProperty('--mesh-y', `${y}%`);

    // Update individual cards for spotlight effect and unique logic
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);

        // Liquid Effect
        if (card.classList.contains('card-liquid')) {
            const relX = (mouseX / rect.width) * 100;
            const relY = (mouseY / rect.height) * 100;
            card.style.setProperty('--liquid-x', `${relX}%`);
            card.style.setProperty('--liquid-y', `${relY}%`);
        }

        // Shimmer Effect
        if (card.classList.contains('card-morphism')) {
            const relX = (mouseX / rect.width) * 200 - 50;
            card.style.setProperty('--shimmer-x', `${relX}%`);
        }

        // Color Blend Hue Shift
        if (card.classList.contains('card-blend')) {
            const dist = Math.sqrt(Math.pow(mouseX - rect.width / 2, 2) + Math.pow(mouseY - rect.height / 2, 2));
            const hue = (dist / rect.width) * 180;
            card.style.setProperty('--hue-shift', `${hue}deg`);
        }
    });
});

// Tilt Effects for Cards
function initializeTiltEffects() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function (e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -12;
            const rotateY = (x - centerX) / centerX * 12;

            // Merge tilt with the hover transform for extra depth
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.04) translateZ(30px)`;
        });

        element.addEventListener('mouseleave', function () {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1) translateZ(0px)';
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
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
        link.addEventListener('click', function (e) {
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
    window.addEventListener('scroll', function () {
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
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('glass-button')) {
        const button = e.target;
        const originalText = button.textContent;

        // Add ripple effect to all glass buttons
        createRipple({
            currentTarget: button,
            clientX: e.clientX,
            clientY: e.clientY
        });

        // Add click scaling effect
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
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const blobs = document.querySelectorAll('.animated-blob');

    blobs.forEach((blob, index) => {
        const speed = 0.5 + (index * 0.1);
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Dynamic background color based on scroll
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrolled / maxScroll;

    const hue1 = 235 + (scrollPercent * 50); // Changes from blue to purple
    const hue2 = 280 + (scrollPercent * 30); // Changes throughout spectrum

    document.body.style.background = `linear-gradient(135deg, hsl(${hue1}, 60%, 60%) 0%, hsl(${hue2}, 55%, 55%) 100%)`;
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

console.log('Liquid Glass website initialized successfully! 💧✨');
// New Interactive Experiments
function initializeNewExperiments() {
    // 1. Magnetic Button
    const magneticItems = document.querySelectorAll('.magnetic-item');
    magneticItems.forEach(item => {
        const wrap = item.closest('.magnetic-wrap');
        wrap.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            
            // Apply magnetic pull (capped)
            const pullX = Math.min(Math.max(dx * 0.3, -20), 20);
            const pullY = Math.min(Math.max(dy * 0.3, -20), 20);
            
            item.style.transform = `translate(${pullX}px, ${pullY}px)`;
        });
        
        wrap.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0, 0)';
        });
    });

    // 2. Refraction Lens (Draggable)
    const lens = document.getElementById('draggable-lens');
    if (lens) {
        let isDragging = false;
        let startX, startY;

        lens.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            lens.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            startX = e.clientX;
            startY = e.clientY;
            
            // Restrict to container
            lens.style.left = `${lens.offsetLeft + dx}px`;
            lens.style.top = `${lens.offsetTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (lens) lens.style.cursor = 'grab';
        });
    }

    // 3. Frosted Window (Grain Clearing)
    const frostCanvas = document.getElementById('frost-canvas');
    if (frostCanvas) {
        const ctx = frostCanvas.getContext('2d');
        const parent = frostCanvas.parentElement;
        
        const initFrost = () => {
            frostCanvas.width = parent.offsetWidth;
            frostCanvas.height = parent.offsetHeight;
            
            // Create "frost" texture
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, frostCanvas.width, frostCanvas.height);
            
            // Add grain
            for (let i = 0; i < 5000; i++) {
                const x = Math.random() * frostCanvas.width;
                const y = Math.random() * frostCanvas.height;
                const size = Math.random() * 2;
                ctx.fillStyle = `rgba(180, 180, 200, ${Math.random() * 0.2})`;
                ctx.fillRect(x, y, size, size);
            }
            
            ctx.globalCompositeOperation = 'destination-out';
        };

        initFrost();
        window.addEventListener('resize', initFrost);

        let isClearing = false;
        const clear = (e) => {
            if (!isClearing) return;
            const rect = frostCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        };

        frostCanvas.addEventListener('mousedown', () => isClearing = true);
        frostCanvas.addEventListener('mousemove', clear);
        document.addEventListener('mouseup', () => isClearing = false);
    }
}
