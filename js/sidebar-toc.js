/**
 * 侧边弹出式目录功能
 * 点击目录按钮从右侧弹出目录面板
 */
class SidebarTOC {
    constructor() {
        this.isOpen = false;
        this.tocData = [];
        this.currentActiveId = null;
        this.init();
    }

    init() {
        // 检查是否在文章页面
        if (!this.isArticlePage()) {
            return;
        }

        console.log('初始化侧边目录功能...');
        
        // 收集标题数据
        this.collectHeadings();
        
        if (this.tocData.length === 0) {
            console.log('未找到标题，跳过目录功能');
            return;
        }

        // 创建侧边栏（不创建目录按钮）
        this.createSidebar();
        this.setupEventListeners();
        this.setupScrollTracking();
        
        console.log('侧边目录功能初始化完成');
    }

    isArticlePage() {
        // 检查是否在文章页面
        return document.querySelector('.article .content') !== null;
    }

    collectHeadings() {
        const content = document.querySelector('.article .content');
        if (!content) return;

        const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        this.tocData = [];

        headings.forEach((heading, index) => {
            // 为没有ID的标题生成ID
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent.trim();
            
            this.tocData.push({
                id: heading.id,
                text: text,
                level: level,
                element: heading
            });
        });

        console.log(`收集到 ${this.tocData.length} 个标题`);
    }

    createTOCButton() {
        // 创建浮动的目录按钮
        const button = document.createElement('div');
        button.className = 'toc-toggle-btn';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
            </svg>
            <span class="toc-count">${this.tocData.length}</span>
        `;
        button.title = '打开目录';
        
        document.body.appendChild(button);
        this.tocButton = button;
    }

    createSidebar() {
        // 创建侧边栏容器
        const sidebar = document.createElement('div');
        sidebar.className = 'toc-sidebar';
        
        // 创建头部
        const header = document.createElement('div');
        header.className = 'toc-sidebar-header';
        header.innerHTML = `
            <h3>文章目录</h3>
            <button class="toc-close-btn" title="关闭目录">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;

        // 创建目录列表
        const tocList = document.createElement('div');
        tocList.className = 'toc-sidebar-list';
        
        this.tocData.forEach(item => {
            const tocItem = document.createElement('div');
            tocItem.className = `toc-item toc-level-${item.level}`;
            tocItem.innerHTML = `
                <a href="#${item.id}" data-id="${item.id}">
                    ${item.text}
                </a>
            `;
            tocList.appendChild(tocItem);
        });

        sidebar.appendChild(header);
        sidebar.appendChild(tocList);
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'toc-overlay';
        
        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);
        
        this.sidebar = sidebar;
        this.overlay = overlay;
        this.tocList = tocList;
    }

    setupEventListeners() {
        // 关闭按钮
        const closeBtn = this.sidebar.querySelector('.toc-close-btn');
        closeBtn.addEventListener('click', () => {
            this.closeSidebar();
        });

        // 遮罩层点击关闭
        this.overlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // 目录项点击
        const tocLinks = this.sidebar.querySelectorAll('.toc-item a');
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-id');
                this.scrollToHeading(targetId);
                this.closeSidebar();
            });
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });
    }

    setupScrollTracking() {
        // 设置滚动监听，高亮当前章节
        const observer = new IntersectionObserver((entries) => {
            let visibleEntries = entries.filter(entry => entry.isIntersecting);
            
            if (visibleEntries.length > 0) {
                // 找到最靠近顶部的可见标题
                let topEntry = visibleEntries.reduce((top, entry) => {
                    return entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top;
                });
                
                const id = topEntry.target.id;
                this.setActiveItem(id);
            }
        }, {
            rootMargin: '-10% 0px -80% 0px',
            threshold: [0, 0.1, 0.5, 1]
        });

        this.tocData.forEach(item => {
            observer.observe(item.element);
        });
        
        this.observer = observer;
    }

    setActiveItem(id) {
        if (this.currentActiveId === id) return;
        
        // 移除之前的激活状态
        const prevActive = this.sidebar.querySelector('.toc-item.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }

        // 设置新的激活状态
        const newActive = this.sidebar.querySelector(`[data-id="${id}"]`);
        if (newActive) {
            newActive.parentElement.classList.add('active');
            this.currentActiveId = id;
            
            // 滚动到可见区域（在目录列表容器内滚动）
            if (this.isOpen && this.tocList) {
                const tocListRect = this.tocList.getBoundingClientRect();
                const activeRect = newActive.getBoundingClientRect();
                
                // 检查是否需要滚动
                if (activeRect.top < tocListRect.top || activeRect.bottom > tocListRect.bottom) {
                    const scrollTop = this.tocList.scrollTop;
                    const targetScrollTop = scrollTop + (activeRect.top - tocListRect.top) - (tocListRect.height / 2) + (activeRect.height / 2);
                    
                    this.tocList.scrollTo({
                        top: targetScrollTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }

    scrollToHeading(id) {
        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // 更新URL
            if (history.pushState) {
                history.pushState(null, null, `#${id}`);
            }
        }
    }

    openSidebar() {
        this.isOpen = true;
        document.body.classList.add('toc-sidebar-open');
        this.sidebar.classList.add('open');
        this.overlay.classList.add('show');
        
        // 不禁止页面滚动，让侧边栏跟随页面滚动
        this.updateSidebarPosition();
        this.setupScrollListener();
    }

    closeSidebar() {
        this.isOpen = false;
        document.body.classList.remove('toc-sidebar-open');
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('show');
        
        // 移除滚动监听
        this.removeScrollListener();
    }

    updateSidebarPosition() {
        // 根据当前滚动位置调整侧边栏位置
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.sidebar.style.top = scrollTop + 'px';
    }

    setupScrollListener() {
        this.scrollHandler = () => {
            if (this.isOpen) {
                this.updateSidebarPosition();
                // 备用的滚动跟踪机制
                this.updateActiveItemByScroll();
            }
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
            
            if (scrollTop >= elementTop - 100) { // 100px 的偏移量
                activeId = item.id;
                break;
            }
        }
        
        if (activeId && activeId !== this.currentActiveId) {
            this.setActiveItem(activeId);
        }
    }

    removeScrollListener() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
    }

    destroy() {
        // 清理资源
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.removeScrollListener();
    }
}

// 页面加载完成后初始化
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.sidebarTOC = new SidebarTOC();
    });
}
