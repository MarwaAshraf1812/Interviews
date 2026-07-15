/**
 * Senior Front-End Responsive Sidebar and Chapter Control Module
 * Implements collapsible desktop sidebars, drawer-style mobile overlays,
 * swipe gesture support, keyboard controls, quiz disclosures, and scroll spy.
 */
document.addEventListener('DOMContentLoaded', () => {
  const aside = document.querySelector('aside');
  if (!aside) return;

  const brandSub = aside.querySelector('.brand .sub') ? aside.querySelector('.brand .sub').textContent : '';

  // 1. Dynamically inject mobile header
  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'mobile-header';
  mobileHeader.innerHTML = `
    <button class="menu-toggle" id="menuToggle" aria-label="Open Menu">☰</button>
    <div class="brand-title">${brandSub || 'Interview Bible'}</div>
    <div style="width: 36px;"></div> <!-- visual spacer to balance title centering -->
  `;
  document.body.insertBefore(mobileHeader, document.body.firstChild);

  // 2. Dynamically inject sidebar backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  document.body.appendChild(backdrop);

  // 3. Dynamically inject collapse button for desktop
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'sidebar-collapse-btn';
  collapseBtn.setAttribute('aria-label', 'Collapse Sidebar');
  collapseBtn.innerHTML = '‹';
  aside.appendChild(collapseBtn);

  // 4. Sidebar Event Listeners
  const openSidebar = () => {
    aside.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent main body scrolling when menu is open
  };

  const closeSidebar = () => {
    aside.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Toggle drawer on mobile
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', openSidebar);
  }

  // Backdrop click close drawer
  backdrop.addEventListener('click', closeSidebar);

  // Close drawer on link click
  const navLinks = aside.querySelectorAll('.nav-list a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // Desktop collapse state management (persisted via localStorage)
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    aside.classList.add('collapsed');
    collapseBtn.innerHTML = '›';
  }

  collapseBtn.addEventListener('click', () => {
    const collapsed = aside.classList.toggle('collapsed');
    localStorage.setItem('sidebar-collapsed', collapsed);
    collapseBtn.innerHTML = collapsed ? '›' : '‹';
  });

  // Keyboard accessibility controls (Escape closes open drawer)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aside.classList.contains('open')) {
      closeSidebar();
    }
  });

  // 5. Responsive Resize Guard (Closes mobile sidebar when transitioning to desktop layout)
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  const handleResize = (e) => {
    if (e.matches) {
      closeSidebar();
    }
  };
  mediaQuery.addEventListener('change', handleResize);

  // 6. Native Swipe Gestures for Mobile Drawer
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 60;
  const EDGE_THRESHOLD = 40; // Only trigger swipe right from the left screen edge

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Must be a predominantly horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > SWIPE_THRESHOLD && touchStartX < EDGE_THRESHOLD && !aside.classList.contains('open')) {
        // Swipe right from edge -> Open menu
        openSidebar();
      } else if (diffX < -SWIPE_THRESHOLD && aside.classList.contains('open')) {
        // Swipe left anywhere -> Close menu
        closeSidebar();
      }
    }
  }, { passive: true });

  // 7. IntersectionObserver for Active Section Scroll Spy
  const sections = document.querySelectorAll('section');
  if (sections.length > 0) {
    const observerOptions = {
      threshold: [0.1, 0.3, 0.5],
      rootMargin: "0px 0px -40% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const navItem = document.getElementById(`nav-${id}`);
        if (entry.intersectionRatio > 0.3) {
          document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
          if (navItem) navItem.classList.add('active');
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }
});

// 8. Global Quiz Toggle Disclosure
window.toggleQuiz = function (id) {
  const el = document.getElementById(id);
  const btn = document.getElementById(id + '-btn');
  if (el && btn) {
    const isOpen = el.classList.toggle('open');
    btn.textContent = isOpen ? "Hide Answer" : "Show Answer & Explanation";
  }
};
