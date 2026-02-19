/**
 * Publication loader — reads XML data from data/publications/
 * and renders cards into #pub-container using the <template id="pub-template">.
 */

const LINK_ICONS = {
  paper: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  project: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  data: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  slides: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>`,
  poster: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
};

function txt(el, tag) {
  const node = el.querySelector(tag);
  return node ? node.textContent.trim() : '';
}

function buildAuthorHTML(authorsEl) {
  if (!authorsEl) return '';
  const parts = [];
  for (const a of authorsEl.querySelectorAll('author')) {
    const name = txt(a, 'name');
    const url = txt(a, 'url');
    const isMe = a.getAttribute('me') === 'true';
    if (isMe) {
      parts.push(`<span class="me">${name}</span>`);
    } else if (url) {
      parts.push(`<a href="${url}" target="_blank">${name}</a>`);
    } else {
      parts.push(name);
    }
  }
  return parts.join(', ');
}

function buildLinksHTML(linksEl) {
  if (!linksEl) return '';
  const parts = [];
  for (const l of linksEl.querySelectorAll('link')) {
    const type = l.getAttribute('type') || 'paper';
    const href = l.getAttribute('href');
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    const icon = LINK_ICONS[type] || LINK_ICONS.paper;
    parts.push(`<a class="pl" href="${href}" target="_blank">${icon}${label}</a>`);
  }
  return parts.join('\n');
}

function buildVenueLabel(pub) {
  const venue = txt(pub, 'venue');
  const highlight = txt(pub, 'highlight');
  return highlight ? `${venue} · ${highlight}` : venue;
}

function renderPub(pubDoc) {
  const pub = pubDoc.querySelector('publication');
  if (!pub) return null;

  const template = document.getElementById('pub-template');
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector('.pub');

  const topics = [];
  for (const t of pub.querySelectorAll('topics > topic')) {
    topics.push(t.textContent.trim());
  }
  card.setAttribute('data-tags', topics.join(' '));

  const imgSrc = txt(pub, 'img');
  const alt = txt(pub, 'alt') || txt(pub, 'title');
  const thumbImg = card.querySelector('.pub-thumb');
  const thumbPlaceholder = card.querySelector('.pub-thumb-placeholder');

  if (imgSrc) {
    thumbImg.src = imgSrc;
    thumbImg.alt = alt;
    thumbPlaceholder.style.display = 'none';
  } else {
    thumbImg.style.display = 'none';
    thumbPlaceholder.style.display = 'flex';
    thumbPlaceholder.textContent = alt.charAt(0);
  }

  const venueClass = txt(pub, 'venue-class') || 'blue';
  const venueTag = card.querySelector('.venue-tag');
  venueTag.className = `venue-tag vt-${venueClass}`;
  venueTag.textContent = buildVenueLabel(pub);

  const titleLink = card.querySelector('.pub-title a');
  titleLink.href = txt(pub, ':scope > link') || '#';
  titleLink.textContent = txt(pub, 'title');

  card.querySelector('.pub-tldr').textContent = txt(pub, 'tldr');
  card.querySelector('.pub-authors').innerHTML = buildAuthorHTML(pub.querySelector('authors'));
  card.querySelector('.pub-links').innerHTML = buildLinksHTML(pub.querySelector('links'));

  return clone;
}

async function loadPublications() {
  const container = document.getElementById('pub-container');
  if (!container) return;

  try {
    const indexResp = await fetch('data/publications/_index.xml');
    const indexText = await indexResp.text();
    const indexDoc = new DOMParser().parseFromString(indexText, 'application/xml');

    const topicLabels = {};
    for (const t of indexDoc.querySelectorAll('topic-labels > topic')) {
      topicLabels[t.getAttribute('key')] = t.getAttribute('label');
    }

    const entries = indexDoc.querySelectorAll('entries > entry');
    const fetches = Array.from(entries).map(entry => {
      const file = entry.getAttribute('file');
      return fetch(`data/publications/${file}`).then(r => r.text());
    });

    const xmlTexts = await Promise.all(fetches);
    const topicCounts = {};

    for (const xmlText of xmlTexts) {
      const pubDoc = new DOMParser().parseFromString(xmlText, 'application/xml');
      const card = renderPub(pubDoc);
      if (card) container.appendChild(card);

      const pub = pubDoc.querySelector('publication');
      if (pub) {
        for (const t of pub.querySelectorAll('topics > topic')) {
          const key = t.textContent.trim();
          topicCounts[key] = (topicCounts[key] || 0) + 1;
        }
      }
    }

    buildFilterButtons(topicCounts, topicLabels);
    initFilters();
  } catch (err) {
    console.error('Failed to load publications:', err);
  }
}

function buildFilterButtons(topicCounts, topicLabels) {
  const filtersEl = document.getElementById('pub-filters');
  if (!filtersEl) return;

  const sorted = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  const allBtn = document.createElement('button');
  allBtn.className = 'fbtn active';
  allBtn.dataset.filter = 'all';
  allBtn.textContent = 'All';
  filtersEl.appendChild(allBtn);

  for (const [key, count] of sorted) {
    const btn = document.createElement('button');
    btn.className = 'fbtn';
    btn.dataset.filter = key;
    btn.textContent = topicLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    filtersEl.appendChild(btn);
  }
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.fbtn');
  const pubs = document.querySelectorAll('.pub[data-tags]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tag = this.dataset.filter;
      pubs.forEach(pub => {
        const tags = pub.dataset.tags || '';
        if (tag === 'all' || tags.includes(tag)) {
          pub.removeAttribute('data-hidden');
        } else {
          pub.setAttribute('data-hidden', 'true');
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', loadPublications);
