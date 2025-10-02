/**
 * 全屏阅读功能
 * 支持全屏模式、阅读设置、字体调整等
 */

class FullscreenReading {
    constructor() {
        this.isFullscreen = false;
        this.originalContent = null;
        this.fullscreenContainer = null;
        this.readingSettings = {
            fontSize: 16,
            lineHeight: 1.6,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            maxWidth: 800,
            theme: 'light'
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFullscreen());
        } else {
            this.setupFullscreen();
        }
    }

    setupFullscreen() {
        // 检查是否在文章页面（非首页）
        const articleContent = document.querySelector('.article .content');
        const fullscreenBtn = document.getElementById('fullscreen-reading-btn');
        
        if (!articleContent || !fullscreenBtn) {
            return;
        }

        this.createFullscreenContainer();
        this.setupEventListeners();
        this.loadSettings();
    }

    isArticlePage() {
        return document.querySelector('.article') !== null;
    }


    createFullscreenContainer() {
        // 创建全屏容器
        this.fullscreenContainer = document.createElement('div');
        this.fullscreenContainer.id = 'fullscreen-reading-container';
        this.fullscreenContainer.className = 'fullscreen-reading-container';
        
        // 创建全屏头部
        const header = document.createElement('div');
        header.className = 'fullscreen-header';
        header.innerHTML = `
            <div class="fullscreen-controls">
                <button class="control-btn" id="font-decrease" title="减小字体">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="font-size-display">${this.readingSettings.fontSize}px</span>
                <button class="control-btn" id="font-increase" title="增大字体">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="control-btn" id="line-height-toggle" title="调整行距">
                    <i class="fas fa-arrows-alt-v"></i>
                </button>
                <button class="control-btn" id="width-toggle" title="调整宽度">
                    <i class="fas fa-arrows-alt-h"></i>
                </button>
                <button class="control-btn" id="theme-toggle-fullscreen" title="切换主题">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
            <div class="fullscreen-actions">
                <button class="control-btn" id="print-article" title="打印文章">
                    <i class="fas fa-print"></i>
                </button>
                <button class="control-btn" id="exit-fullscreen" title="退出全屏">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // 创建内容区域
        const content = document.createElement('div');
        content.className = 'fullscreen-content';
        content.id = 'fullscreen-content';

        this.fullscreenContainer.appendChild(header);
        this.fullscreenContainer.appendChild(content);
        
        // 添加到页面
        document.body.appendChild(this.fullscreenContainer);
    }

    setupEventListeners() {
        // 全屏按钮
        const fullscreenBtn = document.getElementById('fullscreen-reading-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.enterFullscreen();
                // 更新按钮状态
                fullscreenBtn.classList.add('active');
                const actionText = fullscreenBtn.querySelector('.action-text');
                if (actionText) {
                    actionText.textContent = '退出';
                }
            });
        }

        // 退出全屏
        const exitBtn = document.getElementById('exit-fullscreen');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exitFullscreen());
        }

        // 字体大小控制
        const fontDecrease = document.getElementById('font-decrease');
        const fontIncrease = document.getElementById('font-increase');
        if (fontDecrease) {
            fontDecrease.addEventListener('click', () => this.adjustFontSize(-2));
        }
        if (fontIncrease) {
            fontIncrease.addEventListener('click', () => this.adjustFontSize(2));
        }

        // 行距调整
        const lineHeightToggle = document.getElementById('line-height-toggle');
        if (lineHeightToggle) {
            lineHeightToggle.addEventListener('click', () => this.toggleLineHeight());
        }

        // 宽度调整
        const widthToggle = document.getElementById('width-toggle');
        if (widthToggle) {
            widthToggle.addEventListener('click', () => this.toggleWidth());
        }

        // 主题切换
        const themeToggle = document.getElementById('theme-toggle-fullscreen');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 打印功能
        const printBtn = document.getElementById('print-article');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printArticle());
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (this.isFullscreen) {
                this.handleKeyboard(e);
            }
        });

        // ESC键退出全屏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.exitFullscreen();
            }
        });
    }

    enterFullscreen() {
        const article = document.querySelector('.article');
        if (!article) return;

        // 保存原始内容
        this.originalContent = article.cloneNode(true);
        
        // 复制内容到全屏容器
        const fullscreenContent = document.getElementById('fullscreen-content');
        fullscreenContent.innerHTML = article.innerHTML;
        
        // 完全复制主题的代码块处理逻辑
        this.processCodeBlocks();
        
        // 显示全屏容器
        this.fullscreenContainer.style.display = 'flex';
        this.isFullscreen = true;
        
        // 应用当前设置
        this.applySettings();
        
        // 添加全屏类
        document.body.classList.add('fullscreen-reading-active');
        
        // 隐藏原始文章
        article.style.display = 'none';
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }

    exitFullscreen() {
        // 隐藏全屏容器
        this.fullscreenContainer.style.display = 'none';
        this.isFullscreen = false;
        
        // 移除全屏类
        document.body.classList.remove('fullscreen-reading-active');
        
        // 显示原始文章
        const article = document.querySelector('.article');
        if (article) {
            article.style.display = 'block';
        }
        
        // 更新按钮状态
        const fullscreenBtn = document.getElementById('fullscreen-reading-btn');
        if (fullscreenBtn) {
            fullscreenBtn.classList.remove('active');
            const actionText = fullscreenBtn.querySelector('.action-text');
            if (actionText) {
                actionText.textContent = '全屏';
            }
        }
        
        // 保存设置
        this.saveSettings();
    }

    adjustFontSize(delta) {
        this.readingSettings.fontSize = Math.max(12, Math.min(24, this.readingSettings.fontSize + delta));
        this.applySettings();
        this.updateFontSizeDisplay();
    }

    toggleLineHeight() {
        const heights = [1.4, 1.6, 1.8, 2.0];
        const currentIndex = heights.indexOf(this.readingSettings.lineHeight);
        const nextIndex = (currentIndex + 1) % heights.length;
        this.readingSettings.lineHeight = heights[nextIndex];
        this.applySettings();
    }

    toggleWidth() {
        const widths = [600, 800, 1000, 1200];
        const currentIndex = widths.indexOf(this.readingSettings.maxWidth);
        const nextIndex = (currentIndex + 1) % widths.length;
        this.readingSettings.maxWidth = widths[nextIndex];
        this.applySettings();
    }

    toggleTheme() {
        this.readingSettings.theme = this.readingSettings.theme === 'light' ? 'dark' : 'light';
        this.applySettings();
        this.updateThemeIcon();
    }

    applySettings() {
        const content = document.getElementById('fullscreen-content');
        if (!content) return;

        // 应用字体设置
        content.style.fontSize = `${this.readingSettings.fontSize}px`;
        content.style.lineHeight = this.readingSettings.lineHeight;
        content.style.fontFamily = this.readingSettings.fontFamily;
        content.style.maxWidth = `${this.readingSettings.maxWidth}px`;
        
        // 应用主题
        content.className = `fullscreen-content theme-${this.readingSettings.theme}`;
    }

    updateFontSizeDisplay() {
        const display = document.querySelector('.font-size-display');
        if (display) {
            display.textContent = `${this.readingSettings.fontSize}px`;
        }
    }

    updateThemeIcon() {
        const icon = document.querySelector('#theme-toggle-fullscreen i');
        if (icon) {
            icon.className = this.readingSettings.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    printArticle() {
        const content = document.getElementById('fullscreen-content');
        if (!content) return;

        // 创建打印窗口
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>打印文章</title>
                    <style>
                        body { 
                            font-family: ${this.readingSettings.fontFamily};
                            font-size: ${this.readingSettings.fontSize}px;
                            line-height: ${this.readingSettings.lineHeight};
                            max-width: ${this.readingSettings.maxWidth}px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        @media print {
                            body { margin: 0; padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    ${content.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    handleKeyboard(e) {
        switch(e.key) {
            case '+':
            case '=':
                e.preventDefault();
                this.adjustFontSize(2);
                break;
            case '-':
                e.preventDefault();
                this.adjustFontSize(-2);
                break;
            case 't':
            case 'T':
                e.preventDefault();
                this.toggleTheme();
                break;
            case 'w':
            case 'W':
                e.preventDefault();
                this.toggleWidth();
                break;
            case 'l':
            case 'L':
                e.preventDefault();
                this.toggleLineHeight();
                break;
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('fullscreen-reading-settings');
        if (saved) {
            this.readingSettings = { ...this.readingSettings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('fullscreen-reading-settings', JSON.stringify(this.readingSettings));
    }

    processCodeBlocks() {
        // 完全复制主题main.js中的代码块处理逻辑
        const $ = (selector) => {
            if (selector.startsWith('#fullscreen-content')) {
                return document.querySelectorAll(selector);
            }
            return document.querySelectorAll('#fullscreen-content ' + selector);
        };
        
        // 1. 首先包装table为highlight-body（关键步骤！）
        const tables = document.querySelectorAll('#fullscreen-content figure.highlight table');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('highlight-body')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'highlight-body';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
        
        // 2. 添加hljs类
        const figures = document.querySelectorAll('#fullscreen-content figure.highlight');
        figures.forEach(figure => {
            figure.classList.add('hljs');
        });
        
        // 3. 处理代码高亮类
        const spans = document.querySelectorAll('#fullscreen-content figure.highlight .code .line span');
        spans.forEach(span => {
            if (span.className) {
                const classes = span.className.split(/\s+/);
                classes.forEach(cls => {
                    if (cls && !cls.startsWith('hljs-')) {
                        span.classList.add('hljs-' + cls);
                        span.classList.remove(cls);
                    }
                });
            }
        });
        
        // 4. 确保行号显示 - 兼容Prism.js和Highlight.js
        // 处理新的Prism.js结构
        const preElements = document.querySelectorAll('#fullscreen-content pre.line-numbers');
        preElements.forEach(pre => {
            const code = pre.querySelector('code');
            
            if (code && !pre.querySelector('.line-numbers-rows')) {
                // 计算代码行数
                const codeText = code.textContent || code.innerText;
                const lines = codeText.split('\n');
                // 移除最后的空行（如果存在）
                const actualLines = lines[lines.length - 1].trim() === '' ? lines.slice(0, -1) : lines;
                const lineCount = actualLines.length;
                
                if (lineCount > 0) {
                    // 创建Prism.js行号容器
                    let lineNumbersHtml = '<span aria-hidden="true" class="line-numbers-rows">';
                    for (let i = 0; i < lineCount; i++) {
                        lineNumbersHtml += '<span></span>';
                    }
                    lineNumbersHtml += '</span>';
                    
                    // 添加到code元素内部
                    code.insertAdjacentHTML('beforeend', lineNumbersHtml);
                }
            }
        });
        
        // 处理旧的figure.highlight结构（向后兼容）
        figures.forEach(figure => {
            // 检查是否已有行号（Prism.js或Highlight.js）
            if (!figure.querySelector('.gutter') && !figure.classList.contains('line-numbers')) {
                const code = figure.querySelector('.code');
                if (code) {
                    const codeText = code.textContent || code.innerText;
                    const lines = codeText.split('\n').filter(line => line.trim() !== '');
                    
                    if (lines.length > 0) {
                        // 创建行号容器
                        let gutterHtml = '<div class="gutter">';
                        for (let i = 1; i <= lines.length; i++) {
                            gutterHtml += `<span class="line-number">${i}</span>\n`;
                        }
                        gutterHtml += '</div>';
                        code.insertAdjacentHTML('beforebegin', gutterHtml);
                        
                        // 添加Prism.js兼容类
                        figure.classList.add('line-numbers');
                    }
                }
            }
        });
        
        // 5. 处理figcaption结构
        figures.forEach(figure => {
            let figcaption = figure.querySelector('figcaption');
            if (figcaption) {
                figcaption.classList.add('level', 'is-mobile');
                if (!figcaption.querySelector('.level-left')) {
                    figcaption.innerHTML = `
                        <div class="level-left">${figcaption.innerHTML}</div>
                        <div class="level-right"></div>
                    `;
                }
            } else {
                // 创建新的figcaption
                figcaption = document.createElement('figcaption');
                figcaption.className = 'level is-mobile';
                figcaption.innerHTML = `
                    <div class="level-left"></div>
                    <div class="level-right"></div>
                `;
                figure.insertBefore(figcaption, figure.firstChild);
            }
        });
        
        // 6. 添加复制按钮
        figures.forEach(figure => {
            const levelRight = figure.querySelector('figcaption .level-right');
            if (levelRight && !levelRight.querySelector('.copy')) {
                const id = 'code-' + Date.now() + (Math.random() * 1000 | 0);
                const button = document.createElement('a');
                button.href = 'javascript:;';
                button.className = 'copy';
                button.title = 'Copy';
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.setAttribute('data-clipboard-target', '#' + id + ' .code');
                figure.setAttribute('id', id);
                levelRight.appendChild(button);
            }
        });
        
        // 7. 添加折叠功能
        figures.forEach(figure => {
            figure.classList.add('foldable');
            
            const levelLeft = figure.querySelector('figcaption .level-left');
            if (levelLeft && !levelLeft.querySelector('.fold')) {
                const foldButton = document.createElement('span');
                foldButton.className = 'fold';
                foldButton.innerHTML = '<i class="fas fa-angle-down"></i>';
                levelLeft.insertBefore(foldButton, levelLeft.firstChild);
            }
            
            // 默认展开状态
            this.toggleFold(figure, false);
        });
        
        // 8. 添加事件监听器
        const levelLefts = document.querySelectorAll('#fullscreen-content figure.highlight figcaption .level-left');
        levelLefts.forEach(levelLeft => {
            levelLeft.addEventListener('click', (e) => {
                e.preventDefault();
                const figure = levelLeft.closest('figure.highlight');
                const isFolded = figure.classList.contains('folded');
                this.toggleFold(figure, !isFolded);
            });
        });
        
        // 9. 添加复制功能
        const copyButtons = document.querySelectorAll('#fullscreen-content figure.highlight .copy');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const figure = button.closest('figure.highlight');
                this.copyCode(figure);
            });
        });
    }
    
    toggleFold(figure, shouldFold) {
        const toggle = figure.querySelector('.fold i');
        const highlightBody = figure.querySelector('.highlight-body');
        
        if (shouldFold) {
            figure.classList.add('folded');
            if (toggle) {
                toggle.classList.remove('fa-angle-down');
                toggle.classList.add('fa-angle-right');
            }
            if (highlightBody) {
                highlightBody.style.height = '0';
                highlightBody.style.overflow = 'hidden';
            }
        } else {
            figure.classList.remove('folded');
            if (toggle) {
                toggle.classList.remove('fa-angle-right');
                toggle.classList.add('fa-angle-down');
            }
            if (highlightBody) {
                highlightBody.style.height = '';
                highlightBody.style.overflow = '';
            }
        }
    }

    copyCode(block) {
        const code = block.querySelector('.code');
        if (code) {
            const text = code.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const copyBtn = block.querySelector('.copy');
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                }, 1000);
            });
        }
    }
}

// 初始化全屏阅读功能
new FullscreenReading();
