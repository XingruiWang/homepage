/* ============================================================
   Xingrui Wang — Academic Homepage
   main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- News toggle ---- */
  const showMoreBtn = document.querySelector('.show-more');
  const hiddenNews = document.querySelectorAll('.news-hidden');
  if (showMoreBtn) {
    let expanded = false;
    showMoreBtn.addEventListener('click', function () {
      expanded = !expanded;
      hiddenNews.forEach(li => {
        li.style.display = expanded ? 'grid' : 'none';
      });
      this.textContent = expanded ? 'Show less ↑' : 'Show older news ↓';
    });
  }

});
