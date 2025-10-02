/**
 * 文章目录功能
 * 支持自动生成目录、阅读进度跟踪、平滑滚动
 */

class ArticleTOC {
    constructor() {
        this.tocContainer = null;
        this.tocList = null;
        this.headings = [];
        this.activeHeading = null;
        this.isVisible = false;
        this.scrollOffset = 100; // 滚动偏移量
        this.isScrolling = false; // 防止滚动冲突
        
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTOC());
        } else {
            this.setupTOC();
        }
    }

    setupTOC() {
        // 检查是否在文章页面（非首页）
        const articleContent = document.querySelector('.article .content');
        const tocToggle = document.getElementById('article-toc-toggle');
        
        if (!articleContent || !tocToggle) {
            return;
        }

        // 创建目录容器
        this.createTOCContainer();
        
        // 生成目录
        this.generateTOC();
        
        // 设置滚动监听
        this.setupScrollListener();
        
        // 设置点击事件
        this.setupClickEvents();
        
        // 初始隐藏目录
        this.hideTOC();
    }

    createTOCContainer() {
        // 创建目录容器
        this.tocContainer = document.createElement('div');
        this.tocContainer.id = 'article-toc';
        this.tocContainer.className = 'article-toc';
        
        // 创建目录头部
        const tocHeader = document.createElement('div');
        tocHeader.className = 'toc-header';
        tocHeader.innerHTML = `
            <h3>目录</h3>
            <button class="toc-close" title="关闭目录">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // 创建目录列表容器
        this.tocList = document.createElement('div');
        this.tocList.className = 'toc-list';
        
        this.tocContainer.appendChild(tocHeader);
        this.tocContainer.appendChild(this.tocList);
        
        // 插入到页面中
        document.body.appendChild(this.tocContainer);
    }

    generateTOC() {
        // 获取所有标题
        this.headings = Array.from(document.querySelectorAll('.article .content h1, .article .content h2, .article .content h3, .article .content h4, .article .content h5, .article .content h6'));
        
        if (this.headings.length === 0) {
            this.tocContainer.style.display = 'none';
            return;
        }

        // 为每个标题添加ID
        this.headings.forEach((heading, index) => {
            if (!heading.id) {
                // 生成基于标题文本的ID
                const text = heading.textContent.trim().toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                heading.id = text || `heading-${index}`;
            }
        });

        // 生成目录HTML
        const tocHTML = this.buildTOCHTML(this.headings);
        this.tocList.innerHTML = tocHTML;
    }

    buildTOCHTML(headings) {
        let html = '<ul class="toc-items">';
        let currentLevel = 0;
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent.trim();
            const id = heading.id;
            
            if (level > currentLevel) {
                // 增加嵌套层级
                for (let i = currentLevel; i < level; i++) {
                    html += '<ul class="toc-items">';
                }
            } else if (level < currentLevel) {
                // 减少嵌套层级
                for (let i = currentLevel; i > level; i--) {
                    html += '</ul>';
                }
            }
            
            html += `
                <li class="toc-item toc-level-${level}">
                    <a href="#${id}" class="toc-link" data-target="${id}">
                        <span class="toc-text">${text}</span>
                    </a>
                </li>
            `;
            
            currentLevel = level;
        });
        
        // 关闭所有未关闭的ul标签
        for (let i = currentLevel; i > 0; i--) {
            html += '</ul>';
        }
        
        html += '</ul>';
        return html;
    }

    setupScrollListener() {
        let ticking = false;
        
        const updateActiveHeading = () => {
            if (this.isScrolling) {
                ticking = false;
                return;
            }
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 找到当前可见的标题
            let currentHeading = null;
            
            for (let i = this.headings.length - 1; i >= 0; i--) {
                const heading = this.headings[i];
                const rect = heading.getBoundingClientRect();
                
                if (rect.top <= this.scrollOffset) {
                    currentHeading = heading;
                    break;
                }
            }
            
            // 更新活动状态
            if (currentHeading && currentHeading !== this.activeHeading) {
                this.setActiveHeading(currentHeading.id);
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveHeading);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    setActiveHeading(headingId) {
        // 移除之前的活动状态
        if (this.activeHeading) {
            const prevLink = this.tocContainer.querySelector(`a[data-target="${this.activeHeading}"]`);
            if (prevLink) {
                prevLink.classList.remove('active');
            }
        }
        
        // 设置新的活动状态
        this.activeHeading = headingId;
        const activeLink = this.tocContainer.querySelector(`a[data-target="${headingId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // 滚动到可见区域
            this.scrollToActiveItem(activeLink);
        }
    }

    scrollToActiveItem(activeLink) {
        const tocList = this.tocList;
        const linkRect = activeLink.getBoundingClientRect();
        const listRect = tocList.getBoundingClientRect();
        
        if (linkRect.top < listRect.top || linkRect.bottom > listRect.bottom) {
            activeLink.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    setupClickEvents() {
        // 目录链接点击事件
        this.tocList.addEventListener('click', (e) => {
            const link = e.target.closest('.toc-link');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                this.scrollToHeading(targetId);
            }
        });
        
        // 关闭按钮
        const closeBtn = this.tocContainer.querySelector('.toc-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideTOC();
            });
        }
        
        // 目录切换按钮（在文章标题旁边）
        const tocToggle = document.getElementById('article-toc-toggle');
        if (tocToggle) {
            tocToggle.addEventListener('click', () => {
                this.toggleTOC();
                // 更新按钮状态
                tocToggle.classList.toggle('active', this.isVisible);
                // 更新按钮文字
                const actionText = tocToggle.querySelector('.action-text');
                if (actionText) {
                    actionText.textContent = this.isVisible ? '隐藏' : '目录';
                }
            });
        }
        
        // 点击遮罩层关闭目录
        this.tocContainer.addEventListener('click', (e) => {
            if (e.target === this.tocContainer) {
                this.hideTOC();
            }
        });
    }

    scrollToHeading(headingId) {
        const heading = document.getElementById(headingId);
        if (heading) {
            this.isScrolling = true;
            
            const rect = heading.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = scrollTop + rect.top - this.scrollOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // 延迟重置滚动标志
            setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        }
    }

    toggleTOC() {
        if (this.isVisible) {
            this.hideTOC();
        } else {
            this.showTOC();
        }
    }

    showTOC() {
        this.tocContainer.style.display = 'block';
        this.isVisible = true;
        
        // 添加显示动画
        requestAnimationFrame(() => {
            this.tocContainer.classList.add('show');
        });
    }

    hideTOC() {
        this.tocContainer.classList.remove('show');
        this.isVisible = false;
        
        // 更新按钮状态
        const tocToggle = document.getElementById('article-toc-toggle');
        if (tocToggle) {
            tocToggle.classList.remove('active');
            const actionText = tocToggle.querySelector('.action-text');
            if (actionText) {
                actionText.textContent = '目录';
            }
        }
        
        // 延迟隐藏
        setTimeout(() => {
            if (!this.isVisible) {
                this.tocContainer.style.display = 'none';
            }
        }, 300);
    }
}

// 初始化文章目录
new ArticleTOC();