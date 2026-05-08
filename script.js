/* ============================================================
   PARITYRX — script.js
   Reads data.json and builds the entire page dynamically.
   To update content, edit data.json only. Never touch this
   file unless you are changing how something is built.
   ============================================================ */


/* ── HELPERS ── */

// Format a number as currency: 30000 -> "$30,000"
function formatMoney(num) {
  return '$' + num.toLocaleString('en-US');
}

// Calculate savings between two numbers
function calcSavings(brand, biosimilar) {
  return brand - biosimilar;
}

// Create a DOM element with optional class and inner HTML
function el(tag, className, html) {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (html) elem.innerHTML = html;
  return elem;
}


/* ── BUILD FUNCTIONS ── */
// Each function below builds one section of the page from data

function buildNav(data) {
  document.querySelector('.nav-logo').innerHTML =
    data.site.name.replace('Rx', '<span>Rx</span>');
}

function buildHero(data) {
  const h = data.hero;
  document.querySelector('.hero-kicker').textContent = h.kicker;
  document.querySelector('.hero-headline').innerHTML =
    `${h.headline_line1}<br>${h.headline_line2}<br><em>${h.headline_em}</em>`;
  document.querySelector('.hero-sub').textContent = h.subtext;
  document.querySelector('.hero-cta').textContent = h.cta;

  // Stats: first drug in drug list drives the hero numbers
  const first = data.drugs.items[0];
  const savings = calcSavings(first.brand_cost, first.biosimilar_cost);
  const statsEl = document.querySelector('.hero-stats');
  statsEl.innerHTML = `
    <div class="hero-stat">
      <div class="hero-stat-num hi">${formatMoney(first.brand_cost)}</div>
      <div class="hero-stat-label">${first.brand.split('(')[0].trim()} list price per member / year</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-num lo">${formatMoney(first.biosimilar_cost)}</div>
      <div class="hero-stat-label">FDA biosimilar cost per member / year</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-num">${formatMoney(savings)}</div>
      <div class="hero-stat-label">Potential savings per person</div>
    </div>
  `;
}

function buildSkinStrip(data) {
  document.querySelector('.skin-strip strong').textContent = data.skin_strip;
}

function buildLawAlert(data) {
  const l = data.law_alert;
  document.querySelector('.law-tag').textContent = l.tag;
  document.querySelector('.law-headline').textContent = l.headline;
  document.querySelector('.law-body-1').textContent = l.body_1;
  document.querySelector('.law-body-2').textContent = l.body_2;
}

function buildProblem(data) {
  const p = data.problem;
  document.querySelector('#problem .section-label').textContent = p.label;
  document.querySelector('#problem .section-title').textContent = p.headline;
  document.querySelector('#problem .section-sub').textContent = p.subtext;

  const grid = document.querySelector('.problem-grid');
  grid.innerHTML = p.cards.map(card => `
    <div class="prob-card fi">
      <div class="prob-num">${card.num}</div>
      <h3>${card.title}</h3>
      <p>${card.body}</p>
    </div>
  `).join('');
}

function buildServices(data) {
  const s = data.services;
  document.querySelector('#services .section-label').textContent = s.label;
  document.querySelector('#services .section-title').textContent = s.headline;
  document.querySelector('#services .section-sub').textContent = s.subtext;

  const grid = document.querySelector('.services-grid');
  grid.innerHTML = s.cards.map(card => `
    <div class="svc-card fi">
      <div class="svc-badge badge-${card.badge_type}">${card.badge}</div>
      <h3>${card.title}</h3>
      <p>${card.body}</p>
    </div>
  `).join('');
}

function buildDrugs(data) {
  const d = data.drugs;
  document.querySelector('#drugs .section-label').textContent = d.label;
  document.querySelector('#drugs .section-title').textContent = d.headline;
  document.querySelector('#drugs .section-sub').textContent = d.subtext;
  document.querySelector('.table-note').textContent = d.footnote;

  const tbody = document.querySelector('.drug-table tbody');
  tbody.innerHTML = d.items.map(drug => {
    const savings = calcSavings(drug.brand_cost, drug.biosimilar_cost);
    const isInterchangeable = drug.status === 'Interchangeable';
    const statusClass = isInterchangeable ? 'pill pill-green' : 'pill pill-muted';
    return `
      <tr>
        <td>${drug.brand}</td>
        <td class="price-hi">${formatMoney(drug.brand_cost)}</td>
        <td>${drug.biosimilar}</td>
        <td class="price-lo">${formatMoney(drug.biosimilar_cost)}</td>
        <td><span class="pill pill-green">Save ${formatMoney(savings)}</span></td>
        <td><span class="${statusClass}">${drug.status}</span></td>
      </tr>
    `;
  }).join('');
}

function buildProcess(data) {
  const p = data.process;
  document.querySelector('#process .section-label').textContent = p.label;
  document.querySelector('#process .section-title').textContent = p.headline;
  document.querySelector('#process .section-sub').textContent = p.subtext;

  const grid = document.querySelector('.process-grid');
  grid.innerHTML = p.steps.map(step => `
    <div class="proc-card fi">
      <div class="proc-num">${step.num}</div>
      ${step.free ? '<div class="proc-free">Free / No commitment</div>' : ''}
      <h3>${step.title}</h3>
      <p>${step.body}</p>
    </div>
  `).join('');
}

function buildSkinFull(data) {
  const s = data.skin_full;
  document.querySelector('.skin-full h2').textContent = s.headline;
  document.querySelector('.skin-full p').textContent = s.body;
}

function buildContact(data) {
  const c = data.contact;
  const site = data.site;

  document.querySelector('#contact .section-label').textContent = c.label;
  document.querySelector('#contact .section-title').textContent = c.headline;
  document.querySelector('#contact .section-sub').textContent = c.subtext;
  document.querySelector('.contact-email').textContent = site.email;
  document.querySelector('.contact-email').href = `mailto:${site.email}`;
  document.querySelector('.contact-location').textContent = site.location;
  document.querySelector('.contact-serving').textContent = c.serving;

  // Set formspree action
  document.querySelector('.contact-form').action =
    `https://formspree.io/f/${site.formspree_id}`;
}

function buildFooter(data) {
  document.querySelector('.foot-logo').innerHTML =
    data.site.name.replace('Rx', '<span>Rx</span>');
}


/* ── SCROLL ANIMATIONS ── */
// Watches for elements with class "fi" and adds "visible" when they enter the viewport
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  // Observe all fi elements — including ones built dynamically
  document.querySelectorAll('.fi').forEach(el => observer.observe(el));
}

// Re-run after dynamic content is built since new fi elements get added
function observeNewElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fi:not(.visible)').forEach(el => observer.observe(el));
}


/* ── MAIN ── */
// Fetch data.json then build every section in order
fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load data.json');
    return response.json();
  })
  .then(data => {
    // Build every section
    buildNav(data);
    buildHero(data);
    buildSkinStrip(data);
    buildLawAlert(data);
    buildProblem(data);
    buildServices(data);
    buildDrugs(data);
    buildProcess(data);
    buildSkinFull(data);
    buildContact(data);
    buildFooter(data);

    // Set page title and meta description
    document.title = `${data.site.name} — ${data.site.tagline}`;
    document.querySelector('meta[name="description"]').content = data.site.tagline;

    // Start scroll animations after everything is built
    observeNewElements();
  })
  .catch(err => {
    console.error('ParityRx data load error:', err);
  });


/* ── INITIAL SCROLL OBSERVER ── */
// Runs immediately for any fi elements already in the HTML skeleton
document.addEventListener('DOMContentLoaded', initScrollAnimations);
