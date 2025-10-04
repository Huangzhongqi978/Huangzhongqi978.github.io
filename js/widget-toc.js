/**
 * 侧边栏目录小部件
 */
class WidgetTOC {
    constructor() {
        this.tocWidget = null;
        this.tocContent = null;
        this.headings = [];
        this.activeHeading = null;
        this.observer = null;
        
        this.init();
    }

    init() {
        // 检查是否在文章页面且有目录小部件
        this.tocWidget = document.querySelector('.widget[data-type="toc"]');
        if (!this.tocWidget) return;

        this.tocContent = this.tocWidget.querySelector('#toc-widget-content');
        if (!this.tocContent) return;

        // 生成目录
        this.generateTOC();
        
        // 设置滚动监听
        this.setupScrollSync();
    }

    generateTOC() {
        // 查找文章中的标题
        const article = document.querySelector('article.article');
        if (!article) {
            this.showEmptyState();
            return;
        }

        this.headings = Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        
        if (this.headings.length === 0) {
            this.showEmptyState();
            return;
        }

        // 为标题添加ID（如果没有的话）
        this.headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
        });

        // 生成目录HTML
        const tocHTML = this.createTOCHTML();
        this.tocContent.innerHTML = tocHTML;

        // 绑定点击事件
        this.bindClickEvents();
    }

    createTOCHTML() {
        const stats = `<div class="toc-stats">共 ${this.headings.length} 个标题</div>`;
        
        const tocItems = this.headings.map(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent.trim();
            const id = heading.id;
            
            return `
                <li class="toc-widget-item" data-level="${level}">
                    <a href="#${id}" class="toc-widget-link" data-target="${id}">
                        ${text}
                    </a>
                </li>
            `;
        }).join('');

        return `
            ${stats}
            <ul class="toc-widget-list">
                ${tocItems}
            </ul>
        `;
    }

    bindClickEvents() {
        const links = this.tocContent.querySelectorAll('.toc-widget-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 平滑滚动到目标位置
                    const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // 更新活跃状态
                    this.updateActiveLink(link);
                }
            });
        });
    }

    setupScrollSync() {
        // 使用 Intersection Observer 监听标题可见性
        const options = {
            root: null,
            rootMargin: '-80px 0px -50% 0px', // 考虑导航栏高度
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            let visibleHeading = null;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleHeading = entry.target;
                }
            });

            if (visibleHeading && visibleHeading !== this.activeHeading) {
                this.activeHeading = visibleHeading;
                const targetLink = this.tocContent.querySelector(`[data-target="${visibleHeading.id}"]`);
                if (targetLink) {
                    this.updateActiveLink(targetLink);
                }
            }
        }, options);

        // 观察所有标题
        this.headings.forEach(heading => {
            this.observer.observe(heading);
        });

        // 备用滚动监听（防止 Intersection Observer 不工作）
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateActiveByScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateActiveByScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let activeHeading = null;

        // 找到当前最接近的标题
        for (let i = this.headings.length - 1; i >= 0; i--) {
            const heading = this.headings[i];
            const headingTop = heading.offsetTop - 100; // 提前一点激活

            if (scrollTop >= headingTop) {
                activeHeading = heading;
                break;
            }
        }

        if (activeHeading && activeHeading !== this.activeHeading) {
            this.activeHeading = activeHeading;
            const targetLink = this.tocContent.querySelector(`[data-target="${activeHeading.id}"]`);
            if (targetLink) {
                this.updateActiveLink(targetLink);
            }
        }
    }

    updateActiveLink(activeLink) {
        // 移除所有活跃状态
        const allLinks = this.tocContent.querySelectorAll('.toc-widget-link');
        allLinks.forEach(link => link.classList.remove('active'));

        // 添加活跃状态
        activeLink.classList.add('active');

        // 确保活跃项在可视区域内
        this.scrollToActiveLink(activeLink);
    }

    scrollToActiveLink(activeLink) {
        const container = this.tocContent;
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // 检查是否需要滚动
        if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
            const scrollTop = container.scrollTop;
            const linkOffsetTop = activeLink.offsetTop;
            const containerHeight = container.clientHeight;
            const linkHeight = activeLink.offsetHeight;

            // 计算目标滚动位置（将活跃项居中显示）
            const targetScrollTop = linkOffsetTop - (containerHeight / 2) + (linkHeight / 2);

            container.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
        }
    }

    showEmptyState() {
        this.tocContent.innerHTML = `
            <div class="toc-empty">
                <i class="fas fa-info-circle"></i>
                <div>此文章没有标题</div>
            </div>
        `;
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        this.headings = [];
        this.activeHeading = null;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new WidgetTOC();
});

// 导出类供其他脚本使用
window.WidgetTOC = WidgetTOC;




