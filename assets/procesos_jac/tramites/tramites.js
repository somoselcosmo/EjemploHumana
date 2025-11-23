(() => {
	const layout = document.querySelector('[data-js="tramites-layout"]');
	if (!layout) return;

	const elements = {
		search: layout.querySelector('[data-js="tramites-search"]'),
		list: layout.querySelector('[data-js="tramites-list"]'),
		tabs: layout.querySelectorAll('.tramites-tab'),
		cards: layout.querySelectorAll('.tramites-card'),
		newBtn: layout.querySelector('[data-js="tramites-new"]')
	};

	const tramitesState = {
		filter: 'todos',
		category: 'todos',
		search: '',
		items: [
			{
				id: 'TR-001',
				title: 'Actualización de Datos',
				status: 'En proceso de revisión por la JAC',
				state: 'todos',
				category: 'documentos',
				time: 'Hoy · 11:20'
			},
			{
				id: 'TR-002',
				title: 'Solicitud de Préstamo',
				status: 'Documentación enviada por el solicitante',
				state: 'aprobados',
				category: 'financieros',
				time: 'Hoy · 11:20'
			},
			{
				id: 'TR-003',
				title: 'Constancia de Residencia',
				status: 'Pendiente confirmación de domicilio',
				state: 'todos',
				category: 'documentos',
				time: 'Ayer · 4:35'
			},
			{
				id: 'TR-004',
				title: 'Emisión de Certificado',
				status: 'Certificado en trámite de generación',
				state: 'todos',
				category: 'certificados',
				time: 'Ayer · 2:15'
			},
			{
				id: 'TR-005',
				title: 'Registro de Proyecto Comunitario',
				status: 'Esperando aprobación de comité',
				state: 'todos',
				category: 'proyectos',
				time: 'Hace 2 días'
			},
			{
				id: 'TR-006',
				title: 'Afiliación Nuevo Integrante',
				status: 'Documento devuelto, información incompleta',
				state: 'rechazados',
				category: 'afiliacion',
				time: 'Hace 4 días'
			}
		]
	};

	const simulateAction = (message) => {
		console.info(`[Trámites JAC] ${message}`);
	};

	const matchesState = (item) => {
		if (tramitesState.filter === 'todos') return true;
		return item.state === tramitesState.filter;
	};

	const matchesCategory = (item) => {
		if (tramitesState.category === 'todos') return true;
		return item.category === tramitesState.category;
	};

	const getFilteredItems = () => {
		const query = tramitesState.search.trim().toLowerCase();
		return tramitesState.items.filter((item) => {
			if (!matchesState(item)) return false;
			if (!matchesCategory(item)) return false;
			if (!query) return true;
			return `${item.title} ${item.status}`.toLowerCase().includes(query);
		});
	};

	const renderList = () => {
		if (!elements.list) return;
		const rows = getFilteredItems();
		const fragment = document.createDocumentFragment();
		rows.forEach((item) => {
			const li = document.createElement('li');
			li.className = 'tramites-item';
			li.innerHTML = `
				<div class="tramites-item__body">
					<h3 class="tramites-item__title">${item.title}</h3>
					<p class="tramites-item__status">${item.status}</p>
				</div>
				<span class="tramites-item__time"><i class="ri-time-line" aria-hidden="true"></i>${item.time}</span>
			`;
			fragment.appendChild(li);
		});
		elements.list.innerHTML = '';
		elements.list.appendChild(fragment);
	};

	const bindSearch = () => {
		elements.search?.addEventListener('input', (event) => {
			tramitesState.search = event.target.value || '';
			renderList();
		});
	};

	const bindTabs = () => {
		elements.tabs.forEach((tab) => {
			tab.addEventListener('click', () => {
				elements.tabs.forEach((node) => node.classList.remove('is-active'));
				tab.classList.add('is-active');
				tramitesState.filter = tab.dataset.filter || 'todos';
				renderList();
			});
		});
	};

	const bindCards = () => {
		elements.cards.forEach((card) => {
			card.addEventListener('click', () => {
				elements.cards.forEach((node) => node.classList.remove('is-active'));
				card.classList.add('is-active');
				tramitesState.category = card.dataset.category || 'todos';
				renderList();
			});
		});
	};

	const bindActions = () => {
		elements.newBtn?.addEventListener('click', () => {
			simulateAction('Crear nuevo trámite (prototipo)');
		});
	};

	const init = () => {
		renderList();
		bindSearch();
		bindTabs();
		bindCards();
		bindActions();
	};

	init();
})();
