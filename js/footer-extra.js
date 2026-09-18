// 底部趣味功能集合

// 随机跳转到一篇文章
function randomPost() {
  fetch('/search.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!Array.isArray(data) || data.length === 0) {
        window.location.href = '/archives/';
        return;
      }
      var posts = data.filter(function (item) {
        return item.url && item.url.indexOf('/tags/') === -1 && item.url.indexOf('/categories/') === -1;
      });
      var target = posts.length > 0 ? posts[Math.floor(Math.random() * posts.length)] : data[0];
      window.location.href = target.url;
    })
    .catch(function () {
      window.location.href = '/archives/';
    });
}

// 随机跳转到一个标签
function randomTag() {
  fetch('/search.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var tagSet = new Set();
      data.forEach(function (item) {
        if (item.tags) item.tags.forEach(function (t) { tagSet.add(t); });
      });
      var tagList = Array.from(tagSet);
      if (tagList.length === 0) {
        window.location.href = '/tags/';
        return;
      }
      var tag = tagList[Math.floor(Math.random() * tagList.length)];
      window.location.href = '/tags/' + encodeURIComponent(tag) + '/';
    })
    .catch(function () {
      window.location.href = '/tags/';
    });
}

// 随机跳转到一个分类
function randomCategory() {
  fetch('/search.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var catSet = new Set();
      data.forEach(function (item) {
        if (item.categories) item.categories.forEach(function (c) { catSet.add(c); });
      });
      var catList = Array.from(catSet);
      if (catList.length === 0) {
        window.location.href = '/categories/';
        return;
      }
      var cat = catList[Math.floor(Math.random() * catList.length)];
      window.location.href = '/categories/' + encodeURIComponent(cat) + '/';
    })
    .catch(function () {
      window.location.href = '/categories/';
    });
}

// 打开必应每日壁纸
function bingWallpaper() {
  window.open('https://bing.ioliu.cn/', '_blank');
}

// 每日一言（调用一言API，弹出展示）
function dailyQuote() {
  fetch('https://v1.hitokoto.cn/')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      showQuote(data.hitokoto, data.from || '网络');
    })
    .catch(function () {
      showQuote('生活不止眼前的苟且，还有诗和远方。', '佚名');
    });
}

// 展示一言的轻量弹窗
function showQuote(text, from) {
  var old = document.getElementById('footer-quote-toast');
  if (old) old.remove();

  var toast = document.createElement('div');
  toast.id = 'footer-quote-toast';
  toast.innerHTML = '<div class="quote-text">' + text + '</div><div class="quote-from">—— ' + from + '</div>';
  toast.onclick = function () { toast.remove(); };
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = '0';
    setTimeout(function () { toast.remove(); }, 400);
  }, 6000);
}
