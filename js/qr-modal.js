/**
 * Butterfly QR Code Modal
 * 处理微信和QQ二维码弹窗显示
 */

(function() {
  'use strict'

  // 创建二维码弹窗HTML
  function createQRModal() {
    if (document.getElementById('qr-modal')) {
      return // 已存在，不重复创建
    }

    const modal = document.createElement('div')
    modal.id = 'qr-modal'
    modal.className = 'qr-modal'
    modal.innerHTML = `
      <div class="qr-content">
        <div class="qr-title">
          <i id="qr-icon" class="fab fa-qq"></i>
          <span id="qr-title-text">QQ二维码</span>
        </div>
        <img id="qr-image" class="qr-image" src="" alt="二维码" referrerPolicy="no-referrer" crossorigin="anonymous">
        <div id="qr-description-text" class="qr-description">
          扫描二维码添加我的QQ<br>或者直接搜索QQ号
        </div>
        <button class="qr-close">关闭</button>
      </div>
    `
    document.body.appendChild(modal)
  }

  // 显示二维码弹窗
  function showQRModal(qrImageSrc, type = 'QQ') {
    const modal = document.getElementById('qr-modal')
    const qrImage = document.getElementById('qr-image')
    const qrIcon = document.getElementById('qr-icon')
    const qrTitleText = document.getElementById('qr-title-text')
    const qrDescriptionText = document.getElementById('qr-description-text')

    if (modal && qrImage && qrIcon && qrTitleText && qrDescriptionText) {
      // 设置图片源，使用 no-referrer 绕过 Referer 检查
      qrImage.src = qrImageSrc
      
      // 移除可能存在的 crossorigin 属性，避免 CORS 问题
      qrImage.removeAttribute('crossorigin')
      // 确保设置 referrerPolicy
      qrImage.setAttribute('referrerPolicy', 'no-referrer')

      if (type === 'WeChat') {
        qrIcon.className = 'fab fa-weixin'
        qrTitleText.textContent = '微信二维码'
        qrDescriptionText.innerHTML = '扫描二维码添加我的微信<br>或者直接搜索微信号'
      } else {
        qrIcon.className = 'fab fa-qq'
        qrTitleText.textContent = 'QQ二维码'
        qrDescriptionText.innerHTML = '扫描二维码添加我的QQ<br>或者直接搜索QQ号'
      }

      modal.classList.add('show')
      document.body.style.overflow = 'hidden' // 防止背景滚动
    }
  }

  // 隐藏二维码弹窗
  function hideQRModal() {
    const modal = document.getElementById('qr-modal')
    if (modal) {
      modal.classList.remove('show')
      document.body.style.overflow = '' // 恢复滚动
    }
  }

  // 初始化事件监听
  function initQRModal() {
    // 创建弹窗HTML
    createQRModal()

    // 监听点击事件
    document.addEventListener('click', function(e) {
      const qrTrigger = e.target.closest('.qr-trigger')
      if (qrTrigger) {
        e.preventDefault()
        e.stopPropagation()
        const qrSrc = qrTrigger.getAttribute('data-qr-src')
        const qrType = qrTrigger.getAttribute('data-qr-type') || 'QQ'
        if (qrSrc) {
          showQRModal(qrSrc, qrType)
        }
      }

      // 点击关闭按钮或背景关闭弹窗
      if (e.target.classList.contains('qr-close') || e.target.id === 'qr-modal') {
        hideQRModal()
      }
    })

    // ESC 键关闭弹窗
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        hideQRModal()
      }
    })
  }

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQRModal)
  } else {
    initQRModal()
  }

  // 支持 PJAX
  if (window.pjax) {
    document.addEventListener('pjax:complete', initQRModal)
  }
})()




