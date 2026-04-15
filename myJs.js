
    // ── GSAP SETUP ─────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // ── CUSTOM CURSOR ──────────────────────────────────
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    
    (function animCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll('a, button, .project-item, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // ── PRELOADER ──────────────────────────────────────
    const fill = document.getElementById('preloader-fill');
    const num  = document.getElementById('preloader-num');
    const preloader = document.getElementById('preloader');
    let progress = 0;

    const loadTl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 1,
          ease: 'expo.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            introAnim();
          }
        });
      }
    });

    gsap.to({ val: 0 }, {
      val: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: function() {
        const v = Math.round(this.targets()[0].val);
        fill.style.width = v + '%';
        num.textContent  = v + '%';
      }
    });

    // ── INTRO ANIMATION ────────────────────────────────
    function introAnim() {
      const tl = gsap.timeline();

      // Title lines sweep up
      tl.to('.hero-title-inner', {
        translateY: '0%',
        duration: 1.1,
        stagger: .12,
        ease: 'expo.out'
      });

      // Eyebrow fade
      tl.to('#hero-eyebrow', {
        opacity: 1,
        y: 0,
        duration: .8,
        ease: 'power3.out'
      }, '-=.6');

      // Subtitle
      tl.to('#hero-sub', {
        opacity: 1,
        y: 0,
        duration: .8,
        ease: 'power3.out'
      }, '-=.5');

      // CTA
      tl.to('#hero-cta', {
        opacity: 1,
        y: 0,
        duration: .7,
        ease: 'power3.out'
      }, '-=.5');

      // Stats counter
      tl.to('.hero-stat', {
        opacity: 1,
        stagger: .1,
        duration: .5
      }, '-=.4');

      // Count up numbers
      tl.add(() => {
        countUp('count1', 0, 10);
        countUp('count2', 0, 2);
        countUp('count3', 0, 100);
      }, '-=.3');
    }

    function countUp(id, from, to) {
      gsap.to({ val: from }, {
        val: to,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function() {
          document.getElementById(id).textContent = Math.round(this.targets()[0].val);
        }
      });
    }

    // ── SCROLL PROGRESS BAR ────────────────────────────
    gsap.to('#progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        scrub: true,
        start: 'top top',
        end:   'bottom bottom'
      }
    });

    // ── REVEAL ON SCROLL ───────────────────────────────
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // ── SKILL BARS ANIMATE ─────────────────────────────
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const w = bar.dataset.width + '%';
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        onEnter: () => gsap.to(bar, { width: w, duration: 1.2, ease: 'power3.out' })
      });
    });

    // ── SECTION TITLE SCRUB PARALLAX ──────────────────
    document.querySelectorAll('.section-title').forEach(title => {
      gsap.fromTo(title,
        { x: -30 },
        {
          x: 0,
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      );
    });

    // ── HERO PARALLAX ──────────────────────────────────
    gsap.to('.hero-title', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // ── TEXT SCRAMBLE ──────────────────────────────────
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#░▒▓';
        this.update = this.update.bind(this);
      }
      setText(newText) {
        const length = Math.max(this.el.innerText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = this.el.innerText[i] || '';
          const to   = newText[i] || '';
          const start = Math.floor(Math.random() * 20);
          const end   = start + Math.floor(Math.random() * 20);
          this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }
      update() {
        let output = '', complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < .28) {
              char = this.chars[Math.floor(Math.random() * this.chars.length)];
              this.queue[i].char = char;
            }
            output += `<span style="color:var(--gold-dim)">${char}</span>`;
          } else {
            output += from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
    }

    // Run scramble on first hero title after intro
    setTimeout(() => {
      const titleLines = document.querySelectorAll('.hero-title-inner');
      if (titleLines[0]) {
        const fx = new TextScramble(titleLines[0]);
        fx.setText('ALAN');
      }
    }, 2400);

    // ── MAGNETIC BUTTONS ──────────────────────────────
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * .25;
        const dy = (e.clientY - cy) * .25;
        gsap.to(btn, { x: dx, y: dy, duration: .3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1, .5)' });
      });
    });

    // ── PROJECT ITEMS STAGGER ─────────────────────────
    gsap.fromTo('.project-item',
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0,
        duration: .8,
        stagger: .12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-list',
          start: 'top 80%'
        }
      }
    );

    // ── CONTACT TITLE SPLIT ───────────────────────────
    gsap.fromTo('.contact-big',
      { opacity: 0, y: 80 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.contact-big',
          start: 'top 85%'
        }
      }
    );

    // ── SKILL CARDS STAGGER ───────────────────────────
    gsap.fromTo('.skill-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: .7,
        stagger: .1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%'
        }
      }
    );

    // ── NAV HIDE/SHOW ON SCROLL ───────────────────────
    let lastY = 0;
    ScrollTrigger.create({
      start: 200,
      onUpdate: self => {
        if (self.direction === 1) {
          gsap.to('#main-nav', { yPercent: -120, duration: .4, ease: 'power2.in' });
        } else {
          gsap.to('#main-nav', { yPercent: 0, duration: .4, ease: 'power2.out' });
        }
      }
    });

    // ── SMOOTH SCROLL FOR NAV LINKS ───────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'expo.inOut'
        });
      });
    });

    // Load ScrollTo plugin fallback
    if (!gsap.plugins || !gsap.plugins.scrollTo) {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          const t = document.querySelector(link.getAttribute('href'));
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
      });
    }
