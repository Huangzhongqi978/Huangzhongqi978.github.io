// 动态背景系统
class DynamicBackground {
    constructor() {
        this.backgrounds = [
            // 本地温馨SVG背景
            '/images/backgrounds/bg1.svg', // 温暖日落
            '/images/backgrounds/bg2.svg', // 柔和粉色
            '/images/backgrounds/bg3.svg', // 温暖蓝色
            '/images/backgrounds/bg4.svg', // 薰衣草梦境
            '/images/backgrounds/bg5.svg', // 柔和绿色
            '/images/backgrounds/bg6.svg', // 珊瑚温暖
            '/images/backgrounds/bg7.svg', // 青蓝海洋
            '/images/backgrounds/bg8.svg'  // 琥珀光芒
        ];
        
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoChangeInterval = null;
        this.autoChangeDelay = 4000; // 4秒自动切换，给过渡更多时间
        this.transitionDuration = 2000; // 2秒过渡时间
        this.transitionEffects = ['fade', 'slide', 'zoom', 'rotate']; // 多种过渡效果
        this.currentEffect = 0;
        
        this.init();
    }
    
    init() {
        this.createBackgroundContainer();
        this.loadBackgrounds();
        this.startAutoChange();
        this.bindEvents();
    }
    
    createBackgroundContainer() {
        // 创建背景容器
        const bgContainer = document.createElement('div');
        bgContainer.className = 'dynamic-background';
        bgContainer.id = 'dynamic-background';
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'bg-overlay';
        
        const gradientOverlay = document.createElement('div');
        gradientOverlay.className = 'bg-gradient-overlay';
        
        bgContainer.appendChild(overlay);
        bgContainer.appendChild(gradientOverlay);
        
        // 插入到body开始处
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }
    
    loadBackgrounds() {
        const bgContainer = document.getElementById('dynamic-background');
        
        this.backgrounds.forEach((url, index) => {
            const bgLayer = document.createElement('div');
            bgLayer.className = 'bg-layer';
            bgLayer.style.backgroundImage = `url(${url})`;
            bgLayer.dataset.index = index;
            bgLayer.dataset.url = url;
            
            if (index === 0) {
                bgLayer.classList.add('active');
            }
            
            // 添加图片加载错误处理
            const img = new Image();
            img.onload = () => {
                console.log(`背景图片 ${index + 1} 加载成功: ${url}`);
            };
            img.onerror = () => {
                console.error(`背景图片 ${index + 1} 加载失败: ${url}`);
            };
            img.src = url;
            
            bgContainer.appendChild(bgLayer);
        });
        
        console.log(`总共加载了 ${this.backgrounds.length} 张背景图片`);
    }
    
