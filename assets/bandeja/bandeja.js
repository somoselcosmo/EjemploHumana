(() => {
	const shell = document.querySelector('[data-js="inbox-shell"]');
	if (!shell) return;

	const elements = {
		list: shell.querySelector('[data-js="inbox-list"]'),
		tabs: shell.querySelectorAll('.inbox-tab'),
		search: shell.querySelector('[data-js="inbox-search"]'),
		quickFilters: shell.querySelectorAll('[data-js="inbox-quickfilters"] .inbox-chip'),
		metrics: shell.querySelectorAll('[data-metric]'),
		newMessage: shell.querySelector('[data-js="new-message"]'),
		markRead: shell.querySelector('[data-js="mark-read"]'),
		sync: shell.querySelector('[data-js="sync"]')
	};

	const inboxState = {
		filter: 'todos',
		search: '',
		quick: new Set(),
		items: [
			{
				id: 'BX-001',
				category: 'votaciones',
				icon: 'ri-ballot-line',
				title: 'Votación Abierta – Comité de Convivencia',
				description: 'Tienes un voto pendiente. Planchas inscritas: 3.',
				timestamp: 'Hoy · 9:12 AM',
				tag: 'Nuevo',
				tagTone: 'is-new',
				meta: ['Plancha 3 lidera', 'Cierra en 18 h'],
				quick: ['nuevo', 'importante']
			},
			{
				id: 'BX-002',
				category: 'documentos',
				icon: 'ri-file-paper-line',
				title: 'Nuevo Acta de Asamblea',
				description: 'Disponible el Acta #024 · Marzo 2025.',
				timestamp: 'Ayer · 7:10 PM',
				tag: 'PDF',
				meta: ['Descargar', 'Firmada digitalmente'],
				quick: ['verificado']
			},
			{
				id: 'BX-003',
				category: 'pagos',
				icon: 'ri-coin-line',
				title: 'Has recibido 25 CCC',
				description: 'Participación en Proyecto Ambiental JAC Providencia.',
				timestamp: 'Hoy · 3:01 AM',
				tag: 'Verificado',
				meta: ['Verificada en blockchain'],
				quick: ['verificado']
			},
			{
				id: 'BX-004',
				category: 'mensajes',
				icon: 'ri-user-line',
				title: 'El ingeniero Juan Pérez subió un render nuevo',
				description: 'Proyecto Parque Infantil JAC Centenario.',
				timestamp: 'Mar · 5:49 PM',
				meta: ['Proyecto urbano'],
				quick: []
			},
			{
				id: 'BX-005',
				category: 'mensajes',
				icon: 'ri-mail-line',
				title: 'El Presidente de la JAC te envió un mensaje',
				description: 'Completa la actualización del censo.',
				timestamp: 'Mié · 3:22 PM',
				tag: 'Importante',
				tagTone: 'is-new',
				quick: ['importante']
			},
			{
				id: 'BX-006',
				category: 'alertas',
				icon: 'ri-error-warning-line',
				title: 'Tu documento de identidad está por expirar',
				description: 'Actualiza la información antes del 30 de marzo.',
				timestamp: 'Mar · 3:00 AM',
				tag: 'Alerta',
				quick: ['importante']
			},
			{
				id: 'BX-007',
				category: 'jac',
				icon: 'ri-shield-keyhole-line',
				title: 'Se actualizó el reglamento interno',
				description: 'Disponible versión digital firmada.',
				timestamp: 'Lun · 10:45 AM',
				quick: ['verificado']
			}
		]
	};

	const simulateAction = (message) => {
		console.info(`[Bandeja JAC] ${message}`);
	};

	const matchesQuickFilters = (item) => {
		if (!inboxState.quick.size) return true;
		return Array.from(inboxState.quick).every((tag) => item.quick?.includes(tag));
	};

	const getFilteredItems = () => {
		const query = inboxState.search.trim().toLowerCase();
		return inboxState.items.filter((item) => {
			const categoryMatch = inboxState.filter === 'todos' ? true : item.category === inboxState.filter;
			if (!categoryMatch) return false;
			if (!matchesQuickFilters(item)) return false;
			if (!query) return true;
			const haystack = `${item.title} ${item.description} ${item.meta?.join(' ')}`.toLowerCase();
			return haystack.includes(query);
		});
	};

	const renderList = () => {
		if (!elements.list) return;
		const rows = getFilteredItems();
		const fragment = document.createDocumentFragment();
		rows.forEach((item) => {
			const li = document.createElement('li');
			li.className = 'inbox-card';
			li.innerHTML = `
				<div class="inbox-card__icon"><i class="${item.icon}" aria-hidden="true"></i></div>
				<div class="inbox-card__body">
					<div class="inbox-card__header">
						<h3 class="inbox-card__title">${item.title}</h3>
					</div>
					<p>${item.description}</p>
					<div class="inbox-card__meta">
						${item.meta?.map((meta) => `<span>${meta}</span>`).join('') || ''}
						${item.tag ? `<span class="inbox-badge ${item.tagTone || ''}">${item.tag}</span>` : ''}
						<span class="inbox-card__time">${item.timestamp}</span>
					</div>
				</div>
			`;
			fragment.appendChild(li);
		});
		elements.list.innerHTML = '';
		elements.list.appendChild(fragment);
	};

	const updateMetrics = () => {
		const pending = inboxState.items.length;
		const votes = inboxState.items.filter((item) => item.category === 'votaciones').length;
		const payments = inboxState.items.filter((item) => item.category === 'pagos').length;
		shell.querySelector('[data-metric="pending"]').textContent = pending;
		shell.querySelector('[data-metric="votes"]').textContent = votes;
		shell.querySelector('[data-metric="payments"]').textContent = payments;
	};

	const bindTabs = () => {
		elements.tabs.forEach((tab) => {
			tab.addEventListener('click', () => {
				elements.tabs.forEach((node) => node.classList.remove('is-active'));
				tab.classList.add('is-active');
				inboxState.filter = tab.dataset.filter || 'todos';
				renderList();
			});
		});
	};

	const bindSearch = () => {
		if (!elements.search) return;
		elements.search.addEventListener('input', (event) => {
			inboxState.search = event.target.value || '';
			renderList();
		});
	};

	const toggleQuickFilter = (chip) => {
		const key = chip.dataset.quick;
		if (!key) return;
		if (inboxState.quick.has(key)) {
			inboxState.quick.delete(key);
			chip.classList.remove('is-active');
		} else {
			inboxState.quick.add(key);
			chip.classList.add('is-active');
		}
		renderList();
	};

	const bindQuickFilters = () => {
		elements.quickFilters.forEach((chip) => {
			chip.addEventListener('click', () => toggleQuickFilter(chip));
		});
	};

	const bindCommands = () => {
		elements.newMessage?.addEventListener('click', () => simulateAction('Nuevo mensaje (prototipo)'));
		elements.markRead?.addEventListener('click', () => simulateAction('Marcar como leído (prototipo)'));
		elements.sync?.addEventListener('click', () => {
			document.body.classList.add('is-syncing');
			setTimeout(() => {
				document.body.classList.remove('is-syncing');
				simulateAction('Sincronización completada');
			}, 650);
		});
	};

	const init = () => {
		updateMetrics();
		renderList();
		bindTabs();
		bindSearch();
		bindQuickFilters();
		bindCommands();
	};

	init();
})();
