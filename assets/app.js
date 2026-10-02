/* The Associates — renders every page from the files in /content.
   To change wording, photos, team members, offices etc., edit the content files (or use the editor) — not this file. */
(function () {
  'use strict';

  var page = document.body.getAttribute('data-page');
  var NAV = [
    { href: 'what-we-do.html', label: 'What We Do', key: 'services' },
    { href: 'who-we-are.html', label: 'Who We Are', key: 'about' },
    { href: 'our-clients.html', label: 'Clients & Cases', key: 'clients' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Blank line = new paragraph, single line break = <br>
  function paras(s) {
    return String(s || '').trim().split(/\n\s*\n/).filter(Boolean).map(function (p) {
      return '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }
  function lines(s) { return esc(String(s || '').trim()).replace(/\n/g, '<br>'); }
  function list(a) { return Array.isArray(a) ? a.filter(function (x) { return x !== '' && x != null; }) : []; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function initials(name) {
    return String(name || '').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
  }
  function tel(p) { return 'tel:' + String(p).replace(/[^\d+]/g, ''); }
  function get(name) {
    return fetch('content/' + name + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(name);
      return r.json();
    });
  }

  function header(s) {
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.key === page ? ' class="active"' : '') + '>' + n.label + '</a>';
    }).join('');
    return '<header class="site-header" id="top"><div class="wrap">' +
      '<a class="brand" href="index.html" aria-label="' + esc(s.firm_name) + ' home"><img src="' + esc(s.logo_light) + '" alt="' + esc(s.firm_name) + '"></a>' +
      '<nav class="nav" aria-label="Main">' + links + '<a class="btn" href="work-with-us.html">Work With Us</a></nav>' +
      '<button class="menu-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div></header>';
  }

  function footer(s) {
    var offices = list(s.offices).map(function (o) {
      return '<li><strong style="color:#fff">' + esc(o.city) + '</strong><br>' + lines(o.address) + '</li>' +
        list(o.phones).map(function (p) { return '<li><a href="' + tel(p) + '">' + esc(p) + '</a></li>'; }).join('');
    }).join('');
    var social = s.linkedin ? '<li><a href="' + esc(s.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a></li>' : '';
    return '<footer class="site-footer"><div class="wrap"><div class="cols">' +
      '<div><img src="' + esc(s.logo_light) + '" alt="' + esc(s.firm_name) + '"><p>' + esc(s.footer_note) + '</p></div>' +
      '<div><h4>Contact</h4><ul>' + offices + '<li><a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></li>' + social + '</ul></div>' +
      '<div><h4>Explore</h4><ul>' + NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + '</a></li>'; }).join('') +
      '<li><a href="work-with-us.html">Work With Us</a></li><li><a href="privacy.html">Privacy Policy</a></li><li><a href="disclaimer.html">Legal Disclaimer</a></li></ul></div>' +
      '</div><div class="bottom"><span>© ' + new Date().getFullYear() + ' ' + esc(s.firm_name) + '. All rights reserved.</span><a href="#top">Back to top ↑</a></div></div></footer>';
  }

  function pageHero(title, eyebrow) {
    return '<section class="page-hero"><div class="wrap">' + (eyebrow ? '<div class="eyebrow">' + esc(eyebrow) + '</div>' : '') +
      '<h1>' + esc(title) + '</h1><div class="rule"></div></div></section>';
  }

  function footprint(s) {
    var c = list(s.countries);
    if (!c.length) return '';
    return '<section class="footprint"><div class="wrap reveal"><div class="eyebrow">Where we work</div>' +
      '<h2 class="section-title">' + esc(s.footprint_title) + '</h2><p class="lead">' + esc(s.footprint_intro) + '</p>' +
      '<ul class="chips">' + c.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      (s.footprint_tagline ? '<p class="tagline">' + esc(s.footprint_tagline) + '</p>' : '') + '</div></section>';
  }

  function cta(heading, button) {
    return '<section class="cta"><div class="wrap reveal"><h2>' + esc(heading || 'Working with us is different. Find out why.') + '</h2>' +
      '<a class="btn ghost" href="work-with-us.html">' + esc(button || 'Work With Us') + '</a></div></section>';
  }

  var PAGES = {
    home: function (s, h) {
      var bg = h.hero_image ? ' has-image" style="background-image:url(\'' + esc(h.hero_image) + '\')' : '';
      var teasers = list(h.teasers).map(function (t, i) {
        var words = esc(t.title).split(' ');
        var label = words.length > 1 ? words.slice(0, -1).join(' ') + '<br><span>' + words[words.length - 1] + '</span>' : '<span>' + words[0] + '</span>';
        return '<div class="teaser reveal"><div class="teaser-label"><div class="label">' + label + '</div></div>' +
          '<div><h2>' + esc(t.heading) + '</h2>' + paras(t.text) +
          (t.link ? '<a class="link-arrow" href="' + esc(t.link) + '">' + esc(t.link_label || 'Learn more') + '</a>' : '') + '</div></div>';
      }).join('');
      return '<section class="hero' + bg + '"><div class="wrap">' +
        '<div class="eyebrow">' + esc(h.eyebrow) + '</div><h1>' + esc(h.headline) + '</h1><div class="rule"></div>' +
        '<p class="tagline">' + esc(h.tagline) + '</p>' +
        '<a class="btn" href="#more">' + esc(h.button_label || 'See How') + '</a></div></section>' +
        '<section id="more" style="padding:30px 0"><div class="wrap">' + teasers + '</div></section>' +
        footprint(s) + cta(h.cta_heading, h.cta_button);
    },

    services: function (s, d) {
      var groups = list(d.groups).map(function (g, i) {
        return '<div class="group reveal"><h3><span class="num">' + pad(i + 1) + '</span>' + esc(g.name) + '</h3><ul>' +
          list(g.items).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
      }).join('');
      return pageHero(d.title) +
        '<section><div class="wrap reveal"><div class="lead">' + paras(d.intro) + '</div></div></section>' +
        '<section class="mist"><div class="wrap"><div class="eyebrow">Practice areas</div><h2 class="section-title">' + esc(d.services_heading) + '</h2>' +
        '<div class="groups">' + groups + '</div></div></section>' +
        '<section><div class="wrap reveal"><div class="eyebrow">Our clients</div><h2 class="section-title">' + esc(d.partners_heading) + '</h2>' +
        '<div class="lead">' + paras(d.partners_text) + '</div><a class="link-arrow" href="our-clients.html">Industries we serve</a></div></section>' +
        cta();
    },

    about: function (s, d) {
      var team = list(d.team).map(function (m) {
        var head = m.photo
          ? '<div class="portrait"><img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy"></div>' +
            '<div class="top"><div><h3>' + esc(m.name) + '</h3><div class="role">' + esc(m.title) + '</div></div></div>'
          : '<div class="top"><div class="avatar">' + esc(initials(m.name)) + '</div>' +
            '<div><h3>' + esc(m.name) + '</h3><div class="role">' + esc(m.title) + '</div></div></div>';
        return '<article class="member reveal' + (m.photo ? ' has-photo' : '') + '">' + head +
          '<ul>' + list(m.bio).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
          (m.linkedin ? '<a class="li-link" href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">LinkedIn →</a>' : '') +
          '</article>';
      }).join('');
      return pageHero(d.title) +
        '<section><div class="wrap reveal"><div class="lead">' + paras(d.story) + '</div></div></section>' +
        '<section class="mist"><div class="wrap reveal" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:40px 80px;align-items:start">' +
        '<h2 class="section-title">' + esc(d.difference_heading) + '</h2><div>' + paras(d.difference) + '</div></div></section>' +
        '<section><div class="wrap"><div class="eyebrow">The people</div><h2 class="section-title">' + esc(d.team_heading) + '</h2>' +
        '<p class="muted" style="max-width:680px">' + esc(d.team_intro) + '</p><div class="team">' + team + '</div></div></section>' +
        footprint(s) + cta();
    },

    clients: function (s, d) {
      var sectors = list(d.sectors).map(function (x, i) {
        return '<div class="sector"><span class="num">' + pad(i + 1) + '</span><span>' + esc(x) + '</span></div>';
      }).join('');
      var quotes = list(d.testimonials).filter(function (q) { return q && q.quote; }).map(function (q) {
        return '<figure class="quote reveal"><blockquote>“' + esc(q.quote) + '”</blockquote><figcaption class="who">' +
          (q.logo ? '<img src="' + esc(q.logo) + '" alt="' + esc(q.company) + '">' : '') +
          '<div><strong>' + esc(q.name) + '</strong><span>' + esc([q.role, q.company].filter(Boolean).join(', ')) + '</span></div></figcaption></figure>';
      }).join('');
      var cases = list(d.cases).filter(function (c) { return c && (c.title || c.summary); }).map(function (c) {
        return '<article class="case reveal">' +
          '<div class="case-meta">' + esc(c.practice) + (c.year ? '<span>' + esc(c.year) + '</span>' : '') + '</div>' +
          '<h3>' + esc(c.title) + '</h3>' + paras(c.summary) +
          (c.outcome ? '<p class="case-outcome"><strong>Outcome</strong>' + esc(c.outcome) + '</p>' : '') +
          '</article>';
      }).join('');
      return pageHero(d.title) +
        (cases ? '<nav class="subnav"><div class="wrap"><a href="#clients">' + esc(d.clients_heading || 'Our Clients') + '</a>' +
          '<a href="#cases">' + esc(d.cases_heading || 'Our Success Stories') + '</a></div></nav>' : '') +
        '<section id="clients"><div class="wrap reveal"><div class="eyebrow">Who we represent</div><h2 class="section-title">' + esc(d.clients_heading || 'Our Clients') + '</h2>' +
        '<div class="lead">' + paras(d.intro) + '</div></div></section>' +
        '<section class="mist"><div class="wrap"><div class="eyebrow">Sectors</div><h2 class="section-title">' + esc(d.sectors_heading) + '</h2>' +
        '<div class="sectors reveal">' + sectors + '</div></div></section>' +
        (quotes ? '<section><div class="wrap"><div class="eyebrow">Testimonials</div><h2 class="section-title">' + esc(d.testimonials_heading) + '</h2><div class="quotes">' + quotes + '</div></div></section>' : '') +
        (cases ? '<section id="cases" class="cases-section"><div class="wrap"><div class="eyebrow">Track record</div><h2 class="section-title">' + esc(d.cases_heading || 'Our Success Stories') + '</h2>' +
          (d.cases_intro ? '<p class="muted" style="max-width:720px">' + esc(d.cases_intro) + '</p>' : '') +
          '<div class="cases">' + cases + '</div></div></section>' : '') +
        cta();
    },

    contact: function (s, d) {
      var offices = list(s.offices).map(function (o) {
        var em = o.email || s.email;
        return '<div class="office"><h3>' + esc(o.city) + '</h3><p>' + lines(o.address) + '</p>' +
          list(o.phones).map(function (p) { return '<p><a href="' + tel(p) + '">' + esc(p) + '</a></p>'; }).join('') +
          (em ? '<p><a href="mailto:' + esc(em) + '">' + esc(em) + '</a></p>' : '') + '</div>';
      }).join('');
      return pageHero(d.title) +
        '<section><div class="wrap contact-grid">' +
        '<div class="reveal"><p class="lead" style="margin-bottom:30px">' + esc(d.intro) + '</p>' + offices + '</div>' +
        '<div class="reveal"><h2 style="font-size:26px;margin-bottom:26px">' + esc(d.form_heading) + '</h2>' +
        '<form id="contact-form" novalidate>' +
        '<div class="row"><div class="field"><label for="f1">First name *</label><input id="f1" name="First name" required autocomplete="given-name"></div>' +
        '<div class="field"><label for="f2">Last name *</label><input id="f2" name="Last name" required autocomplete="family-name"></div></div>' +
        '<div class="row"><div class="field"><label for="f3">Email *</label><input id="f3" type="email" name="email" required autocomplete="email"></div>' +
        '<div class="field"><label for="f4">Phone</label><input id="f4" type="tel" name="Phone" autocomplete="tel"></div></div>' +
        '<div class="field"><label for="f5">Company</label><input id="f5" name="Company" autocomplete="organization"></div>' +
        '<div class="field"><label for="f6">Message *</label><textarea id="f6" name="Message" required maxlength="2000"></textarea></div>' +
        '<input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off">' +
        '<button class="btn" type="submit">Send Message</button><p class="form-note" aria-live="polite"></p></form></div>' +
        '</div></section>' + footprint(s);
    },

    legal: function (s, d) {
      var key = document.body.getAttribute('data-doc');
      var doc = d[key] || {};
      return pageHero(doc.title) +
        '<section><div class="wrap legal"><p class="muted">Last updated: ' + esc(doc.updated) + '</p>' +
        list(doc.sections).map(function (x) { return '<h2>' + esc(x.heading) + '</h2>' + paras(x.text); }).join('') +
        '</div></section>';
    }
  };

  var FILE = { home: 'home', services: 'services', about: 'about', clients: 'clients', contact: 'contact', legal: 'legal' };

  function wire(s, d) {
    var hdr = document.querySelector('.site-header');
    var onScroll = function () { hdr.classList.toggle('solid', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    var tog = document.querySelector('.menu-toggle');
    tog.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      tog.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }

    var form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var note = form.querySelector('.form-note');
        note.className = 'form-note';
        if (!form.checkValidity()) { note.textContent = 'Please fill in the required fields.'; note.classList.add('err'); return; }
        var btn = form.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending…';
        var data = new FormData(form);
        data.append('_subject', 'New enquiry from theassociates.me');
        data.append('_template', 'table');
        fetch('https://formsubmit.co/ajax/' + encodeURIComponent(s.form_email || s.email), {
          method: 'POST', headers: { Accept: 'application/json' }, body: data
        }).then(function (r) { return r.json(); }).then(function (r) {
          if (String(r.success) !== 'true') throw new Error(r.message);
          form.reset(); note.textContent = d.success_message || 'Thank you.'; note.classList.add('ok');
        }).catch(function () {
          note.innerHTML = 'Sorry, the message could not be sent. Please email us at <a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a>.';
          note.classList.add('err');
        }).then(function () { btn.disabled = false; btn.textContent = 'Send Message'; });
      });
    }
  }

  Promise.all([get('settings'), get(FILE[page])]).then(function (r) {
    var s = r[0], d = r[1];
    document.getElementById('app').innerHTML = header(s) + '<main>' + PAGES[page](s, d) + '</main>' + footer(s);
    wire(s, d);
  }).catch(function (e) {
    console.error(e);
    document.getElementById('app').innerHTML = '<p style="padding:40px;font-family:sans-serif">This page could not load its content. Please refresh, or email info@theassociates.me.</p>';
  });
})();