    changeBackground(direction = 'next') {
        if (this.isTransitioning) {
            console.log('正在过渡中，跳过此次切换');
            return;
        }
        
        this.isTransitioning = true;
        const layers = document.querySelectorAll('.bg-layer');
        
        if (layers.length === 0) {
            console.error('没有找到背景层');
            this.isTransitioning = false;
            return;
        }
        
        const currentLayer = layers[this.currentIndex];
        
        // 计算下一个索引
        const oldIndex = this.currentIndex;
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % layers.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + layers.length) % layers.length;
        }
        
        // 调试信息
        console.log(`🔄 背景切换: ${oldIndex + 1} -> ${this.currentIndex + 1} (总共${layers.length}张)`);
        
        // 特别标记循环边界
        if (direction === 'next' && oldIndex === layers.length - 1) {
            console.log('🎯 从最后一张回到第一张 (循环边界)');
        } else if (direction === 'prev' && oldIndex === 0) {
            console.log('🎯 从第一张回到最后一张 (循环边界)');
        }
        
        console.log(`当前背景URL: ${currentLayer.dataset.url}`);
        
        const nextLayer = layers[this.currentIndex];
        console.log(`下一张背景URL: ${nextLayer.dataset.url}`);
        
        // 获取当前过渡效果
        const effect = this.transitionEffects[this.currentEffect];
        this.currentEffect = (this.currentEffect + 1) % this.transitionEffects.length;
        console.log(`使用过渡效果: ${effect}`);
        
        // 应用过渡效果
        this.applyTransitionEffect(currentLayer, nextLayer, effect);
        
        // 重置过渡状态 - 使用更精确的检测
        setTimeout(() => {
            this.isTransitioning = false;
            console.log('✅ 过渡完成，可以继续切换');
            console.log(`当前背景索引: ${this.currentIndex + 1}/${layers.length}`);
        }, this.transitionDuration + 100); // 额外100ms缓冲
    }
    
    applyTransitionEffect(currentLayer, nextLayer, effect) {
        console.log(`应用过渡效果: ${effect}`);
        
        // 移除所有过渡效果类
        currentLayer.classList.remove('fade-out', 'slide-out', 'zoom-out', 'rotate-out');
        nextLayer.classList.remove('fade-in', 'slide-in', 'zoom-in', 'rotate-in', 'active');
        
        // 确保下一层是可见的
        nextLayer.style.display = 'block';
        nextLayer.style.opacity = '0';
        
        switch (effect) {
            case 'fade':
                this.fadeTransition(currentLayer, nextLayer);
                break;
            case 'slide':
                this.slideTransition(currentLayer, nextLayer);
                break;
            case 'zoom':
                this.zoomTransition(currentLayer, nextLayer);
                break;
            case 'rotate':
                this.rotateTransition(currentLayer, nextLayer);
                break;
            default:
                console.log('使用默认淡入淡出效果');
                this.fadeTransition(currentLayer, nextLayer);
        }
    }
    
    fadeTransition(currentLayer, nextLayer) {
        currentLayer.classList.add('fade-out');
        nextLayer.classList.add('fade-in', 'active');
    }
    
    slideTransition(currentLayer, nextLayer) {
        currentLayer.classList.add('slide-out');
        nextLayer.classList.add('slide-in', 'active');
    }
    
    zoomTransition(currentLayer, nextLayer) {
        currentLayer.classList.add('zoom-out');
        nextLayer.classList.add('zoom-in', 'active');
    }
    
    rotateTransition(currentLayer, nextLayer) {
        currentLayer.classList.add('rotate-out');
        nextLayer.classList.add('rotate-in', 'active');
    }
    
    startAutoChange() {
        console.log('开始自动切换背景，间隔:', this.autoChangeDelay + 'ms');
        this.autoChangeInterval = setInterval(() => {
            console.log('⏰ 自动切换触发，当前索引:', this.currentIndex + 1);
            this.changeBackground('next');
        }, this.autoChangeDelay);
    }
    
    stopAutoChange() {
        if (this.autoChangeInterval) {
            clearInterval(this.autoChangeInterval);
            this.autoChangeInterval = null;
        }
    }
    
    
    bindEvents() {
        // 页面可见性变化时暂停/恢复
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoChange();
            } else {
                this.startAutoChange();
            }
        });
        
        // 窗口失焦时暂停
        window.addEventListener('blur', () => {
            this.stopAutoChange();
        });
        
        window.addEventListener('focus', () => {
            this.startAutoChange();
        });
    }
    
    
    // 添加新的背景图片
    addBackground(url) {
        this.backgrounds.push(url);
        
        const bgContainer = document.getElementById('dynamic-background');
        const bgLayer = document.createElement('div');
        bgLayer.className = 'bg-layer';
        bgLayer.style.backgroundImage = `url(${url})`;
        
        bgContainer.appendChild(bgLayer);
    }
    
    // 设置自动切换间隔
    setAutoChangeDelay(delay) {
        this.autoChangeDelay = delay;
        if (this.autoChangeInterval) {
            this.stopAutoChange();
            this.startAutoChange();
        }
    }
    
    // 获取当前背景信息
    getCurrentBackground() {
        return {
            index: this.currentIndex,
            url: this.backgrounds[this.currentIndex],
            total: this.backgrounds.length
        };
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经存在动态背景
    if (!document.getElementById('dynamic-background')) {
        window.dynamicBackground = new DynamicBackground();
    }
});

// 导出类供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicBackground;
}
