(() => {
	const layout = document.querySelector('[data-js="contable-layout"]');
	if (!layout) {
		return;
	}

	const elements = {
		summary: {
			incomeValue: layout.querySelector('[data-summary="income-value"]'),
			incomeCaption: layout.querySelector('[data-summary="income-caption"]'),
			expenseValue: layout.querySelector('[data-summary="expense-value"]'),
			expenseCaption: layout.querySelector('[data-summary="expense-caption"]'),
			approved: layout.querySelector('[data-count="approved"]'),
			review: layout.querySelector('[data-count="review"]'),
			rejected: layout.querySelector('[data-count="rejected"]')
		},
		tabs: layout.querySelectorAll('[data-ledger-tab]'),
		tabCounts: layout.querySelectorAll('[data-tab-count]'),
		tbody: layout.querySelector('[data-js="ledger-body"]'),
		search: layout.querySelector('[data-js="ledger-search"]'),
		count: layout.querySelector('[data-js="ledger-count"]'),
		refresh: layout.querySelector('[data-js="refresh-ledger"]'),
		backHome: layout.querySelector('[data-js="back-home"]'),
		newRecord: layout.querySelector('[data-js="new-record"]'),
		uploadCsv: layout.querySelector('[data-js="upload-csv"]'),
		downloadTemplate: layout.querySelector('[data-js="download-template"]'),
		exportPdf: layout.querySelector('[data-js="export-pdf"]')
	};

	const currencyFormatter = new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		maximumFractionDigits: 0
	});

	const dateFormatter = new Intl.DateTimeFormat('es-CO', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	const ledgerState = {
		summary: {
			income: 2200000,
			expense: 2450000,
			updatedAt: '2025-11-15',
			expenseCaption: 'Incluye mantenimiento y suministros',
			statuses: {
				approved: 12,
				review: 3,
				rejected: 1
			}
		},
		filters: {
			tab: 'todos',
			search: ''
		},
		entries: [
			{
				id: 'CMP-000145',
				date: '2025-11-10',
				type: 'ingreso',
				concept: 'Compra de suministros para asamblea',
				movement: { kind: 'credito', amount: 1500000 },
				status: { key: 'aprobado', label: 'Aprobado' }
			},
			{
				id: 'CMP-000143',
				date: '2025-11-10',
				type: 'egreso',
				concept: 'Compra de suministros',
				movement: { kind: 'egreso', amount: 1500000 },
				status: { key: 'aprobado', label: 'Aprobado' }
			},
			{
				id: 'CMP-000142',
				date: '2025-11-10',
				type: 'egreso',
				concept: 'Compra de suministros La 20',
				movement: { kind: 'debito', amount: 0 },
				status: { key: 'revision', label: 'En revisión' }
			},
			{
				id: 'CMP-000141',
				date: '2025-11-10',
				type: 'egreso',
				concept: 'Compra de suministros',
				movement: { kind: 'egreso', amount: 1500000 },
				status: { key: 'revision', label: 'En revisión' }
			},
			{
				id: 'CMP-000140',
				date: '2025-11-02',
				type: 'egreso',
				concept: 'Compra obreristerol',
				movement: { kind: 'firma', amount: 25000 },
				status: { key: 'firma', label: 'Firmar' }
			}
		]
	};

	const TYPE_LABELS = {
		ingreso: 'Ingreso',
		egreso: 'Egreso'
	};

	const STATUS_TONES = {
		aprobado: 'success',
		revision: 'warning',
		rechazado: 'danger',
		firma: 'info'
	};

	const MOVEMENT_LABELS = {
		credito: 'Crédito',
		egreso: 'Egreso',
		debito: 'Débito',
		firma: 'Crédito'
	};

	const formatCurrency = (value) => currencyFormatter.format(value || 0);

	const formatDate = (isoString) => {
		if (!isoString) {
			return 'N/D';
		}

		const date = new Date(isoString);
		if (Number.isNaN(date.getTime())) {
			return isoString;
		}
		return dateFormatter.format(date);
	};

	const renderSummary = () => {
		const { summary } = ledgerState;
		if (elements.summary.incomeValue) {
			elements.summary.incomeValue.textContent = formatCurrency(summary.income);
		}
		if (elements.summary.incomeCaption) {
			const labelDate = formatDate(summary.updatedAt);
			elements.summary.incomeCaption.textContent = `Actualizado al ${labelDate}`;
		}
		if (elements.summary.expenseValue) {
			elements.summary.expenseValue.textContent = formatCurrency(summary.expense);
		}
		if (elements.summary.expenseCaption) {
			elements.summary.expenseCaption.textContent = summary.expenseCaption;
		}
		if (elements.summary.approved) {
			elements.summary.approved.textContent = summary.statuses.approved;
		}
		if (elements.summary.review) {
			elements.summary.review.textContent = summary.statuses.review;
		}
		if (elements.summary.rejected) {
			elements.summary.rejected.textContent = summary.statuses.rejected;
		}
	};

	const getFilteredEntries = () => {
		const { tab, search } = ledgerState.filters;
		const normalizedSearch = search.trim().toLowerCase();

		return ledgerState.entries.filter((entry) => {
			if (tab === 'ingresos' && entry.type !== 'ingreso') {
				return false;
			}
			if (tab === 'egresos' && entry.type !== 'egreso') {
				return false;
			}
			if (tab === 'pendientes' && entry.status.key !== 'revision') {
				return false;
			}
			if (tab === 'firma' && entry.status.key !== 'firma') {
				return false;
			}

			if (normalizedSearch) {
				const haystack = `${entry.id} ${entry.concept} ${TYPE_LABELS[entry.type] || entry.type}`.toLowerCase();
				if (!haystack.includes(normalizedSearch)) {
					return false;
				}
			}
			return true;
		});
	};

	const renderTable = () => {
		const rows = getFilteredEntries();
		const fragment = document.createDocumentFragment();

		rows.forEach((entry) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${entry.id}</td>
				<td>${formatDate(entry.date)}</td>
				<td><span class="type-pill ${entry.type}">${TYPE_LABELS[entry.type] || entry.type}</span></td>
				<td>${entry.concept}</td>
				<td>
					<span class="movement-pill ${entry.movement.kind}">
						${MOVEMENT_LABELS[entry.movement.kind] || 'Monto'}: <strong>${formatCurrency(entry.movement.amount)}</strong>
					</span>
				</td>
				<td><span class="status-chip ${STATUS_TONES[entry.status.key] || ''}">${entry.status.label}</span></td>
				<td class="table-actions">
					<button class="icon-btn" data-action="view" aria-label="Ver ${entry.id}"><i class="ri-eye-line"></i></button>
					<button class="icon-btn" data-action="share" aria-label="Compartir ${entry.id}"><i class="ri-share-forward-line"></i></button>
					<button class="icon-btn" data-action="assign" aria-label="Asignar ${entry.id}"><i class="ri-user-add-line"></i></button>
				</td>
			`;
			fragment.appendChild(tr);
		});

		if (elements.tbody) {
			elements.tbody.innerHTML = '';
			elements.tbody.appendChild(fragment);
		}

		if (elements.count) {
			elements.count.textContent = `Mostrando ${rows.length} ${rows.length === 1 ? 'comprobante' : 'comprobantes'}`;
		}
	};

	const updateTabCounts = () => {
		const totals = {
			todos: ledgerState.entries.length,
			ingresos: ledgerState.entries.filter((item) => item.type === 'ingreso').length,
			egresos: ledgerState.entries.filter((item) => item.type === 'egreso').length,
			pendientes: ledgerState.entries.filter((item) => item.status.key === 'revision').length,
			firma: ledgerState.entries.filter((item) => item.status.key === 'firma').length
		};

		elements.tabCounts.forEach((node) => {
			const key = node.dataset.tabCount;
			if (key && key in totals) {
				node.textContent = totals[key];
			}
		});
	};

	const syncTabs = () => {
		elements.tabs.forEach((tabButton) => {
			const { ledgerTab } = tabButton.dataset;
			const isActive = ledgerState.filters.tab === ledgerTab;
			tabButton.classList.toggle('active', isActive);
			tabButton.setAttribute('aria-selected', String(isActive));
		});
	};

	const renderAll = () => {
		renderSummary();
		updateTabCounts();
		syncTabs();
		renderTable();
	};

	const bindTabs = () => {
		elements.tabs.forEach((button) => {
			button.addEventListener('click', () => {
				const { ledgerTab } = button.dataset;
				if (!ledgerTab || ledgerTab === ledgerState.filters.tab) {
					return;
				}
				ledgerState.filters.tab = ledgerTab;
				renderAll();
			});
		});
	};

	const bindSearch = () => {
		if (!elements.search) {
			return;
		}
		elements.search.addEventListener('input', (event) => {
			ledgerState.filters.search = event.target.value || '';
			renderTable();
		});
	};

	const simulateAction = (message) => {
		console.info(`[Libro Contable] ${message}`);
	};

	const bindPrimaryActions = () => {
		elements.newRecord?.addEventListener('click', () => {
			const actionEvent = new CustomEvent('humana:contable-nuevo', {
				detail: { source: 'contable' }
			});
			if (document.dispatchEvent(actionEvent)) {
				simulateAction('Nuevo comprobante (prototipo)');
			}
		});

		elements.uploadCsv?.addEventListener('click', () => simulateAction('Cargar CSV (prototipo)'));
		elements.downloadTemplate?.addEventListener('click', () => simulateAction('Descargar plantilla (prototipo)'));
		elements.exportPdf?.addEventListener('click', () => simulateAction('Exportar PDF (prototipo)'));

		elements.refresh?.addEventListener('click', () => {
			elements.refresh.classList.add('is-spin');
			setTimeout(() => {
				elements.refresh?.classList.remove('is-spin');
				renderAll();
			}, 600);
		});

		elements.tbody?.addEventListener('click', (event) => {
			const button = event.target.closest('button[data-action]');
			if (!button) {
				return;
			}
			const row = button.closest('tr');
			const id = row ? row.firstElementChild?.textContent?.trim() : 'comprobante';
			simulateAction(`${button.dataset.action} → ${id}`);
		});
	};

	const bindBackHome = () => {
		if (!elements.backHome) {
			return;
		}

		elements.backHome.addEventListener('click', () => {
			const navEvent = new CustomEvent('humana:volver-inicio', {
				detail: { source: 'contable' },
				cancelable: true
			});

			const notCancelled = document.dispatchEvent(navEvent);
			if (notCancelled) {
				try {
					window.location.href = '../../index.html';
				} catch (err) {
					console.warn('No se pudo navegar al inicio automáticamente', err);
				}
			}
		});
	};

	bindTabs();
	bindSearch();
	bindPrimaryActions();
	bindBackHome();
	renderAll();
})();
