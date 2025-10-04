// 现代视觉效果系统
class ModernEffects {
    constructor() {
        this.mouseTrail = [];
        this.maxTrailLength = 20;
        this.particles = [];
        this.maxParticles = 50;
        this.isDarkMode = false;
        this.clickEffects = [];
        
        this.init();
    }
    
    init() {
        this.createMouseTrail();
        this.createClickEffects();
        this.initThemeToggle();
        this.bindEvents();
    }
    
    // 鼠标跟随效果
    createMouseTrail() {
        const trailContainer = document.createElement('div');
        trailContainer.id = 'mouse-trail';
        trailContainer.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;
        document.body.appendChild(trailContainer);
    }
    
    // 创建鼠标轨迹点
    addTrailPoint(x, y) {
        const trailContainer = document.getElementById('mouse-trail');
        if (!trailContainer) return;
        
        const point = document.createElement('div');
        point.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, rgba(30, 136, 229, 0.8) 0%, rgba(30, 136, 229, 0.4) 50%, transparent 100%);
            border-radius: 50%;
            left: ${x - 4}px;
            top: ${y - 4}px;
            pointer-events: none;
            animation: trailFade 1.5s ease-out forwards;
        `;
        
        trailContainer.appendChild(point);
        
        // 限制轨迹点数量
        const points = trailContainer.children;
        if (points.length > this.maxTrailLength) {
            points[0].remove();
        }
        
        // 自动移除过期的点
        setTimeout(() => {
            if (point.parentNode) {
                point.remove();
            }
        }, 1500);
    }
    
    // 点击粒子暴击效果
    createClickEffects() {
        const clickContainer = document.createElement('div');
        clickContainer.id = 'click-effects';
        clickContainer.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;
        document.body.appendChild(clickContainer);
    }
    
    // 创建点击粒子效果
    createClickParticles(x, y) {
        const clickContainer = document.getElementById('click-effects');
        if (!clickContainer) return;
        
        const particleCount = 12;
        const colors = ['#1e88e5', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 100;
            const size = 4 + Math.random() * 6;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                box-shadow: 0 0 10px ${color};
            `;
            
            clickContainer.appendChild(particle);
            
            // 动画粒子
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            let scale = 1;
            
            const animate = () => {
                posX += vx * 0.016;
                posY += vy * 0.016;
                opacity -= 0.02;
                scale -= 0.01;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;
                particle.style.transform = `scale(${scale})`;
                
                if (opacity > 0 && scale > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // 暗黑模式切换
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        // 检查本地存储的主题
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
    }
    
    enableDarkMode() {
        document.body.classList.add('dark-mode');
        this.isDarkMode = true;
        localStorage.setItem('theme', 'dark');
        
        // 更新主题切换按钮图标
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
        
        // 更新鼠标轨迹颜色
        this.updateTrailColors('#ff6b6b', '#4ecdc4');
    }
    
    enableLightMode() {
        document.body.classList.remove('dark-mode');
        this.isDarkMode = false;
        localStorage.setItem('theme', 'light');
        
        // 更新主题切换按钮图标
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
        
        // 更新鼠标轨迹颜色
        this.updateTrailColors('#1e88e5', '#45b7d1');
    }
    
    updateTrailColors(color1, color2) {
        // 更新CSS变量
        document.documentElement.style.setProperty('--trail-color-1', color1);
        document.documentElement.style.setProperty('--trail-color-2', color2);
    }
    
    // 绑定事件
    bindEvents() {
        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
        
        // 点击事件
        document.addEventListener('click', (e) => {
            this.createClickParticles(e.clientX, e.clientY);
        });
        
        // 主题切换事件
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (this.isDarkMode) {
                    this.enableLightMode();
                } else {
                    this.enableDarkMode();
                }
            });
        }
        
        // 键盘快捷键 (Ctrl+Shift+D 切换主题)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                if (this.isDarkMode) {
                    this.enableLightMode();
                } else {
                    this.enableDarkMode();
                }
            }
        });
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.3);
        }
    }
    
    .dark-mode {
        background-color: #1a1a1a !important;
        color: #ffffff !important;
    }
    
    .dark-mode .card {
        background-color: #2d2d2d !important;
        color: #ffffff !important;
    }
    
    .dark-mode .navbar {
        background-color: #2d2d2d !important;
    }
    
    .dark-mode .footer {
        background-color: #2d2d2d !important;
    }
    
    .dark-mode .article {
        color: #ffffff !important;
    }
    
    .dark-mode .title {
        color: #ffffff !important;
    }
    
    .dark-mode .content {
        color: #e0e0e0 !important;
    }
    
    .dark-mode .link-muted {
        color: #4ecdc4 !important;
    }
    
    .dark-mode .link-muted:hover {
        color: #ff6b6b !important;
    }
    
    .dark-mode .button {
        background-color: #3d3d3d !important;
        color: #ffffff !important;
        border-color: #555555 !important;
    }
    
    .dark-mode .button:hover {
        background-color: #4d4d4d !important;
    }
    
    .dark-mode .tag {
        background-color: #4d4d4d !important;
        color: #ffffff !important;
    }
    
    .dark-mode .level-item {
        color: #e0e0e0 !important;
    }
    
    .dark-mode .menu-label {
        color: #ffffff !important;
    }
    
    .dark-mode .menu-list a {
        color: #e0e0e0 !important;
    }
    
    .dark-mode .menu-list a:hover {
        color: #4ecdc4 !important;
    }
    
    .dark-mode .media-content .title {
        color: #ffffff !important;
    }
    
    .dark-mode .media-content .date {
        color: #b0b0b0 !important;
    }
    
    .dark-mode .media-content .categories {
        color: #4ecdc4 !important;
    }
    
    .dark-mode .breadcrumb a {
        color: #4ecdc4 !important;
    }
    
    .dark-mode .breadcrumb a:hover {
        color: #ff6b6b !important;
    }
    
    .dark-mode .pagination-link {
        background-color: #3d3d3d !important;
        color: #ffffff !important;
        border-color: #555555 !important;
    }
    
    .dark-mode .pagination-link:hover {
        background-color: #4d4d4d !important;
    }
    
    .dark-mode .pagination-link.is-current {
        background-color: #1e88e5 !important;
        color: #ffffff !important;
    }
    
    .dark-mode .searchbox {
        background-color: #2d2d2d !important;
        color: #ffffff !important;
    }
    
    .dark-mode .searchbox-input {
        background-color: #3d3d3d !important;
        color: #ffffff !important;
        border-color: #555555 !important;
    }
    
    .dark-mode .searchbox-input::placeholder {
        color: #b0b0b0 !important;
    }
    
    .dark-mode .searchbox-close {
        color: #ffffff !important;
    }
    
    .dark-mode .searchbox-close:hover {
        color: #ff6b6b !important;
    }
    
    .dark-mode .searchbox-body {
        background-color: #3d3d3d !important;
    }
    
    .dark-mode .searchbox-body a {
        color: #e0e0e0 !important;
    }
    
    .dark-mode .searchbox-body a:hover {
        color: #4ecdc4 !important;
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经存在现代效果
    if (!window.modernEffects) {
        window.modernEffects = new ModernEffects();
    }
});

// 导出类供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernEffects;
}
