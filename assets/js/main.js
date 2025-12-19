// basic header nav toggle
document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  // Mobile nav: class-based toggle + accessibility
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
      toggle.innerHTML = '';
    };
    const openMenu = () => {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
      toggle.innerHTML = '';
    };
    
    toggle.addEventListener('click', () => {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    
    // Close when a link is clicked - use event delegation
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMenu();
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => { 
      if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(); 
    }, true);
    
    // Ensure correct state on resize
    const mq = window.matchMedia('(max-width: 700px)');
    const handleResize = () => {
      if (!mq.matches) { closeMenu(); }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
  }

  // footer year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // slideshow - optimized with cached selectors
  const slides = Array.from(document.querySelectorAll('.slideshow .slide'));
  if(slides.length){
    let idx = 0;
    const nextBtn = document.querySelector('.slide-next');
    const prevBtn = document.querySelector('.slide-prev');
    const dotsWrap = document.getElementById('slideDots');
    const slideshow = document.getElementById('slideshow');
    const mq = window.matchMedia('(max-width: 700px)');
    
    let timer = null;
    let desktopInitialized = false;
    let dotButtons = null;

    function renderDots(){
      if(!dotsWrap) return;
      dotsWrap.innerHTML = '';
      dotButtons = [];
      slides.forEach((s,i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (i+1));
        if(i === idx) b.classList.add('active');
        b.addEventListener('click', ()=> goTo(i));
        dotsWrap.appendChild(b);
        dotButtons.push(b);
      });
    }

    function show(){
      slides.forEach((s,i)=>{
        s.classList.toggle('active', i === idx);
      });
      if (dotButtons) {
        dotButtons.forEach((b,i)=> b.classList.toggle('active', i === idx));
      }
    }

    function goTo(i){
      idx = (i + slides.length) % slides.length;
      show();
    }

    function setupDesktop(){
      if (desktopInitialized) return;
      desktopInitialized = true;
      if (dotsWrap) { dotsWrap.style.display = ''; }
      renderDots();
      show();
      
      if(nextBtn) nextBtn.addEventListener('click', ()=> goTo(idx+1));
      if(prevBtn) prevBtn.addEventListener('click', ()=> goTo(idx-1));
      
      timer = setInterval(()=> goTo(idx+1), 5000);
      
      const pauseSlideshow = () => { 
        if (timer) { clearInterval(timer); timer = null; } 
      };
      const resumeSlideshow = () => { 
        if (!timer) timer = setInterval(()=> goTo(idx+1), 5000); 
      };
      
      slideshow.addEventListener('mouseenter', pauseSlideshow);
      slideshow.addEventListener('mouseleave', resumeSlideshow);
    }

    function setupMobile(){
      if (timer) { clearInterval(timer); timer = null; }
      if (dotsWrap) { dotsWrap.innerHTML = ''; dotsWrap.style.display = 'none'; }
      idx = 0;
      show();
      desktopInitialized = false;
    }

    const handleChange = (e) => {
      if (e.matches) setupMobile(); else setupDesktop();
    };

    // Initial
    if (mq.matches) setupMobile(); else setupDesktop();
    if (mq.addEventListener) mq.addEventListener('change', handleChange);
    else if (mq.addListener) mq.addListener(handleChange); // fallback
  }

  // Project click handlers - redirect to project detail pages
  const projects = document.querySelectorAll('.project[data-project]');
  projects.forEach(project => {
    project.style.cursor = 'pointer';
    project.addEventListener('click', function() {
      const projectSlug = this.getAttribute('data-project');
      if (projectSlug) {
        window.location.href = `${projectSlug}.html`;
      }
    });
  });
});
