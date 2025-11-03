// 背景图片检查脚本
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const webBg = document.getElementById('web_bg');
    
    if (!webBg) {
      console.error('❌ #web_bg 元素未找到！');
      return;
    }
    
    console.log('✓ #web_bg 元素已找到');
    
    // 获取计算后的样式
    const computedStyle = window.getComputedStyle(webBg);
    const bgImage = computedStyle.backgroundImage;
    
    console.log('背景图片URL:', bgImage);
    console.log('位置:', computedStyle.position);
    console.log('z-index:', computedStyle.zIndex);
    console.log('宽度:', computedStyle.width);
    console.log('高度:', computedStyle.height);
    console.log('显示:', computedStyle.display);
    console.log('可见性:', computedStyle.visibility);
    console.log('不透明度:', computedStyle.opacity);
    
    // 检查背景图片是否设置
    if (bgImage === 'none' || bgImage === '') {
      console.error('❌ 背景图片未设置！');
      // 尝试从内联样式获取
      const inlineStyle = webBg.getAttribute('style');
      if (inlineStyle && inlineStyle.includes('background-image')) {
        console.log('✓ 内联样式中有背景图片设置:', inlineStyle);
      } else {
        console.error('❌ 内联样式中也未找到背景图片！');
      }
    } else {
      console.log('✓ 背景图片已设置:', bgImage);
      
      // 测试图片是否可以加载
      const urlMatch = bgImage.match(/url\(['"]?(.+?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        const imageUrl = urlMatch[1];
        console.log('正在测试图片加载:', imageUrl);
        
        const img = new Image();
        img.onload = function() {
          console.log('✓ 背景图片加载成功！');
        };
        img.onerror = function() {
          console.error('❌ 背景图片加载失败！URL可能无效或无法访问。');
          console.error('请检查图片URL:', imageUrl);
        };
        img.src = imageUrl;
      }
    }
    
    // 检查是否被其他元素遮挡
    const bodyWrap = document.getElementById('body-wrap');
    if (bodyWrap) {
      const bodyWrapStyle = window.getComputedStyle(bodyWrap);
      const bodyBg = bodyWrapStyle.backgroundColor;
      if (bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') {
        console.warn('⚠️ #body-wrap 有背景色，可能遮挡背景图片:', bodyBg);
      } else {
        console.log('✓ #body-wrap 背景透明');
      }
    }
  });
})();



