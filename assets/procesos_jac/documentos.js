(() => {
	const layout = document.querySelector('[data-js="documentos-layout"]');
	const modal = document.querySelector('[data-js="documentos-modal"]');
	if (!layout) return;

	const elements = {
		search: layout.querySelector('[data-js="documentos-search"]'),
		tbody: layout.querySelector('[data-js="documentos-tbody"]'),
		count: layout.querySelector('[data-js="documentos-count"]'),
		tabs: layout.querySelectorAll('.documentos-tab'),
		newBtn: layout.querySelector('[data-js="new-document"]'),
		metrics: {
			total: layout.querySelector('[data-js="documentos-metric-total"]'),
			active: layout.querySelector('[data-js="documentos-metric-active"]'),
			expired: layout.querySelector('[data-js="documentos-metric-expired"]')
		},
		modal,
		modalClose: modal?.querySelector('[data-js="documentos-modal-close"]'),
		modalCancel: modal?.querySelector('[data-js="documentos-modal-cancel"]'),
		form: modal?.querySelector('[data-js="documentos-form"]')
	};

	const state = {
		filter: 'todos',
		search: '',
		documents: [
			{
				id: 'DOC-001',
				type: 'libros',
				name: 'Libro de afiliados 2024',
				entity: 'Secretaría General',
				notes: 'Responsable: Ana Torres',
				date: '15 feb 2025',
				status: 'vigente'
			},
			{
				id: 'DOC-002',
				type: 'actas',
				name: 'Acta Asamblea Extraordinaria 05-2025',
				entity: 'Asamblea General',
				notes: 'Aprobada en sesión del 22 de marzo',
				date: '22 mar 2025',
				status: 'vigente'
			},
			{
				id: 'DOC-003',
				type: 'estatutos',
				name: 'Estatutos actualizados 2025',
				entity: 'Consejo Directivo',
				notes: 'Versión registrada ante Personería',
				date: '12 jun 2025',
				status: 'vigente'
			},
			{
				id: 'DOC-004',
				type: 'reglamentos',
				name: 'Reglamento sala comunitaria',
				entity: 'Comité de Convivencia',
				notes: 'Revisión anual programada',
				date: '04 may 2024',
				status: 'vigente'
			},
			{
				id: 'DOC-005',
				type: 'certificados',
				name: 'Certificación proyecto Huertas 2024',
				entity: 'Comité de Proyectos',
				notes: 'Emitido por Secretaría de Infraestructura',
				date: '17 dic 2024',
				status: 'vigente'
			},
			{
				id: 'DOC-006',
				type: 'contratos',
				name: 'Contrato mantenimiento luminarias',
				entity: 'Comité de Infraestructura',
				notes: 'Proveedor: Luz Urbana S.A.',
				date: '08 ago 2023',
				status: 'vencido'
			},
			{
				id: 'DOC-007',
				type: 'adjuntos',
				name: 'Soportes capacitación febrero',
				entity: 'Comité de Formación',
				notes: 'Memorias y asistencia digital',
				date: '03 mar 2025',
				status: 'vigente'
			},
			{
				id: 'DOC-008',
				type: 'actas',
				name: 'Acta Junta Directiva 09-2024',
				entity: 'Junta Directiva',
				notes: 'Pendiente firma de tesorería',
				date: '29 sep 2024',
				status: 'vencido'
			}
		]
	};

	const iconMap = {
		libros: 'ri-book-line',
		actas: 'ri-file-list-3-line',
		estatutos: 'ri-book-2-line',
		reglamentos: 'ri-article-line',
		certificados: 'ri-award-line',
		contratos: 'ri-file-text-line',
		adjuntos: 'ri-attachment-line'
	};

	const typeLabels = {
		libros: 'Libro',
		actas: 'Acta',
		estatutos: 'Estatuto',
		reglamentos: 'Reglamento',
		certificados: 'Certificado',
		contratos: 'Contrato',
		adjuntos: 'Adjunto'
	};

	const statusLabels = {
		vigente: 'Vigente',
		vencido: 'Vencido'
	};

	const simulateAction = (message) => {
		console.info(`[Documentos JAC] ${message}`);
	};

	const normalizeValue = (value, fallback = '') => {
		return value && value.trim() ? value.trim() : fallback;
	};

	const formatDate = (value) => {
		if (!value) return 'Sin fecha';
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return value;
		return new Intl.DateTimeFormat('es-CO', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		})
			.format(parsed)
			.replace(/\./g, '');
	};

	const generateDocumentId = () => {
		const numericIds = state.documents
			.map((doc) => parseInt((doc.id || '').split('-')[1], 10))
			.filter((value) => Number.isFinite(value));
		const nextId = (numericIds.length ? Math.max(...numericIds) : 0) + 1;
		return `DOC-${String(nextId).padStart(3, '0')}`;
	};

	const createDocumentFromPayload = (payload) => ({
		id: generateDocumentId(),
		type: payload.docType || 'adjuntos',
		name: normalizeValue(payload.name, 'Documento sin título'),
		entity: normalizeValue(payload.entity, 'Sin comité asignado'),
		notes: normalizeValue(payload.notes || ''),
		date: formatDate(payload.date),
		status: payload.status || 'vigente'
	});

	const matchesFilter = (doc) => {
		if (state.filter === 'todos') return true;
		return doc.type === state.filter;
	};

	const matchesSearch = (doc) => {
		const query = state.search.trim().toLowerCase();
		if (!query) return true;
		const typeText = typeLabels[doc.type] || doc.type;
		const statusText = statusLabels[doc.status] || doc.status;
		const searchable = `${doc.name} ${doc.entity} ${doc.notes || ''} ${doc.id} ${typeText} ${statusText}`.toLowerCase();
		return searchable.includes(query);
	};

	const getFilteredDocuments = () => {
		return state.documents.filter((doc) => matchesFilter(doc) && matchesSearch(doc));
	};

	const renderMetrics = () => {
		const totals = state.documents.reduce(
			(acc, doc) => {
				acc.total += 1;
				if (doc.status === 'vigente') acc.active += 1;
				if (doc.status === 'vencido') acc.expired += 1;
				return acc;
			},
			{ total: 0, active: 0, expired: 0 }
		);

		if (elements.metrics.total) elements.metrics.total.textContent = totals.total;
		if (elements.metrics.active) elements.metrics.active.textContent = totals.active;
		if (elements.metrics.expired) elements.metrics.expired.textContent = totals.expired;
	};

	const renderTable = () => {
		if (!elements.tbody) return;
		const rows = getFilteredDocuments();
		elements.tbody.innerHTML = '';

		if (!rows.length) {
			const emptyRow = document.createElement('tr');
			emptyRow.className = 'documentos-empty';
			const cell = document.createElement('td');
			cell.colSpan = 5;
			cell.textContent = 'No hay documentos para este filtro.';
			emptyRow.appendChild(cell);
			elements.tbody.appendChild(emptyRow);
		} else {
			const fragment = document.createDocumentFragment();
			rows.forEach((doc) => {
				const tr = document.createElement('tr');

				const infoCell = document.createElement('td');
				const infoWrapper = document.createElement('div');
				infoWrapper.className = 'documentos-doc';

				const iconWrap = document.createElement('span');
				iconWrap.className = 'documentos-doc__icon';
				const icon = document.createElement('i');
				icon.className = iconMap[doc.type] || 'ri-file-line';
				icon.setAttribute('aria-hidden', 'true');
				iconWrap.appendChild(icon);

				const infoContent = document.createElement('div');
				const name = document.createElement('p');
				name.className = 'documentos-doc__name';
				name.textContent = doc.name;
				const meta = document.createElement('span');
				meta.className = 'documentos-doc__meta';
				meta.textContent = `${typeLabels[doc.type] || doc.type} · ${doc.id}`;
				infoContent.append(name, meta);

				infoWrapper.append(iconWrap, infoContent);
				infoCell.appendChild(infoWrapper);
				tr.appendChild(infoCell);

				const entityCell = document.createElement('td');
				const entityName = document.createElement('p');
				entityName.className = 'documentos-entity__name';
				entityName.textContent = doc.entity;
				entityCell.appendChild(entityName);
				if (doc.notes) {
					const entityMeta = document.createElement('span');
					entityMeta.className = 'documentos-entity__meta';
					entityMeta.textContent = doc.notes;
					entityCell.appendChild(entityMeta);
				}
				tr.appendChild(entityCell);

				const dateCell = document.createElement('td');
				const dateBadge = document.createElement('span');
				dateBadge.className = 'documentos-date';
				dateBadge.textContent = doc.date;
				dateCell.appendChild(dateBadge);
				tr.appendChild(dateCell);

				const statusCell = document.createElement('td');
				const status = document.createElement('span');
				status.className = `documentos-status ${doc.status}`;
				status.textContent = statusLabels[doc.status] || doc.status;
				statusCell.appendChild(status);
				tr.appendChild(statusCell);

				const actionsCell = document.createElement('td');
				const actions = document.createElement('div');
				actions.className = 'documentos-actions';

				const viewBtn = document.createElement('button');
				viewBtn.type = 'button';
				viewBtn.className = 'documentos-action';
				viewBtn.title = `Ver ${doc.name}`;
				viewBtn.setAttribute('aria-label', `Ver ${doc.name}`);
				const viewIcon = document.createElement('i');
				viewIcon.className = 'ri-external-link-line';
				viewIcon.setAttribute('aria-hidden', 'true');
				viewBtn.appendChild(viewIcon);
				viewBtn.addEventListener('click', () => {
					simulateAction(`Abrir documento ${doc.id}`);
				});

				const downloadBtn = document.createElement('button');
				downloadBtn.type = 'button';
				downloadBtn.className = 'documentos-action';
				downloadBtn.title = `Descargar ${doc.name}`;
				downloadBtn.setAttribute('aria-label', `Descargar ${doc.name}`);
				const downloadIcon = document.createElement('i');
				downloadIcon.className = 'ri-download-2-line';
				downloadIcon.setAttribute('aria-hidden', 'true');
				downloadBtn.appendChild(downloadIcon);
				downloadBtn.addEventListener('click', () => {
					simulateAction(`Descargar documento ${doc.id}`);
				});

				actions.append(viewBtn, downloadBtn);
				actionsCell.appendChild(actions);
				tr.appendChild(actionsCell);

				fragment.appendChild(tr);
			});
			elements.tbody.appendChild(fragment);
		}

		if (elements.count) {
			const total = rows.length;
			elements.count.textContent = `${total} documento${total === 1 ? '' : 's'}`;
		}
	};

	const bindSearch = () => {
		elements.search?.addEventListener('input', (event) => {
			state.search = event.target.value || '';
			renderTable();
		});
	};

	const bindTabs = () => {
		elements.tabs.forEach((tab) => {
			tab.addEventListener('click', () => {
				elements.tabs.forEach((node) => node.classList.remove('is-active'));
				tab.classList.add('is-active');
				state.filter = tab.dataset.filter || 'todos';
				renderTable();
			});
		});
	};

	const openModal = () => {
		if (!elements.modal) return;
		elements.modal.hidden = false;
		document.body.style.overflow = 'hidden';
	};

	const closeModal = () => {
		if (!elements.modal) return;
		elements.modal.hidden = true;
		document.body.style.overflow = '';
		elements.form?.reset();
	};

	const bindModal = () => {
		elements.newBtn?.addEventListener('click', openModal);
		elements.modalClose?.addEventListener('click', closeModal);
		elements.modalCancel?.addEventListener('click', closeModal);
		elements.modal?.addEventListener('click', (event) => {
			if (event.target === elements.modal) closeModal();
		});
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !elements.modal?.hidden) {
				closeModal();
			}
		});
		elements.form?.addEventListener('submit', (event) => {
			event.preventDefault();
			const formData = new FormData(elements.form);
			const payload = Object.fromEntries(formData.entries());
			const newDocument = createDocumentFromPayload(payload);
			state.documents.unshift(newDocument);
			simulateAction(`Documento registrado: ${newDocument.id}`);
			renderMetrics();
			renderTable();
			closeModal();
		});
	};

	const init = () => {
		renderMetrics();
		renderTable();
		bindSearch();
		bindTabs();
		bindModal();
	};

	init();
})();
