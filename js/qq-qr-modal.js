// 二维码弹窗功能 (支持QQ和微信)
(function() {
    'use strict';
    
    // 创建二维码弹窗HTML
    function createQRModal() {
        const modalHTML = `
            <div id="qr-modal" class="qr-modal">
                <div class="qr-content">
                    <div class="qr-title">
                        <i id="qr-icon" class="fab fa-qq"></i>
                        <span id="qr-title-text">QQ二维码</span>
                    </div>
                    <img id="qr-image" class="qr-image" src="" alt="二维码">
                    <div class="qr-description">
                        <span id="qr-description-text">扫描二维码添加我的QQ<br>或者直接搜索QQ号</span>
                    </div>
                    <button id="qr-close" class="qr-close">关闭</button>
                </div>
            </div>
        `;
        
        // 如果弹窗不存在，则创建
        if (!document.getElementById('qr-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }
    
    // 显示二维码弹窗
    function showQRModal(qrImageSrc, type = 'QQ') {
        const modal = document.getElementById('qr-modal');
        const qrImage = document.getElementById('qr-image');
        const qrIcon = document.getElementById('qr-icon');
        const qrTitleText = document.getElementById('qr-title-text');
        const qrDescriptionText = document.getElementById('qr-description-text');
        
        if (modal && qrImage && qrIcon && qrTitleText && qrDescriptionText) {
            qrImage.src = qrImageSrc;
            
            if (type === 'WeChat') {
                qrIcon.className = 'fab fa-weixin';
                qrTitleText.textContent = '微信二维码';
                qrDescriptionText.innerHTML = '扫描二维码添加我的微信<br>或者直接搜索微信号';
            } else {
                qrIcon.className = 'fab fa-qq';
                qrTitleText.textContent = 'QQ二维码';
                qrDescriptionText.innerHTML = '扫描二维码添加我的QQ<br>或者直接搜索QQ号';
            }
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
    }
    
    // 隐藏二维码弹窗
    function hideQRModal() {
        const modal = document.getElementById('qr-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // 恢复滚动
        }
    }
    
    // 初始化事件监听
    function initQRModal() {
        // 创建弹窗HTML
        createQRModal();
        
        // 监听二维码链接点击事件
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.qr-trigger');
            if (target) {
                e.preventDefault();
                const qrSrc = target.getAttribute('data-qr-src');
                const qrType = target.getAttribute('data-qr-type') || 'QQ';
                if (qrSrc) {
                    showQRModal(qrSrc, qrType);
                }
            }
        });
        
        // 监听关闭按钮点击和背景点击
        document.addEventListener('click', function(e) {
            if (e.target.id === 'qr-close' || e.target.id === 'qr-modal') {
                hideQRModal();
            }
        });
        
        // 监听ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideQRModal();
            }
        });
        
        // 监听弹窗内容点击，防止冒泡关闭
        document.addEventListener('click', function(e) {
            const modalContent = document.querySelector('.qr-content');
            if (modalContent && modalContent.contains(e.target)) {
                e.stopPropagation();
            }
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initQRModal);
    } else {
        initQRModal();
    }
    
    // 如果页面已经加载完成，立即初始化
    if (document.readyState === 'complete') {
        initQRModal();
    }
    
})();
