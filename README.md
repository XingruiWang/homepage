# xingruiwang.github.io

Personal academic homepage for **Xingrui (Ryan) Wang**, Ph.D. student at Johns Hopkins University.

Live site: [xingruiwang.github.io](https://xingruiwang.github.io)

---

## Structure

```
├── index.html          # Homepage (Bio, News, Publications, Service)
├── experiences.html    # Education, Research & Teaching experience
├── css/
│   └── main.css        # All styles
├── js/
│   └── main.js         # Publication filtering, news toggle
├── images/
│   └── xingrui2.jpg    # Profile photo (add your own)
└── files/
    └── Xingrui-WANG-CV.pdf   # CV (add your own)
```

No build tools, no dependencies — just HTML, CSS, and vanilla JS. Works directly with GitHub Pages.

---

## Deployment

1. Push to a repo named `<your-github-username>.github.io`
2. Go to **Settings → Pages → Source → Deploy from branch → main**
3. Your site will be live at `https://<your-github-username>.github.io`

---

## Customization

### Profile photo
Replace `images/xingrui2.jpg` with your photo, then update `index.html` and `experiences.html`:
```html
<!-- Replace the avatar-placeholder div with: -->
<img class="avatar" src="images/xingrui2.jpg" alt="Xingrui Wang">
```

### Adding a publication
Copy a `.pub` block in `index.html` and update the fields:
```html
<div class="pub" data-tags="spatial multimodal">
  <img class="pub-thumb" src="..." alt="..." onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
  <div class="pub-thumb-placeholder" style="display:none;">🔬</div>
  <div class="pub-body">
    <div><span class="venue-tag vt-blue">CVPR 2026</span></div>
    <div class="pub-title"><a href="...">Paper Title</a></div>
    <div class="pub-tldr">One sentence summary.</div>
    <div class="pub-authors">Author A, <span class="me">Xingrui Wang</span>, Author B</div>
    <div class="pub-links">
      <!-- add .pl links as needed -->
    </div>
  </div>
</div>
```

**Venue tag colors:**
| Class      | Use for                        |
|------------|-------------------------------|
| `vt-blue`  | ICLR, NeurIPS, ICCV, ECCV, WACV |
| `vt-gold`  | CVPR Highlight, Oral           |
| `vt-green` | Workshop, Demo                 |
| `vt-grey`  | Arxiv, Preprint                |

**Filter tags** (`data-tags`): space-separated from `spatial`, `multimodal`, `video`. Add new categories by extending the filter buttons in `index.html` and `main.js`.

### Adding a news item
Add a `<li>` inside `.news-list` in `index.html`. Items with class `news-hidden` are folded by default.

---

## License

MIT
