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
        img.onerror = function(e) {
          console.error('❌ 背景图片加载失败！');
          console.error('图片URL:', imageUrl);
          
          // 检查是否是 SSL 证书错误
          if (imageUrl.startsWith('https://')) {
            console.warn('⚠️ 检测到 HTTPS 协议，可能是 SSL 证书问题');
            console.warn('可能的原因：');
            console.warn('  1. SSL 证书域名不匹配（ERR_CERT_COMMON_NAME_INVALID）');
            console.warn('  2. 证书已过期或无效');
            console.warn('  3. 自签名证书未正确配置');
            console.warn('');
            console.warn('💡 解决方案：');
            console.warn('  1. 检查并修复 SSL 证书配置');
            console.warn('  2. 临时方案：在配置文件中将 https:// 改为 http://');
            console.warn('  3. 使用其他图床服务（如 GitHub、Gitee、七牛云等）');
            console.warn('  4. 联系服务器管理员修复证书问题');
          } else {
            console.error('可能的原因：');
            console.error('  1. URL 无效或图片不存在');
            console.error('  2. 服务器无法访问');
            console.error('  3. CORS 跨域问题');
          }
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




