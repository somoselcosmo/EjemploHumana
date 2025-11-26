(() => {
	const layout = document.querySelector('[data-js="documentos-layout"]');
	const modal = document.querySelector('[data-js="documentos-modal"]');
	if (!layout) return;

	const elements = {
		search: layout.querySelector('[data-js="documentos-search"]'),
		tbody: layout.querySelector('[data-js="documentos-tbody"]'),
		tabs: layout.querySelectorAll('.documentos-tab'),
		newBtn: layout.querySelector('[data-js="new-document"]'),
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
				icon: 'ri-book-line',
				name: 'Libro de Afiliados',
				entity: 'Salado Bonito',
				date: '30 de 2025',
				status: 'vigente'
			},
			{
				id: 'DOC-002',
				type: 'actas',
				icon: 'ri-file-list-3-line',
				name: 'Acta n° 2025-004',
				entity: 'Comunicaciones',
				date: '2025-0024',
				status: 'vencido'
			},
			{
				id: 'DOC-003',
				type: 'estatutos',
				icon: 'ri-book-2-line',
				name: 'Estatutos',
				entity: '—',
				date: '31 abr.2024',
				status: 'vigente'
			},
			{
				id: 'DOC-004',
				type: 'reglamentos',
				icon: 'ri-article-line',
				name: 'Resolución n° 015-2024',
				entity: 'Vigente',
				date: '29 feb.024',
				status: 'vigente'
			},
			{
				id: 'DOC-005',
				type: 'contratos',
				icon: 'ri-file-text-line',
				name: 'Contritado de Residencia',
				entity: '—',
				date: '31 oct.2025',
				status: 'vigente'
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
		adjuntos: 'ri-attachment-2'
	};

	const matchesFilter = (doc) => {
		if (state.filter === 'todos') return true;
		return doc.type === state.filter;
	};

	const matchesSearch = (doc) => {
		const query = state.search.trim().toLowerCase();
		if (!query) return true;
		const searchable = `${doc.name} ${doc.entity} ${doc.date} ${doc.id}`.toLowerCase();
		return searchable.includes(query);
	};

	const getFilteredDocuments = () => {
		return state.documents.filter((doc) => matchesFilter(doc) && matchesSearch(doc));
	};

	const renderTable = () => {
		if (!elements.tbody) return;
		const rows = getFilteredDocuments();
		const fragment = document.createDocumentFragment();
		
		rows.forEach((doc) => {
			const tr = document.createElement('tr');
			const icon = iconMap[doc.type] || 'ri-file-line';
			
			tr.innerHTML = `
				<td>
					<span class="documentos-type-icon">
						<i class="${icon}" aria-hidden="true"></i>
						<span>${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</span>
					</span>
				</td>
				<td>${doc.name}</td>
				<td>${doc.entity}</td>
				<td>${doc.date}</td>
				<td><span class="documentos-estado ${doc.status}">${doc.status}</span></td>
				<td>
					<div class="documentos-actions-cell">
						<button class="documentos-action-btn" type="button" title="Más opciones" aria-label="Más opciones para ${doc.name}">
							<i class="ri-more-2-fill"></i>
						</button>
					</div>
				</td>
			`;
			
			fragment.appendChild(tr);
		});

		elements.tbody.innerHTML = '';
		elements.tbody.appendChild(fragment);
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
				elements.tabs.forEach((t) => t.classList.remove('is-active'));
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
			console.info('[Documentos JAC] Guardar documento (prototipo):', payload);
			closeModal();
		});
	};

	const init = () => {
		renderTable();
		bindSearch();
		bindTabs();
		bindModal();
	};

	init();
})();
