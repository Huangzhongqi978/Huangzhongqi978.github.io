/**
 * 粒子动画系统
 * 为博客添加美观的粒子背景效果
 */
(function() {
    'use strict';

    class ParticleSystem {
        constructor(options = {}) {
            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.animationId = null;
            this.mouse = { x: 0, y: 0 };
            this.isRunning = false;

            // 默认配置
            this.config = {
                particleCount: 80,
                particleColor: '#1e88e5',
                particleSize: 2,
                lineColor: '#1e88e5',
                lineWidth: 1,
                lineDistance: 120,
                speed: 0.5,
                opacity: 0.6,
                ...options
            };

            this.init();
        }

        init() {
            this.createCanvas();
            this.createParticles();
            this.bindEvents();
            this.start();
        }

        createCanvas() {
            // 创建画布
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'particle-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
                opacity: ${this.config.opacity};
            `;

            // 插入到body中
            document.body.appendChild(this.canvas);

            // 获取上下文
            this.ctx = this.canvas.getContext('2d');

            // 设置画布尺寸
            this.resize();
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.config.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * this.config.speed,
                    vy: (Math.random() - 0.5) * this.config.speed,
                    size: Math.random() * this.config.particleSize + 1
                });
            }
        }

        bindEvents() {
            // 窗口大小改变
            window.addEventListener('resize', () => {
                this.resize();
            });

            // 鼠标移动
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            // 页面可见性变化
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stop();
                } else {
                    this.start();
                }
            });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        drawParticle(particle) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.particleColor;
            this.ctx.fill();
        }

        drawLine(p1, p2, distance) {
            const opacity = 1 - (distance / this.config.lineDistance);
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = this.config.lineColor;
            this.ctx.globalAlpha = opacity * 0.3;
            this.ctx.lineWidth = this.config.lineWidth;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }

        updateParticle(particle) {
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx = -particle.vx;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy = -particle.vy;
            }

            // 确保粒子在画布内
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }

        animate() {
            if (!this.isRunning) return;

            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 更新和绘制粒子
            this.particles.forEach((particle, index) => {
                this.updateParticle(particle);
                this.drawParticle(particle);

                // 绘制连线
                for (let i = index + 1; i < this.particles.length; i++) {
                    const otherParticle = this.particles[i];
                    const distance = Math.sqrt(
                        Math.pow(particle.x - otherParticle.x, 2) +
                        Math.pow(particle.y - otherParticle.y, 2)
                    );

                    if (distance < this.config.lineDistance) {
                        this.drawLine(particle, otherParticle, distance);
                    }
                }

                // 与鼠标连线
                const mouseDistance = Math.sqrt(
                    Math.pow(particle.x - this.mouse.x, 2) +
                    Math.pow(particle.y - this.mouse.y, 2)
                );

                if (mouseDistance < this.config.lineDistance * 1.5) {
                    this.drawLine(particle, this.mouse, mouseDistance);
                }
            });

            this.animationId = requestAnimationFrame(() => this.animate());
        }

        start() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.animate();
            }
        }

        stop() {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        destroy() {
            this.stop();
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }

        // 更新配置
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            if (newConfig.particleCount !== undefined) {
                this.createParticles();
            }
        }
    }

    // 从主题配置中获取粒子设置
    function getParticleConfig() {
        // 尝试从全局配置中获取粒子设置
        const configElement = document.querySelector('script[data-particles-config]');
        let config = {
            particleCount: 80,
            particleColor: '#1e88e5',
            particleSize: 2,
            lineColor: '#1e88e5',
            lineWidth: 1,
            lineDistance: 120,
            speed: 0.5,
            opacity: 0.6,
            mobileOptimized: true,
            interactive: true,
            hoverEffect: true
        };

        if (configElement) {
            try {
                const userConfig = JSON.parse(configElement.textContent);
                config = { ...config, ...userConfig };
            } catch (e) {
                console.warn('粒子配置解析失败，使用默认配置');
            }
        }

        // 移动端优化
        if (config.mobileOptimized && window.innerWidth <= 768) {
            config.particleCount = Math.floor(config.particleCount * 0.6);
            config.opacity = Math.min(config.opacity * 0.7, 0.3);
        }

        return config;
    }

    // 粒子系统配置
    const particleConfig = getParticleConfig();

    // 初始化粒子系统
    let particleSystem = null;

    function initParticles() {
        // 检查是否已经存在粒子系统
        if (document.getElementById('particle-canvas')) {
            return;
        }

        // 检查配置是否启用
        const configElement = document.querySelector('script[data-particles-config]');
        if (!configElement) {
            console.log('粒子效果未启用');
            return;
        }

        // 创建粒子系统
        particleSystem = new ParticleSystem(particleConfig);

        // 添加性能优化
        let lastTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        function optimizedAnimate(currentTime) {
            if (currentTime - lastTime >= frameInterval) {
                if (particleSystem && particleSystem.isRunning) {
                    particleSystem.animate();
                }
                lastTime = currentTime;
            }
            requestAnimationFrame(optimizedAnimate);
        }

        requestAnimationFrame(optimizedAnimate);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }

    // 导出到全局
    window.ParticleSystem = ParticleSystem;
    
    // 延迟导出粒子系统实例
    setTimeout(() => {
        window.particleSystem = particleSystem;
    }, 100);

})();
