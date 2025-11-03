/**
 * 鼠标轨迹彩色线条效果
 * 在鼠标移动时创建彩色线条踪迹
 */
(function() {
  'use strict';
  
  // 从页面配置或使用默认配置
  const pageConfig = window.mouseTrailConfig || {};
  const config = {
    enabled: pageConfig.enable !== undefined ? pageConfig.enable : true,
    lineWidth: pageConfig.lineWidth || 2,
    trailLength: pageConfig.trailLength || 20,
    colors: pageConfig.colors || [
      '#ff6b6b', // 红色
      '#4ecdc4', // 青色
      '#45b7d1', // 蓝色
      '#96ceb4', // 绿色
      '#ffeaa7', // 黄色
      '#dda0dd', // 紫色
      '#ff7675', // 粉红
      '#74b9ff'  // 亮蓝
    ],
    mobile: pageConfig.mobile !== undefined ? pageConfig.mobile : false // 移动端是否启用
  };

  // 检查是否应该在移动端禁用
  if (config.mobile === false) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      return;
    }
  }

  if (!config.enabled) return;

  let canvas;
  let ctx;
  let points = [];
  let animationId;
  let mouseX = 0;
  let mouseY = 0;
  let lastX = 0;
  let lastY = 0;

  // 初始化
  function init() {
    // 创建 canvas 元素
    canvas = document.createElement('canvas');
    canvas.id = 'mouse-trail-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.8;
    `;
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);

    // 监听鼠标移动
    document.addEventListener('mousemove', onMouseMove);

    // 开始动画循环
    animate();
  }

  // 调整 canvas 大小
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 鼠标移动事件
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 添加新的轨迹点
    const point = {
      x: mouseX,
      y: mouseY,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      life: 1.0,
      vx: (mouseX - lastX) * 0.1,
      vy: (mouseY - lastY) * 0.1
    };

    points.push(point);

    // 限制轨迹点数量
    if (points.length > config.trailLength) {
      points.shift();
    }

    lastX = mouseX;
    lastY = mouseY;
  }

  // 动画循环
  function animate() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制轨迹点
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      
      // 更新生命值和位置
      point.life -= 0.02;
      
      // 如果点已消失，移除它
      if (point.life <= 0) {
        points.splice(i, 1);
        i--;
        continue;
      }

      // 计算不透明度
      const opacity = point.life;
      
      // 如果有下一个点，绘制线条
      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        
        // 创建渐变
        const gradient = ctx.createLinearGradient(
          point.x, point.y,
          nextPoint.x, nextPoint.y
        );
        gradient.addColorStop(0, point.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, nextPoint.color + Math.floor(nextPoint.life * opacity * 255).toString(16).padStart(2, '0'));
        
        // 绘制线条
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = config.lineWidth * opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
      }

      // 绘制轨迹点
      ctx.beginPath();
      ctx.fillStyle = point.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
      ctx.arc(point.x, point.y, config.lineWidth * 1.5 * opacity, 0, Math.PI * 2);
      ctx.fill();
    }

    animationId = requestAnimationFrame(animate);
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
