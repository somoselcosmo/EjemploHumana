(() => {
	const layout = document.querySelector('[data-js="acts-layout"]');
	if (!layout) return;

	const elements = {
		metrics: {
			sessions: layout.querySelector('[data-metric="sessions"]'),
			certificates: layout.querySelector('[data-metric="certificates"]'),
			status: layout.querySelector('[data-metric="status"]'),
			note: layout.querySelector('[data-metric="status-note"]')
		},
		search: layout.querySelector('[data-js="acts-search"]'),
		tabs: layout.querySelectorAll('[data-acts-tab]'),
		tbody: layout.querySelector('[data-js="acts-body"]'),
		count: layout.querySelector('[data-js="acts-count"]'),
		newMinute: layout.querySelector('[data-js="new-minute"]'),
		generateCert: layout.querySelector('[data-js="generate-cert"]'),
		refresh: layout.querySelector('[data-js="refresh"]'),
		sign: layout.querySelector('[data-js="sign"]'),
		signatureList: layout.querySelector('[data-js="signature-list"]'),
		backHome: layout.querySelector('[data-js="back-home"]')
	};

	const actsState = {
		summary: {
			sessions: 2,
			certificates: 5,
			status: 'Aprobada',
			note: 'Actualizado hace 2 días'
		},
		filters: {
			tab: 'todas',
			search: ''
		},
		entries: [
			{
				number: 'ACT-0042',
				date: '2025-06-10',
				type: 'ordinarias',
				topic: 'Ordinaria',
				decision: { label: 'Ordinaria', approved: true },
				status: { key: 'aprobada', label: 'Aprobada' }
			},
			{
				number: 'ACT-0041',
				date: '2025-04-23',
				type: 'ordinarias',
				topic: 'Extraordinaria',
				decision: { label: 'Extraordinaria', approved: true },
				status: { key: 'revision', label: 'En revisión' }
			},
			{
				number: 'ACT-0040',
				date: '2025-04-19',
				type: 'extraordinarias',
				topic: 'Agenda social',
				decision: { label: 'Agenda social', approved: true },
				status: { key: 'aprobada', label: 'Aprobada' }
			},
			{
				number: 'ACT-0038',
				date: '2025-03-15',
				type: 'ordinarias',
				topic: 'Aprobación presupuestal',
				decision: { label: 'Presupuesto', approved: false },
				status: { key: 'pendiente', label: 'Por aprobar' }
			},
			{
				number: 'ACT-0035',
				date: '2025-02-28',
				type: 'extraordinarias',
				topic: 'Nombramiento de proveedores',
				decision: { label: 'Nombramiento', approved: true },
				status: { key: 'revision', label: 'En revisión' }
			}
		],
		signatures: [
			{ role: 'Presidente', detail: 'Firma decisiones hasta $5.300.000', done: true },
			{ role: 'Tesorería', detail: 'Obligatoriedad en todos los sumarios', done: true },
			{ role: 'Fiscal', detail: 'Revisiones normativas con RI 2/0', done: false },
			{ role: 'Secretario', detail: 'Nombre curricular', done: true }
		]
	};

	const STATUS_TONE = {
		aprobada: 'acts-pill--success',
		revision: 'acts-pill--warning',
		pendiente: 'acts-pill--info'
	};

	const formatDate = (iso) => {
		const formatter = new Intl.DateTimeFormat('es-CO', {
			day: '2-digit', month: 'short', year: 'numeric'
		});
		const date = new Date(iso);
		return Number.isNaN(date.getTime()) ? iso : formatter.format(date);
	};

	const renderMetrics = () => {
		const { summary } = actsState;
		elements.metrics.sessions && (elements.metrics.sessions.textContent = summary.sessions);
		elements.metrics.certificates && (elements.metrics.certificates.textContent = summary.certificates);
		elements.metrics.status && (elements.metrics.status.textContent = summary.status);
		elements.metrics.note && (elements.metrics.note.textContent = summary.note);
	};

	const renderSignatures = () => {
		if (!elements.signatureList) return;
		const fragment = document.createDocumentFragment();
		actsState.signatures.forEach((item) => {
			const li = document.createElement('li');
			li.className = 'acts-signatures__item';
			if (item.done) li.classList.add('is-done');
			li.innerHTML = `
				<span class="acts-signatures__check"><i class="ri-check-line"></i></span>
				<div>
					<p class="acts-signatures__role">${item.role}</p>
					<p class="acts-signatures__detail">${item.detail}</p>
				</div>
				<i class="ri-check-line acts-signatures__status" aria-hidden="true"></i>
			`;
			fragment.appendChild(li);
		});
		elements.signatureList.innerHTML = '';
		elements.signatureList.appendChild(fragment);
	};

	const getFilteredEntries = () => {
		const { tab, search } = actsState.filters;
		const query = search.trim().toLowerCase();
		return actsState.entries.filter((entry) => {
			if (tab !== 'todas' && entry.type !== tab) return false;
			if (!query) return true;
			const haystack = `${entry.number} ${entry.topic} ${entry.decision.label}`.toLowerCase();
			return haystack.includes(query);
		});
	};

	const renderTable = () => {
		if (!elements.tbody) return;
		const rows = getFilteredEntries();
		const fragment = document.createDocumentFragment();
		rows.forEach((entry) => {
			const tr = document.createElement('tr');
			const decisionIcon = entry.decision.approved ? 'ri-check-line' : 'ri-time-line';
			const statusClass = STATUS_TONE[entry.status.key] || 'acts-pill--muted';
			tr.innerHTML = `
				<td>${entry.number}</td>
				<td>${formatDate(entry.date)}</td>
				<td>${entry.topic}</td>
				<td><span class="acts-decision"><i class="${decisionIcon}" aria-hidden="true"></i>${entry.decision.label}</span></td>
				<td><span class="acts-pill ${statusClass}">${entry.status.label}</span></td>
			`;
			fragment.appendChild(tr);
		});
		elements.tbody.innerHTML = '';
		elements.tbody.appendChild(fragment);
		if (elements.count) {
			elements.count.textContent = `Mostrando ${rows.length} ${rows.length === 1 ? 'acta' : 'actas'}`;
		}
	};

	const updateTabs = () => {
		elements.tabs.forEach((tabButton) => {
			const { actsTab } = tabButton.dataset;
			const isActive = actsState.filters.tab === actsTab;
			tabButton.classList.toggle('active', isActive);
			tabButton.setAttribute('aria-selected', String(isActive));
		});
	};

	const bindTabs = () => {
		elements.tabs.forEach((button) => {
			button.addEventListener('click', () => {
				const { actsTab } = button.dataset;
				if (!actsTab || actsTab === actsState.filters.tab) return;
				actsState.filters.tab = actsTab;
				updateTabs();
				renderTable();
			});
		});
	};

	const bindSearch = () => {
		if (!elements.search) return;
		elements.search.addEventListener('input', (event) => {
			actsState.filters.search = event.target.value || '';
			renderTable();
		});
	};

	const simulateAction = (message) => {
		console.info(`[Libro de Actas] ${message}`);
	};

	const bindActions = () => {
		elements.newMinute?.addEventListener('click', () => {
			document.dispatchEvent(new CustomEvent('humana:acta-nueva', { detail: { from: 'actas' } }));
			simulateAction('Crear nueva acta (prototipo)');
		});
		elements.generateCert?.addEventListener('click', () => simulateAction('Generar certificado (prototipo)'));
		elements.sign?.addEventListener('click', () => simulateAction('Firmar acta (prototipo)'));
		elements.refresh?.addEventListener('click', () => {
			elements.refresh.classList.add('is-spin');
			setTimeout(() => {
				elements.refresh.classList.remove('is-spin');
				renderTable();
			}, 600);
		});
	};

	const bindBackHome = () => {
		elements.backHome?.addEventListener('click', () => {
			const navEvent = new CustomEvent('humana:volver-inicio', {
				detail: { source: 'actas' },
				cancelable: true
			});
			const proceed = document.dispatchEvent(navEvent);
			if (proceed) {
				try {
					window.location.href = '../../index.html';
				} catch (error) {
					console.warn('No se pudo volver automáticamente al inicio', error);
				}
			}
		});
	};

	const init = () => {
		renderMetrics();
		renderSignatures();
		updateTabs();
		renderTable();
		bindTabs();
		bindSearch();
		bindActions();
		bindBackHome();
	};

	init();
})();
