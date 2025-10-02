/**
 * 右侧固定目录功能
 * 在文章右侧显示目录，跟随页面滚动，高亮当前阅读位置
 */

class RightSideTOC {
    constructor() {
        this.tocContainer = null;
        this.tocList = null;
        this.tocData = [];
        this.currentActiveId = null;
        this.observer = null;
        this.scrollHandler = null;
        this.isSticky = false;
        this.originalTop = 0;
        
        this.init();
    }

    init() {
        // 检查是否在文章页面且屏幕足够宽
        if (!this.shouldShowTOC()) {
            return;
        }

        this.createTOCStructure();
        this.collectHeadings();
        
        if (this.tocData.length > 0) {
            this.renderTOC();
            this.setupScrollTracking();
            this.setupStickyBehavior();
        } else {
            this.showEmptyState();
        }
    }

    shouldShowTOC() {
        // 禁用右侧目录，改用侧边栏目录
        return false;
        
        // 检查是否在文章页面
        const article = document.querySelector('article.article');
        if (!article) return false;

        // 检查屏幕宽度（降低最小宽度要求）
        if (window.innerWidth < 1200) return false;

        return true;
    }

    createTOCStructure() {
        // 找到文章容器
        const articleCard = document.querySelector('.card');
        if (!articleCard) return;

        // 为文章添加类名
        articleCard.classList.add('article-with-toc');

        // 创建右侧目录容器
        this.tocContainer = document.createElement('div');
        this.tocContainer.className = 'right-side-toc';
        this.tocContainer.innerHTML = `
            <div class="right-toc-header">
                <h4>
                    <i class="fas fa-list-ul toc-icon"></i>
                    目录
                    <span class="toc-count">0</span>
                </h4>
            </div>
            <div class="right-toc-list">
                <div class="right-toc-loading">正在加载目录...</div>
            </div>
        `;

        // 插入到文章容器中
        articleCard.appendChild(this.tocContainer);
        this.tocList = this.tocContainer.querySelector('.right-toc-list');

        // 记录初始位置
        this.originalTop = this.tocContainer.getBoundingClientRect().top + window.pageYOffset;
    }

    collectHeadings() {
        // 收集文章中的标题
        const article = document.querySelector('article.article .content');
        if (!article) return;

        const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
        this.tocData = [];

        headings.forEach((heading, index) => {
            // 确保标题有ID
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent.trim();

            if (text) {
                this.tocData.push({
                    id: heading.id,
                    text: text,
                    level: level,
                    element: heading
                });
            }
        });
    }

    renderTOC() {
        if (this.tocData.length === 0) {
            this.showEmptyState();
            return;
        }

        // 更新目录数量
        const countElement = this.tocContainer.querySelector('.toc-count');
        if (countElement) {
            countElement.textContent = this.tocData.length;
        }

        // 生成目录HTML
        const tocHTML = this.tocData.map(item => {
            return `
                <div class="right-toc-item right-toc-level-${item.level}" data-id="${item.id}">
                    <a href="#${item.id}" title="${item.text}">
                        ${item.text}
                    </a>
                </div>
            `;
        }).join('');

        this.tocList.innerHTML = tocHTML;

        // 绑定点击事件
        this.tocList.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (link) {
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToHeading(targetId);
            }
        });
    }

    showEmptyState() {
        this.tocList.innerHTML = '<div class="right-toc-empty">此文章暂无目录</div>';
    }

    scrollToHeading(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setupScrollTracking() {
        // 使用 Intersection Observer 跟踪标题
        const options = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                if (entry.isIntersecting) {
                    this.setActiveItem(id);
                }
            });
        }, options);

        // 观察所有标题
        this.tocData.forEach(item => {
            this.observer.observe(item.element);
        });

        // 备用滚动监听
        this.setupScrollListener();
    }

    setupScrollListener() {
        this.scrollHandler = () => {
            this.updateStickyBehavior();
            this.updateActiveItemByScroll();
        };
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    updateActiveItemByScroll() {
        // 备用方法：通过滚动位置计算当前活跃的标题
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let activeId = null;
        
        for (let i = this.tocData.length - 1; i >= 0; i--) {
            const item = this.tocData[i];
            const rect = item.element.getBoundingClientRect();
            const elementTop = scrollTop + rect.top;
            
            if (scrollTop >= elementTop - 100) {
                activeId = item.id;
                break;
            }
        }
        
        if (activeId && activeId !== this.currentActiveId) {
            this.setActiveItem(activeId);
        }
    }

    setActiveItem(activeId) {
        if (this.currentActiveId === activeId) return;

        // 移除之前的活跃状态
        const prevActive = this.tocList.querySelector('.right-toc-item.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }

        // 设置新的活跃状态
        const newActive = this.tocList.querySelector(`[data-id="${activeId}"]`);
        if (newActive) {
            newActive.classList.add('active');
            this.currentActiveId = activeId;

            // 滚动到可见区域
            this.scrollActiveItemIntoView(newActive);
        }
    }

    scrollActiveItemIntoView(activeItem) {
        const listRect = this.tocList.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        // 检查是否需要滚动
        if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
            const scrollTop = this.tocList.scrollTop;
            const itemOffsetTop = activeItem.offsetTop;
            const listHeight = this.tocList.clientHeight;
            const itemHeight = activeItem.clientHeight;

            // 计算目标滚动位置（将活跃项居中显示）
            const targetScrollTop = itemOffsetTop - (listHeight / 2) + (itemHeight / 2);

            this.tocList.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
        }
    }

    setupStickyBehavior() {
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            if (!this.shouldShowTOC()) {
                this.destroy();
            } else if (!this.tocContainer) {
                // 如果窗口变大了，重新初始化
                this.init();
            }
        });
    }

    updateStickyBehavior() {
        if (!this.tocContainer) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeSticky = scrollTop > this.originalTop - 20;

        if (shouldBeSticky && !this.isSticky) {
            this.tocContainer.classList.add('sticky');
            this.isSticky = true;
        } else if (!shouldBeSticky && this.isSticky) {
            this.tocContainer.classList.remove('sticky');
            this.isSticky = false;
        }
    }

    destroy() {
        // 清理资源
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }

        if (this.tocContainer) {
            this.tocContainer.remove();
            this.tocContainer = null;
        }

        // 移除文章类名
        const articleCard = document.querySelector('.article-with-toc');
        if (articleCard) {
            articleCard.classList.remove('article-with-toc');
        }
    }
}

// 页面加载完成后初始化
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // 延迟初始化，确保页面完全加载
        setTimeout(() => {
            new RightSideTOC();
        }, 100);
    });

    // 支持 PJAX
    if (typeof window.addEventListener === 'function') {
        window.addEventListener('pjax:complete', () => {
            setTimeout(() => {
                new RightSideTOC();
            }, 100);
        });
    }
}
