(() => {
  // Fuente única de la información de afiliados.
  const affiliates = [
    {
      id: 'albert',
      name: 'Albert Ramos',
  document: 'CC: 243455087',
      phone: '+57 300 184 597',
      email: 'aramos@example.org',
      address: 'Las Delicias',
      age: 35,
      gender: 'Masculino',
      affiliationDate: '23/07/2021',
  occupation: 'Gestor comunitario',
      eps: 'SaludVida',
      participation: 'Consejo de vigilancia',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=12',
      avatarThumb: 'https://i.pravatar.cc/120?img=12'
    },
    {
      id: 'blanca',
      name: 'Blanca Ruiz',
  document: 'CC: 18877994',
      phone: '+57 319 884 225',
      email: 'bruiz@example.org',
      address: 'Santander',
      age: 42,
      gender: 'Femenino',
      affiliationDate: '15/05/2020',
  occupation: 'Facilitadora social',
      eps: 'Coosalud',
      participation: 'Mesa de trabajo territorial',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=47',
      avatarThumb: 'https://i.pravatar.cc/120?img=47'
    },
    {
      id: 'marcela',
      name: 'Marcela Fuentes',
  document: 'CC: 28505967',
      phone: '+57 315 112 048',
      email: 'mfuentes@example.org',
      address: 'Zacatín',
      age: 39,
      gender: 'Femenino',
      affiliationDate: '02/11/2018',
  occupation: 'Artesana textil',
      eps: 'Nueva EPS',
      participation: 'Red de emprendimiento comunitario',
      status: 'inactivo',
      avatarLarge: 'https://i.pravatar.cc/200?img=32',
      avatarThumb: 'https://i.pravatar.cc/120?img=32'
    },
    {
      id: 'alejandra',
      name: 'Alejandra Arroyo',
  document: 'CC: 46960122',
      phone: '+57 322 884 990',
      email: 'aarroyo@example.org',
      address: 'Buenos Aires',
      age: 29,
      gender: 'Femenino',
      affiliationDate: '07/08/2023',
  occupation: 'Mentora juvenil',
      eps: 'Compensar',
      participation: 'Programa de liderazgo juvenil',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=54',
      avatarThumb: 'https://i.pravatar.cc/120?img=54'
    },
    {
      id: 'juliana',
      name: 'Juliana Ortiz',
  document: 'CC: 31095879',
      phone: '+57 210 778 542',
      email: 'jortiz@example.org',
      address: 'Aranjuez',
      age: 33,
      gender: 'Femenino',
      affiliationDate: '16/12/2021',
  occupation: 'Profesora rural',
      eps: 'Savia Salud',
      participation: 'Escuela de formadores',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=5',
      avatarThumb: 'https://i.pravatar.cc/120?img=5'
    },
    {
      id: 'miguel',
      name: 'Miguel Pardo',
  document: 'CC: 28440639',
      phone: '+57 311 446 901',
      email: 'mpardo@example.org',
      address: 'El Placer',
      age: 41,
      gender: 'Masculino',
      affiliationDate: '30/09/2019',
  occupation: 'Productor agrícola',
      eps: 'Famisanar',
      participation: 'Comité de convivencia',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=21',
      avatarThumb: 'https://i.pravatar.cc/120?img=21'
    }
  ];

  const defaults = {
    name: 'Selecciona un afiliado',
    document: 'Usa la lista para ver la información detallada.'
  };

  const hostAside = document.querySelector('.humana-aside');
  const HIDDEN_FLAG = 'afiliadosHideState';
  const PREV_COLLAPSED = 'afiliadosPrevCollapsed';

  const hideHostAside = () => {
    if (!hostAside) {
      return;
    }

    if (hostAside.dataset[HIDDEN_FLAG] === 'active') {
      return;
    }

    hostAside.dataset[PREV_COLLAPSED] = hostAside.classList.contains('collapsed') ? 'true' : 'false';
    hostAside.classList.add('collapsed');
    hostAside.dataset[HIDDEN_FLAG] = 'active';
  };

  const showHostAside = () => {
    if (!hostAside) {
      return;
    }

    if (hostAside.dataset[HIDDEN_FLAG] !== 'active') {
      return;
    }

    const shouldRestoreCollapsed = hostAside.dataset[PREV_COLLAPSED] === 'true';
    delete hostAside.dataset[HIDDEN_FLAG];
    delete hostAside.dataset[PREV_COLLAPSED];

    if (shouldRestoreCollapsed) {
      hostAside.classList.add('collapsed');
    } else {
      hostAside.classList.remove('collapsed');
    }
  };

  if (!window.__humanaRestoreAsideListener) {
    window.__humanaRestoreAsideListener = showHostAside;
    document.addEventListener('humana:libro-unload', window.__humanaRestoreAsideListener);
  }

  const formatStatus = (status) => {
    if (!status) {
      return '';
    }
    const normalized = status.trim().toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const formatAge = (age) => {
    if (!age) {
      return 'N/D';
    }
    const number = Number(age);
    if (Number.isFinite(number)) {
      return `${number} años`;
    }
    return age;
  };

  const renderAffiliateRows = (layout) => {
    const tbody = layout.querySelector('[data-js="affiliate-list"]');
    if (!tbody) {
      return [];
    }

    tbody.innerHTML = '';

    affiliates.forEach((affiliate) => {
      const statusValue = (affiliate.status || '').trim().toLowerCase();
      const statusAttr = statusValue ? ` data-status="${statusValue}"` : '';
      const row = document.createElement('tr');
      row.dataset.affiliate = affiliate.id;
      row.dataset.name = affiliate.name;
      row.dataset.document = affiliate.document;
      row.dataset.phone = affiliate.phone;
      row.dataset.email = affiliate.email;
      row.dataset.address = affiliate.address;
      row.dataset.age = String(affiliate.age);
      row.dataset.gender = affiliate.gender;
    row.dataset.affiliationDate = affiliate.affiliationDate;
    row.dataset.occupation = affiliate.occupation;
      row.dataset.eps = affiliate.eps;
      row.dataset.participation = affiliate.participation;
      row.dataset.status = affiliate.status;
      row.dataset.avatar = affiliate.avatarLarge;

      row.tabIndex = 0;
      row.setAttribute('role', 'button');
      row.setAttribute('aria-label', `Ver detalle de ${affiliate.name}`);

      row.innerHTML = `
        <td>
          <div class="member-cell">
            <span class="member-avatar"${statusAttr}><img src="${affiliate.avatarThumb}" alt="Foto de ${affiliate.name}"></span>
            <div class="member-info">
              <strong>${affiliate.name}</strong>
              <span class="member-doc">${affiliate.document}</span>
              <span class="member-phone">Tel. ${affiliate.phone}</span>
            </div>
          </div>
        </td>
        <td data-field="barrio">${affiliate.address}</td>
        <td data-field="edad">${affiliate.age}</td>
        <td data-field="afiliacion">${affiliate.affiliationDate}</td>
    <td data-field="sexo">${affiliate.gender}</td>
    <td data-field="ocupacion">${affiliate.occupation}</td>
      `;

      tbody.appendChild(row);
    });

    return Array.from(tbody.querySelectorAll('tr'));
  };

  const setupLayout = (layout) => {
    if (!layout || layout.dataset.afiliadosReady === 'true') {
      return;
    }

    const panel = layout.querySelector('[data-js="details-panel"]');
    const closeButton = panel ? panel.querySelector('.panel-close') : null;
    const rows = renderAffiliateRows(layout);

    if (!panel || !rows.length) {
      return;
    }

    layout.dataset.afiliadosReady = 'true';

    // Cache references to each dynamic detail element.
    const fields = {
      avatar: panel.querySelector('[data-detail="avatar"]'),
      photo: panel.querySelector('[data-detail="photo"]'),
      name: panel.querySelector('[data-detail="name"]'),
      document: panel.querySelector('[data-detail="document"]'),
      status: panel.querySelector('[data-detail="status"]'),
      phone: panel.querySelector('[data-detail="phone"]'),
      email: panel.querySelector('[data-detail="email"]'),
      address: panel.querySelector('[data-detail="address"]'),
      age: panel.querySelector('[data-detail="age"]'),
      gender: panel.querySelector('[data-detail="gender"]'),
      affiliationDate: panel.querySelector('[data-detail="affiliationDate"]'),
      eps: panel.querySelector('[data-detail="eps"]'),
      participation: panel.querySelector('[data-detail="participation"]'),
      occupation: panel.querySelector('[data-detail="occupation"]')
    };

    let activeRow = null;
    const SCROLLABLE_CLASS = 'is-scrollable';
    let pendingScrollSync = null;

    const syncPanelScrollState = () => {
      pendingScrollSync = null;

      if (!panel || panel.hidden) {
        panel.classList.remove(SCROLLABLE_CLASS);
        return;
      }

      const tolerance = 2;
      const shouldScroll = panel.scrollHeight - panel.clientHeight > tolerance;
      panel.classList.toggle(SCROLLABLE_CLASS, shouldScroll);
    };

    const scheduleScrollSync = () => {
      if (pendingScrollSync !== null) {
        return;
      }

      pendingScrollSync = requestAnimationFrame(syncPanelScrollState);
    };

    if (!panel.dataset.scrollObserverAttached) {
      panel.dataset.scrollObserverAttached = 'true';
      if (typeof ResizeObserver === 'function') {
        const observer = new ResizeObserver(scheduleScrollSync);
        observer.observe(panel);
      }
      window.addEventListener('resize', scheduleScrollSync);
    }

    // Inject row dataset values into the detail pane.
    const populatePanel = (data) => {
      const {
        name,
        document: documentId,
        phone,
        email,
        address,
        age,
        gender,
        affiliationDate,
        occupation,
        eps,
        participation,
        status,
        avatar
      } = data;

      if (fields.name) {
        fields.name.textContent = name || defaults.name;
      }

      if (fields.document) {
        fields.document.textContent = documentId || defaults.document;
      }

      if (fields.phone) {
        fields.phone.textContent = phone || 'N/D';
      }

      if (fields.email) {
        fields.email.textContent = email || 'N/D';
      }

      if (fields.address) {
        fields.address.textContent = address || 'N/D';
      }

      if (fields.age) {
        fields.age.textContent = formatAge(age);
      }

      if (fields.gender) {
        fields.gender.textContent = gender || 'N/D';
      }

      if (fields.affiliationDate) {
        fields.affiliationDate.textContent = affiliationDate || 'N/D';
      }

      if (fields.occupation) {
        fields.occupation.textContent = occupation || 'N/D';
      }

      if (fields.eps) {
        fields.eps.textContent = eps || 'N/D';
      }

      if (fields.participation) {
        fields.participation.textContent = participation || 'N/D';
      }

      if (fields.status) {
        const displayStatus = formatStatus(status);
        fields.status.textContent = displayStatus;
        fields.status.hidden = !displayStatus;
        fields.status.classList.toggle('inactive', displayStatus.toLowerCase() === 'inactivo');
      }

      if (fields.avatar) {
        if (avatar) {
          fields.avatar.src = avatar;
          fields.avatar.alt = name ? `Retrato de ${name}` : 'Retrato de afiliado';
          fields.avatar.hidden = false;
        } else {
          fields.avatar.removeAttribute('src');
          fields.avatar.alt = '';
          fields.avatar.hidden = true;
        }
      }

      if (fields.photo) {
        if (status) {
          fields.photo.dataset.status = status.trim().toLowerCase();
        } else {
          delete fields.photo.dataset.status;
        }
      }

      scheduleScrollSync();
    };

    const resetPanel = () => {
      if (activeRow) {
        activeRow.setAttribute('aria-selected', 'false');
        activeRow = null;
      }

      if (fields.name) {
        fields.name.textContent = defaults.name;
      }

      if (fields.document) {
        fields.document.textContent = defaults.document;
      }

      if (fields.status) {
        fields.status.textContent = '';
        fields.status.hidden = true;
        fields.status.classList.remove('inactive');
      }

      if (fields.avatar) {
        fields.avatar.removeAttribute('src');
        fields.avatar.alt = '';
        fields.avatar.hidden = true;
      }

      if (fields.photo) {
        delete fields.photo.dataset.status;
      }

      Object.keys(fields).forEach((key) => {
        if (['name', 'document', 'status', 'avatar', 'photo'].includes(key)) {
          return;
        }

        const element = fields[key];
        if (element) {
          element.textContent = 'N/D';
        }
      });

      showHostAside();
      layout.classList.remove('has-selection');
      panel.hidden = true;
      panel.classList.remove(SCROLLABLE_CLASS);
    };

    const handleRowSelection = (row) => {
      if (!row) {
        return;
      }

      if (activeRow === row && !panel.hidden) {
        return;
      }

      if (activeRow) {
        activeRow.setAttribute('aria-selected', 'false');
      }

      activeRow = row;
      activeRow.setAttribute('aria-selected', 'true');

      populatePanel(activeRow.dataset);
      layout.classList.add('has-selection');
      panel.hidden = false;
      scheduleScrollSync();
      hideHostAside();
    };

    // Bind click and keyboard handlers to each row.
    rows.forEach((row) => {
      row.setAttribute('aria-selected', 'false');

      row.addEventListener('click', () => {
        handleRowSelection(row);
      });

      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleRowSelection(row);
        }
      });
    });

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        const lastRow = activeRow;
        resetPanel();
        if (lastRow) {
          lastRow.focus();
        }
      });
    }

    layout.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        const lastRow = activeRow;
        resetPanel();
        if (lastRow) {
          lastRow.focus();
        }
      }
    });

    resetPanel();
    scheduleScrollSync();

    // --- Nuevo afiliado: apertura del modal, envío y creación local ---
    try {
      // Asegura que exista el modal en el DOM (útil si estamos en index.html u otra página)
      const ensureModalExists = () => {
        let m = document.querySelector('[data-js="nuevo-modal"]');
        if (m) return m;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
          <div class="modal-overlay" data-js="nuevo-modal">
            <div class="modal-panel modal-dark" role="dialog" aria-modal="true" aria-labelledby="modalTitulo">
              <button type="button" class="modal-close" aria-label="Cerrar formulario">×</button>
              <h3 id="modalTitulo">Agregar nuevo afiliado</h3>
              <form id="nuevoAfiliadoForm" class="modal-grid">
                <div class="modal-col">
                  <h4 class="modal-section-title">Datos personales</h4>
                  <div class="form-row"><label>Nombres<input name="name" required placeholder="Nombres"></label></div>
                  <div class="form-row"><label>Apellidos<input name="lastname" placeholder="Apellidos"></label></div>
                  <div class="form-row"><label>Tipo de documento<select name="docType"><option>CC</option><option>TI</option><option>Pasaporte</option></select></label></div>
                  <div class="form-row"><label>Número de documento<input name="document" placeholder="Número de documento"></label></div>
                  <div class="form-row"><label>Fecha de nacimiento<input name="birthDate" type="date"></label></div>
                  <div class="form-row"><label>Teléfono<input name="phone" placeholder="Teléfono"></label></div>
                </div>
                <div class="modal-col">
                  <h4 class="modal-section-title">Datos JAC</h4>
                  <div class="form-row"><label>JAC<select name="jac"><option>JAC Providencia</option></select></label></div>
                  <div class="form-row"><label>Rol<select name="role"><option>Selecciona</option></select></label></div>
                  <div class="form-row"><label>Fecha de afiliación<input name="affiliationDate" type="date"></label></div>
                  <div class="form-row"><label>Libro / Folio<input name="libro" placeholder="Ej: Activo"></label></div>
                  <div class="form-row"><label>Estado<select name="status"><option>Activo</option><option>Inactivo</option></select></label></div>
                </div>
                <div class="modal-full">
                  <div class="form-row"><label>ID Humana<input name="humanaId" placeholder="Se generará al guardar" readonly></label></div>
                  <div class="modal-row">
                    <div class="checkbox-group">
                      <label class="checkbox-row">
                        <input type="checkbox" name="createWallet" checked>
                        <span class="checkbox-text">Crear wallet Humana para este afiliado</span>
                      </label>
                      <label class="checkbox-row">
                        <input type="checkbox" name="consent" checked required>
                        <span class="checkbox-text">Autoriza el uso y tratamiento de mis datos personales</span>
                      </label>
                    </div>

                    <div class="form-actions modal-actions">
                      <button type="button" class="btn-cancel">Cancelar</button>
                      <button type="submit" class="btn-save primary">Guardar afiliado</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        `;

        // El innerHTML crea el overlay > panel > form; añadimos al body
        document.body.appendChild(wrapper.firstElementChild);
        // ocultar por defecto
        const created = document.querySelector('[data-js="nuevo-modal"]');
        if (created) created.hidden = true;
        return created;
      };

      const modal = ensureModalExists();
      const newBtns = Array.from(document.querySelectorAll('[data-js="nuevo-affiliado"]'));
      const form = modal ? modal.querySelector('#nuevoAfiliadoForm') : null;
      const cancelBtn = modal ? modal.querySelector('.btn-cancel') : null;
      const modalClose = modal ? modal.querySelector('.modal-close') : null;

      let previouslyFocused = null;

      const focusableSelectors = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

      const getFocusable = () => {
        if (!modal) return [];
        return Array.from(modal.querySelectorAll(focusableSelectors)).filter((el) => el.offsetParent !== null);
      };

      const onKeyDown = (e) => {
        if (!modal || modal.hidden) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModal();
          return;
        }

        if (e.key === 'Tab') {
          const focusable = getFocusable();
          if (!focusable.length) {
            e.preventDefault();
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      const openModal = () => {
        if (!modal) return;
        previouslyFocused = document.activeElement;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', onKeyDown);
        const first = form ? form.querySelector('[name="name"]') : null;
        if (first) first.focus();
      };

      const closeModal = () => {
        if (!modal) return;
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', onKeyDown);
        form && form.reset();
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
      };

      if (newBtns.length) {
        newBtns.forEach((nb) => nb.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
      }

      if (cancelBtn) cancelBtn.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
      if (modalClose) modalClose.addEventListener('click', closeModal);

      // Cerrar al click fuera del panel (overlay)
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal();
          }
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const entry = {
            id: (fd.get('name') || 'nuevo').toString().toLowerCase().replace(/\s+/g,'-'),
            name: (fd.get('name') || '').toString().trim() || 'Sin nombre',
            lastname: (fd.get('lastname') || '').toString().trim(),
            docType: (fd.get('docType') || '').toString().trim(),
            document: (fd.get('document') || '').toString().trim(),
            birthDate: fd.get('birthDate') ? new Date(fd.get('birthDate')).toLocaleDateString() : '',
            phone: (fd.get('phone') || '').toString().trim(),
            email: (fd.get('email') || '').toString().trim(),
            address: (fd.get('address') || '').toString().trim(),
            age: fd.get('age') ? Number(fd.get('age')) : undefined,
            gender: (fd.get('gender') || '').toString().trim(),
            affiliationDate: fd.get('affiliationDate') ? new Date(fd.get('affiliationDate')).toLocaleDateString() : '',
            jac: (fd.get('jac') || '').toString().trim(),
            role: (fd.get('role') || '').toString().trim(),
            libro: (fd.get('libro') || '').toString().trim(),
            status: (fd.get('status') || 'activo').toString().trim(),
            createWallet: !!fd.get('createWallet'),
            consent: !!fd.get('consent'),
            humanaId: (fd.get('humanaId') || '').toString().trim(),
            occupation: '',
            eps: '',
            participation: '',
            avatarLarge: 'https://i.pravatar.cc/200?img=68',
            avatarThumb: 'https://i.pravatar.cc/120?img=68'
          };

          // Añadir al array y re-render en este layout
          try {
            affiliates.push(entry);
            renderAffiliateRows(layout);
            const added = layout.querySelector(`tr[data-affiliate="${entry.id}"]`);
            if (added) added.focus();

            const event = new CustomEvent('humana:afiliado-creado', { detail: entry });
            document.dispatchEvent(event);

            closeModal();
          } catch (err) {
            console.error('No se pudo añadir afiliado localmente', err);
          }
        });
      }
    } catch (err) {
      // no bloquear la página si algo falla aquí
      console.error('Error al inicializar formulario nuevo afiliado', err);
    }
  };

  const init = () => {
    const layouts = document.querySelectorAll('[data-js="book-layout"]');
    layouts.forEach(setupLayout);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }

  init();
})();
