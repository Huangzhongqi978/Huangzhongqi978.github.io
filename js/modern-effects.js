// 现代化效果JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有现代化效果
    initScrollEffects();
    initAnimations();
    initLazyLoading();
    initSmoothScroll();
    initThemeToggle();
    initParticleInteraction();
});

// 滚动效果
function initScrollEffects() {
    // 视差滚动效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // 元素进入视口动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.card, .article, .widget').forEach(el => {
        observer.observe(el);
    });
}

// 动画效果
function initAnimations() {
    // 鼠标悬停效果
    document.querySelectorAll('.card-hover').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 按钮波纹效果
    document.querySelectorAll('.modern-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 懒加载
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // 更新粒子颜色
            if (window.particlesJS) {
                updateParticleTheme(isDark);
            }
        });
        
        // 加载保存的主题
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// 粒子交互效果
function initParticleInteraction() {
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 创建鼠标跟随效果
        createMouseTrail(mouseX, mouseY);
    });
    
    // 鼠标点击爆炸效果
    document.addEventListener('click', function(e) {
        createClickExplosion(e.clientX, e.clientY);
    });
}

// 创建鼠标轨迹
function createMouseTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.width = '4px';
    trail.style.height = '4px';
    trail.style.background = '#1e88e5';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.opacity = '0.6';
    trail.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => trail.remove(), 300);
    }, 100);
}

// 创建点击爆炸效果
function createClickExplosion(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let posX = x, posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx * 0.1;
            posY += vy * 0.1;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// 更新粒子主题
function updateParticleTheme(isDark) {
    if (window.particlesJS && window.particlesJS.pJSDom && window.particlesJS.pJSDom[0]) {
        const pJS = window.particlesJS.pJSDom[0].pJS;
        if (pJS) {
            pJS.particles.color.value = isDark ? '#4ecdc4' : '#1e88e5';
            pJS.particles.line_linked.color = isDark ? '#4ecdc4' : '#1e88e5';
            pJS.fn.particlesRefresh();
        }
    }
}

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    // 隐藏加载动画
    const loader = document.querySelector('.loading-spinner');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // 添加页面加载完成的动画
    document.body.classList.add('loaded');
});

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loaded {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .dark-theme {
        background: #1a1a1a;
        color: #ffffff;
    }
    
    .dark-theme .glass-morphism {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
`;
document.head.appendChild(style);

