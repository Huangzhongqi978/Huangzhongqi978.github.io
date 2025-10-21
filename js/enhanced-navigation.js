$(document).ready(() => {
    // 创建回到顶部按钮
    const backToTopButton = $(`
        <div id="enhanced-back-to-top" class="enhanced-back-to-top">
            <i class="fas fa-arrow-up"></i>
        </div>
    `);
    
    // 创建进度条
    const progressBar = $(`
        <div id="reading-progress" class="reading-progress">
            <div class="progress-bar"></div>
        </div>
    `);
    
    // 添加到页面
    $('body').append(backToTopButton);
    $('body').prepend(progressBar);
    
    // 回到顶部功能
    function scrollToTop() {
        if (CSS && CSS.supports && CSS.supports('(scroll-behavior: smooth)')) {
            window.scroll({ top: 0, behavior: 'smooth' });
        } else {
            $('html, body').animate({ scrollTop: 0 }, 600);
        }
    }
    
    // 更新进度条
    function updateProgress() {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        $('.progress-bar').css('width', scrollPercent + '%');
        
        // 根据滚动位置显示/隐藏回到顶部按钮
        if (scrollTop > 300) {
            $('#enhanced-back-to-top').addClass('show');
        } else {
            $('#enhanced-back-to-top').removeClass('show');
        }
    }
    
    // 绑定事件
    $(window).on('scroll', updateProgress);
    $('#enhanced-back-to-top').on('click', scrollToTop);
    
    // 初始化
    updateProgress();
    
    // 响应式处理
    $(window).on('resize', updateProgress);
    
    // 防止与现有功能冲突
    $(document).on('pjax:complete', () => {
        updateProgress();
    });
});

