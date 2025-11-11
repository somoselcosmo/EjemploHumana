(() => {
  // Fuente única de la información de afiliados.
  const affiliates = [
    {
      id: 'albert',
      name: 'Albert Ramos',
      document: 'DDI/CC: 243455087',
      phone: '+57 300 184 597',
      email: 'aramos@example.org',
      address: 'Las Delicias',
      age: 35,
      gender: 'Masculino',
      affiliationDate: '23/07/2021',
      sisben: 'Nivel II',
      eps: 'SaludVida',
      participation: 'Consejo de vigilancia',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=12',
      avatarThumb: 'https://i.pravatar.cc/120?img=12'
    },
    {
      id: 'blanca',
      name: 'Blanca Ruiz',
      document: 'DDI/CC: 18877994',
      phone: '+57 319 884 225',
      email: 'bruiz@example.org',
      address: 'Santander',
      age: 42,
      gender: 'Femenino',
      affiliationDate: '15/05/2020',
      sisben: 'Nivel III',
      eps: 'Coosalud',
      participation: 'Mesa de trabajo territorial',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=47',
      avatarThumb: 'https://i.pravatar.cc/120?img=47'
    },
    {
      id: 'marcela',
      name: 'Marcela Fuentes',
      document: 'DDI/CC: 28505967',
      phone: '+57 315 112 048',
      email: 'mfuentes@example.org',
      address: 'Zacatín',
      age: 39,
      gender: 'Femenino',
      affiliationDate: '02/11/2018',
      sisben: 'Nivel I',
      eps: 'Nueva EPS',
      participation: 'Red de emprendimiento comunitario',
      status: 'inactivo',
      avatarLarge: 'https://i.pravatar.cc/200?img=32',
      avatarThumb: 'https://i.pravatar.cc/120?img=32'
    },
    {
      id: 'alejandra',
      name: 'Alejandra Arroyo',
      document: 'DDI/CC: 46960122',
      phone: '+57 322 884 990',
      email: 'aarroyo@example.org',
      address: 'Buenos Aires',
      age: 29,
      gender: 'Femenino',
      affiliationDate: '07/08/2023',
      sisben: 'Nivel II',
      eps: 'Compensar',
      participation: 'Programa de liderazgo juvenil',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=54',
      avatarThumb: 'https://i.pravatar.cc/120?img=54'
    },
     {
      id: 'albert',
      name: 'Albert Ramos',
      document: 'DDI/CC: 243455087',
      phone: '+57 300 184 597',
      email: 'aramos@example.org',
      address: 'Las Delicias',
      age: 35,
      gender: 'Masculino',
      affiliationDate: '23/07/2021',
      sisben: 'Nivel II',
      eps: 'SaludVida',
      participation: 'Consejo de vigilancia',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=12',
      avatarThumb: 'https://i.pravatar.cc/120?img=12'
    },
     {
      id: 'albert',
      name: 'Albert Ramos',
      document: 'DDI/CC: 243455087',
      phone: '+57 300 184 597',
      email: 'aramos@example.org',
      address: 'Las Delicias',
      age: 35,
      gender: 'Masculino',
      affiliationDate: '23/07/2021',
      sisben: 'Nivel II',
      eps: 'SaludVida',
      participation: 'Consejo de vigilancia',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=12',
      avatarThumb: 'https://i.pravatar.cc/120?img=12'
    },
     {
      id: 'albert',
      name: 'Albert Ramos',
      document: 'DDI/CC: 243455087',
      phone: '+57 300 184 597',
      email: 'aramos@example.org',
      address: 'Las Delicias',
      age: 35,
      gender: 'Masculino',
      affiliationDate: '23/07/2021',
      sisben: 'Nivel II',
      eps: 'SaludVida',
      participation: 'Consejo de vigilancia',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=12',
      avatarThumb: 'https://i.pravatar.cc/120?img=12'
    },
    {
      id: 'juliana',
      name: 'Juliana Ortiz',
      document: 'DDI/CC: 31095879',
      phone: '+57 210 778 542',
      email: 'jortiz@example.org',
      address: 'Aranjuez',
      age: 33,
      gender: 'Femenino',
      affiliationDate: '16/12/2021',
      sisben: 'Nivel II',
      eps: 'Savia Salud',
      participation: 'Escuela de formadores',
      status: 'activo',
      avatarLarge: 'https://i.pravatar.cc/200?img=5',
      avatarThumb: 'https://i.pravatar.cc/120?img=5'
    },
    {
      id: 'miguel',
      name: 'Miguel Pardo',
      document: 'DDI/CC: 28440639',
      phone: '+57 311 446 901',
      email: 'mpardo@example.org',
      address: 'El Placer',
      age: 41,
      gender: 'Masculino',
      affiliationDate: '30/09/2019',
      sisben: 'Nivel III',
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

  const hostLayout = document.querySelector('.layout-top');
  const hostAside = document.querySelector('.humana-aside');
  const HIDDEN_FLAG = 'afiliadosHideState';
  const PREV_COLLAPSED = 'afiliadosPrevCollapsed';
  const HOST_ASIDE_HIDDEN_CLASS = 'host-aside-hidden';
  const HOST_ASIDE_MANUAL_CLASS = 'is-hidden';

  const hideHostAside = () => {
    if (!hostLayout || !hostAside) {
      return;
    }

    if (hostAside.dataset[HIDDEN_FLAG] === 'active') {
      return;
    }

    hostAside.dataset[PREV_COLLAPSED] = hostAside.classList.contains('collapsed') ? 'true' : 'false';
    hostAside.classList.remove('collapsed');
    hostAside.classList.add(HOST_ASIDE_MANUAL_CLASS);
    hostLayout.classList.add(HOST_ASIDE_HIDDEN_CLASS);
    hostAside.dataset[HIDDEN_FLAG] = 'active';
  };

  const showHostAside = () => {
    if (!hostLayout || !hostAside) {
      return;
    }

    if (hostAside.dataset[HIDDEN_FLAG] !== 'active') {
      return;
    }

    hostAside.classList.remove(HOST_ASIDE_MANUAL_CLASS);
    hostLayout.classList.remove(HOST_ASIDE_HIDDEN_CLASS);

    const shouldRestoreCollapsed = hostAside.dataset[PREV_COLLAPSED] === 'true';
    delete hostAside.dataset[HIDDEN_FLAG];
    delete hostAside.dataset[PREV_COLLAPSED];

    if (shouldRestoreCollapsed) {
      hostAside.classList.add('collapsed');
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
      row.dataset.sisben = affiliate.sisben;
      row.dataset.eps = affiliate.eps;
      row.dataset.participation = affiliate.participation;
      row.dataset.status = affiliate.status;
      row.dataset.avatar = affiliate.avatarLarge;

      row.tabIndex = 0;
      row.setAttribute('role', 'button');
      row.setAttribute('aria-label', `Ver detalle de ${affiliate.name}`);

      const statusLabel = formatStatus(affiliate.status);
      const isInactive = (affiliate.status || '').toLowerCase() === 'inactivo';
      const statusMarkup = statusLabel ? ` ${statusLabel}` : '';

      row.innerHTML = `
        <td>
          <div class="member-cell">
            <span class="member-avatar"><img src="${affiliate.avatarThumb}" alt="Foto de ${affiliate.name}"></span>
            <div class="member-info">
              <strong>${affiliate.name}</strong>
              <span>${affiliate.document} · Tel. ${affiliate.phone}</span>
            
            </div>
          </div>
        </td>
        <td data-field="barrio">${affiliate.address}</td>
        <td data-field="edad">${affiliate.age}</td>
        <td data-field="afiliacion">${affiliate.affiliationDate}</td>
        <td data-field="sexo">${affiliate.gender}</td>
        <td data-field="sisben">${affiliate.sisben}</td>
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
      sisben: panel.querySelector('[data-detail="sisben"]'),
      eps: panel.querySelector('[data-detail="eps"]'),
      participation: panel.querySelector('[data-detail="participation"]')
    };

    let activeRow = null;

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
        sisben,
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

      if (fields.sisben) {
        fields.sisben.textContent = sisben || 'N/D';
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
