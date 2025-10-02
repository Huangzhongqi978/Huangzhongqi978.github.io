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
        this.autoChangeDelay = 5000; // 5秒自动切换，给过渡更多时间
        this.transitionDuration = 1800; // 1.8秒过渡时间，与CSS动画同步
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
        
        // 简化过渡状态管理，避免重复触发
        let transitionCompleted = false;
        
        const resetTransition = () => {
            if (transitionCompleted) return; // 防止重复执行
            transitionCompleted = true;
            
            this.isTransitioning = false;
            console.log('✅ 过渡完成，可以继续切换');
            console.log(`当前背景索引: ${this.currentIndex + 1}/${layers.length}`);
            
            // 清理过渡效果类
            setTimeout(() => {
                const allLayers = document.querySelectorAll('.bg-layer');
                allLayers.forEach(layer => {
                    if (layer !== nextLayer) {
                        layer.classList.remove('fade-out', 'slide-out', 'zoom-out', 'rotate-out');
                        layer.classList.remove('fade-in', 'slide-in', 'zoom-in', 'rotate-in');
                    }
                });
            }, 100);
        };
        
        // 使用更可靠的超时机制，不依赖动画事件
        setTimeout(() => {
            resetTransition();
        }, this.transitionDuration + 100); // 减少缓冲时间
    }
    
    applyTransitionEffect(currentLayer, nextLayer, effect) {
        console.log(`应用过渡效果: ${effect}`);
        
        // 移除所有过渡效果类
        const allLayers = document.querySelectorAll('.bg-layer');
        allLayers.forEach(layer => {
            layer.classList.remove('fade-out', 'slide-out', 'zoom-out', 'rotate-out');
            layer.classList.remove('fade-in', 'slide-in', 'zoom-in', 'rotate-in');
            if (layer !== nextLayer) {
                layer.classList.remove('active');
            }
        });
        
        // 确保下一层是可见的
        nextLayer.style.display = 'block';
        nextLayer.style.opacity = '0';
        
        // 强制重绘以确保类被正确移除
        nextLayer.offsetHeight;
        
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
        // 防止重复启动定时器
        if (this.autoChangeInterval) {
            console.log('⚠️ 定时器已存在，先清除旧定时器');
            this.stopAutoChange();
        }
        
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
            console.log('✅ 定时器已清除');
        }
    }
    
    
    bindEvents() {
        // 防止重复绑定事件
        if (this.eventsbound) return;
        this.eventsbound = true;
        
        // 页面可见性变化时暂停/恢复
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📱 页面隐藏，暂停背景切换');
                this.stopAutoChange();
            } else {
                console.log('📱 页面显示，恢复背景切换');
                // 延迟恢复，避免快速切换
                setTimeout(() => {
                    this.startAutoChange();
                }, 500);
            }
        });
        
        // 窗口失焦时暂停（减少频率，避免过度触发）
        let blurTimeout;
        window.addEventListener('blur', () => {
            blurTimeout = setTimeout(() => {
                console.log('🔍 窗口失焦，暂停背景切换');
                this.stopAutoChange();
            }, 1000); // 1秒后才暂停
        });
        
        window.addEventListener('focus', () => {
            if (blurTimeout) {
                clearTimeout(blurTimeout);
                blurTimeout = null;
            }
            console.log('🔍 窗口聚焦，恢复背景切换');
            // 延迟恢复，避免快速切换
            setTimeout(() => {
                this.startAutoChange();
            }, 500);
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
