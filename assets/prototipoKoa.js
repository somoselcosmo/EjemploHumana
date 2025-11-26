// === FUNCIONALIDAD DE COLAPSO DEL ASIDE ===

document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleAsideBtn');
  const aside = document.querySelector('.humana-aside');
  const topContent = document.getElementById('topContent');
  const submenuToggle = document.querySelector('.submenu-toggle[aria-controls="submenu-libros"]');
  const submenu = document.getElementById('submenu-libros');
  const homeNav = document.querySelector('.menu-item[data-nav="home"]');
  const libroLinks = document.querySelectorAll('[data-libro]');
  const directivaMount = document.getElementById('directivaMount');
  const directivaSection = document.getElementById('directivaSection');

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

  const defaultTopMarkup = topContent ? topContent.innerHTML : '';
  const libroCache = {};
  const libroRoutes = Array.from(libroLinks).reduce((routes, link) => {
    const libroId = link.getAttribute('data-libro');
    const route = link.getAttribute('data-route');
    if (libroId && route) {
      routes[libroId] = route;
    }
    return routes;
  }, {});

  const scrollToDirectivaSection = () => {
    if (!directivaSection) return;
    directivaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showLibroState = (message) => {
    if (!topContent) return;
    topContent.innerHTML = `
      <div class="libro-embed">
        <div class="libro-feedback">${message}</div>
      </div>
    `;
    requestAnimationFrame(syncAsideHeight);
  };

  const showDirectivaState = (message, shouldScroll = true) => {
    if (!directivaMount) return;
    directivaMount.innerHTML = `
      <div class="directiva-feedback">
        <i class="ri-information-line" aria-hidden="true"></i>
        <span>${message}</span>
      </div>
    `;
    if (shouldScroll) {
      scrollToDirectivaSection();
    }
  };

  const resolveScriptSrc = (value, sourceUrl) => {
    if (!value) return '';
    const trimmed = value.trim();
    const isAbsolute = /^(?:https?:)?\/\//i.test(trimmed) || trimmed.startsWith('/') || trimmed.startsWith('data:');
    if (isAbsolute) {
      return trimmed;
    }
    if (!sourceUrl) {
      return trimmed;
    }
    const segments = sourceUrl.split('/');
    segments.pop();
    const basePath = segments.join('/') + (segments.length ? '/' : '');
    return basePath + trimmed;
  };

  // Execute any script tags found in the fetched libro markup.
  const runEmbeddedScripts = (doc, mountPoint, sourceUrl) => {
    const scripts = doc.querySelectorAll('script');
    scripts.forEach((script) => {
      const freshScript = document.createElement('script');
      Array.from(script.attributes).forEach(({ name, value }) => {
        if (name === 'src') {
          const resolved = resolveScriptSrc(value, sourceUrl);
          if (resolved) {
            freshScript.src = resolved;
          }
        } else {
          freshScript.setAttribute(name, value);
        }
      });
      if (!script.src) {
        freshScript.textContent = script.textContent;
      }
      mountPoint.appendChild(freshScript);
    });
  };

  const renderLibroView = (html, sourceUrl, libroId) => {
    if (!topContent) return;
    document.dispatchEvent(new CustomEvent('humana:libro-unload'));
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const layout = doc.querySelector('.book-layout');
    if (!layout) {
      showLibroState('No se pudo preparar el contenido del libro.');
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'libro-embed';
    wrapper.appendChild(layout);
    topContent.innerHTML = '';
    topContent.appendChild(wrapper);
    runEmbeddedScripts(doc, wrapper, sourceUrl);
    topContent.classList.add('is-libro');
    topContent.scrollTop = 0;
    requestAnimationFrame(syncAsideHeight);
    if (libroId) {
      document.dispatchEvent(new CustomEvent('humana:libro-loaded', { detail: { libroId } }));
    }
  };

  const renderDirectivaView = (html, sourceUrl, options = {}) => {
    const { scroll = true } = options;
    if (!directivaMount) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const layout = doc.querySelector('.book-layout');
    if (!layout) {
      showDirectivaState('No se pudo preparar el contenido de la directiva.', scroll);
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'directiva-embed';
    wrapper.appendChild(layout);
    directivaMount.innerHTML = '';
    directivaMount.appendChild(wrapper);
    runEmbeddedScripts(doc, wrapper, sourceUrl);
    requestAnimationFrame(() => {
      if (scroll) {
        scrollToDirectivaSection();
      }
      syncAsideHeight();
    });
    document.dispatchEvent(new CustomEvent('humana:directiva-loaded'));
  };

  const loadLibroView = (libroId, routeOverride) => {
    if (!topContent) return;
    if (routeOverride) {
      libroRoutes[libroId] = routeOverride;
    }
    const targetRoute = libroRoutes[libroId];
    topContent.classList.add('is-libro');
    if (!targetRoute) {
      showLibroState('Este módulo aún se está preparando.');
      return;
    }
    if (libroCache[libroId]) {
      renderLibroView(libroCache[libroId], targetRoute, libroId);
      return;
    }
    showLibroState('Cargando módulo...');
    fetch(targetRoute)
      .then((response) => {
        if (!response.ok) throw new Error('Network');
        return response.text();
      })
      .then((html) => {
        libroCache[libroId] = html;
        renderLibroView(html, targetRoute, libroId);
      })
      .catch(() => {
        showLibroState('No se pudo cargar el libro. Inténtalo nuevamente.');
      });
  };

  const loadDirectivaView = (routeOverride, options = {}) => {
    const { scroll = true } = options;
    if (!directivaMount) {
      if (scroll) {
        scrollToDirectivaSection();
      }
      return;
    }
    const directivaId = 'directiva';
    if (routeOverride) {
      libroRoutes[directivaId] = routeOverride;
    }
    const targetRoute = libroRoutes[directivaId];
    if (!targetRoute) {
      showDirectivaState('Este módulo aún se está preparando.', scroll);
      return;
    }
    if (libroCache[directivaId]) {
      renderDirectivaView(libroCache[directivaId], targetRoute, { scroll });
      return;
    }
    showDirectivaState('Cargando módulo...', scroll);
    fetch(targetRoute)
      .then((response) => {
        if (!response.ok) throw new Error('Network');
        return response.text();
      })
      .then((html) => {
        libroCache[directivaId] = html;
        renderDirectivaView(html, targetRoute, { scroll });
      })
      .catch(() => {
        showDirectivaState('No se pudo cargar la directiva. Inténtalo nuevamente.', scroll);
      });
  };

  const restoreHomeView = () => {
    if (!topContent) return;
    document.dispatchEvent(new CustomEvent('humana:libro-unload'));
    topContent.classList.remove('is-libro');
    topContent.innerHTML = defaultTopMarkup;
    topContent.scrollTop = 0;
    requestAnimationFrame(syncAsideHeight);
  };

  document.addEventListener('humana:volver-inicio', (event) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    restoreHomeView();
  });

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

  if (homeNav) {
    homeNav.addEventListener('click', (event) => {
      event.preventDefault();
      restoreHomeView();
    });
  }

  libroLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const scrollTarget = link.getAttribute('data-scroll-target');
      if (scrollTarget) {
        event.preventDefault();
        restoreHomeView();
        const anchor = document.querySelector(scrollTarget);
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      event.preventDefault();
      const libroId = link.getAttribute('data-libro');
      if (!libroId) return;
      const route = link.getAttribute('data-route');
      if (libroId === 'directiva') {
        loadDirectivaView(route, { scroll: true });
        return;
      }
      loadLibroView(libroId, route);
    });
  });

  // Mostrar la directiva por defecto sin hacer scroll inmediato
  loadDirectivaView(null, { scroll: false });

  // Panel de tema eliminado: se removió la lógica de UI del switch/orb
});

