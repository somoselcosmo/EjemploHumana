// === FUNCIONALIDAD DE COLAPSO DEL ASIDE ===

document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleAsideBtn');
  const aside = document.querySelector('.humana-aside');
  const topContent = document.getElementById('topContent');
  const submenuToggle = document.querySelector('.submenu-toggle[aria-controls="submenu-libros"]');
  const submenu = document.getElementById('submenu-libros');

  // Recuperar estado del localStorage (si el usuario ya colapsó antes)
  const isCollapsed = localStorage.getItem('asideCollapsed') === 'true';
  
  if (isCollapsed) {
    aside.classList.add('collapsed');
  }

  // Click en el botón toggle
  toggleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Toggle la clase
    aside.classList.toggle('collapsed');
    
    // Guardar el estado en localStorage
    const collapsed = aside.classList.contains('collapsed');
    localStorage.setItem('asideCollapsed', collapsed);
  });

  // Opcional: Cerrar el aside en pantallas pequeñas
  if (window.innerWidth < 1024) {
    aside.classList.add('collapsed');
    localStorage.setItem('asideCollapsed', 'true');
  }
  // === Sincronizar altura: limitar aside a la altura real del #topContent ===
  const syncAsideHeight = () => {
    if (!aside || !topContent) return;
    // Usar la altura del topContent como límite máximo, permitir que aside se auto-ajuste y haga scroll.
    const h = topContent.offsetHeight;
    aside.style.maxHeight = h + 'px';
    aside.style.height = 'auto';
  };

  // Observador para cambios dinámicos dentro de topContent
  if (topContent && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(syncAsideHeight);
    ro.observe(topContent);
  }
  // Recalcular en eventos clave
  window.addEventListener('load', syncAsideHeight);
  window.addEventListener('resize', () => {
    requestAnimationFrame(syncAsideHeight);
  });

  // Recalcular después de colapso (delay para permitir transición width)
  toggleBtn.addEventListener('click', () => {
    setTimeout(syncAsideHeight, 320); // tras transición de ancho
  });

  // Inicial
  syncAsideHeight();

  // === Submenu Libros: expand/collapse ===
  if (submenuToggle && submenu) {
    const parentItem = submenuToggle.closest('.menu-item.has-submenu');
    const setState = (open) => {
      submenuToggle.setAttribute('aria-expanded', String(open));
      if (open) {
        submenu.classList.add('open');
        parentItem && parentItem.classList.add('expanded');
      } else {
        submenu.classList.remove('open');
        parentItem && parentItem.classList.remove('expanded');
      }
      // recalc aside height after animation frame
      requestAnimationFrame(syncAsideHeight);
    };
    submenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = submenu.classList.contains('open');
      setState(!isOpen);
    });

    // Close submenu when aside collapses
    toggleBtn.addEventListener('click', () => {
      if (aside.classList.contains('collapsed')) setState(false);
      // After transition, ensure height sync
      setTimeout(syncAsideHeight, 340);
    });
  }

  // Panel de tema eliminado: se removió la lógica de UI del switch/orb
});

