/**
 * 阅读进度条功能
 * 实时显示页面滚动进度
 */
(function () {
  'use strict';

  // 创建进度条元素
  function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    document.body.appendChild(progressBar);
    return progressBar;
  }

  // 更新进度条
  function updateProgressBar() {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  }

  // 初始化
  function initReadingProgress() {
    // 确保进度条元素存在
    let progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) {
      progressBar = createProgressBar();
    }

    // 监听滚动事件
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateProgressBar();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // 初始更新一次
    updateProgressBar();

    // 监听内容变化（用于动态加载的内容）
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function () {
        updateProgressBar();
      });

      // 观察整个文档的变化
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // 监听窗口大小变化
    window.addEventListener('resize', updateProgressBar, { passive: true });

    // 支持PJAX重新初始化
    if (window.pjax) {
      document.addEventListener('pjax:complete', function () {
        updateProgressBar();
      });
    }
  }

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadingProgress);
  } else {
    initReadingProgress();
  }

  // 如果是Butterfly主题，也监听PJAX事件
  if (typeof utils !== 'undefined' && utils.isPjax()) {
    document.addEventListener('pjax:complete', function () {
      initReadingProgress();
    });
  }
})();




