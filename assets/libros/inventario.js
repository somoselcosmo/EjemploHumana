(() => {
	const layout = document.querySelector('[data-js="inventory-layout"]');
	if (!layout) return;

	const elements = {
		tableBody: layout.querySelector('[data-js="inventory-body"]'),
		count: layout.querySelector('[data-js="inventory-count"]'),
		search: layout.querySelector('[data-js="inventory-search"]'),
		metrics: {
			totalItems: layout.querySelector('[data-metric="total-items"]'),
			totalValue: layout.querySelector('[data-metric="total-value"]'),
			assigned: layout.querySelector('[data-metric="assigned"]'),
			damaged: layout.querySelector('[data-metric="damaged"]')
		},
		refresh: layout.querySelector('[data-js="refresh"]'),
		backHome: layout.querySelector('[data-js="back-home"]'),
		newAsset: layout.querySelector('[data-js="new-asset"]'),
		importCsv: layout.querySelector('[data-js="import-csv"]'),
		exportData: layout.querySelector('[data-js="export-data"]'),
		print: layout.querySelector('[data-js="print"]')
	};

	const currencyFormatter = new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		maximumFractionDigits: 0
	});

	const inventoryState = {
		summary: {
			totalItems: 135,
			totalValue: 27620000,
			assigned: 58,
			damaged: 4
		},
		filters: {
			search: ''
		},
		entries: [
			{
				code: 'INV-001',
				name: 'Computador portátil',
				category: 'Tecnología',
				status: 'operativo',
				quantity: 3,
				location: 'Sede principal',
				responsable: 'Y. Ramírez'
			},
			{
				code: 'MOB-010',
				name: 'Mesa de reuniones',
				category: 'Mobiliario',
				status: 'baja',
				quantity: 1,
				location: 'Salón 1',
				responsable: 'J. Gómez'
			},
			{
				code: 'EOP-023',
				name: 'Proyector Epson',
				category: 'Equipo',
				status: 'operativo',
				quantity: 1,
				location: 'Bodega',
				responsable: 'C. Salazar'
			},
			{
				code: 'TEC-005',
				name: 'Router Wi-Fi',
				category: 'Tecnología',
				status: 'mantenimiento',
				quantity: 1,
				location: 'Sede principal',
				responsable: 'L. Moreno'
			},
			{
				code: 'OTR-015',
				name: 'Escalera plegable',
				category: 'Otros',
				status: 'regular',
				quantity: 1,
				location: 'Bodega',
				responsable: 'M. Pérez'
			}
		]
	};

	const STATUS_LABELS = {
		operativo: 'Operativo',
		baja: 'Para baja',
		mantenimiento: 'En mantenimiento',
		regular: 'Regular'
	};

	const STATUS_CLASS = {
		operativo: 'state-pill--success',
		baja: 'state-pill--danger',
		mantenimiento: 'state-pill--warning',
		regular: 'state-pill--info'
	};

	const formatCurrency = (value) => currencyFormatter.format(value || 0);

	const renderMetrics = () => {
		const { summary } = inventoryState;
		elements.metrics.totalItems && (elements.metrics.totalItems.textContent = summary.totalItems);
		elements.metrics.totalValue && (elements.metrics.totalValue.textContent = formatCurrency(summary.totalValue));
		elements.metrics.assigned && (elements.metrics.assigned.textContent = summary.assigned);
		elements.metrics.damaged && (elements.metrics.damaged.textContent = summary.damaged);
	};

	const getFilteredEntries = () => {
		const needle = inventoryState.filters.search.trim().toLowerCase();
		return inventoryState.entries.filter((entry) => {
			if (!needle) return true;
			const haystack = `${entry.code} ${entry.name} ${entry.category} ${entry.location} ${entry.responsable}`.toLowerCase();
			return haystack.includes(needle);
		});
	};

	const renderTable = () => {
		const rows = getFilteredEntries();
		const fragment = document.createDocumentFragment();

		rows.forEach((entry) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${entry.code}</td>
				<td>${entry.name}</td>
				<td>${entry.category}</td>
				<td><span class="state-pill ${STATUS_CLASS[entry.status] || ''}">${STATUS_LABELS[entry.status] || entry.status}</span></td>
				<td>${entry.quantity}</td>
				<td>${entry.location}</td>
				<td>${entry.responsable}</td>
				<td class="inventory-action">
					<button class="icon-btn" data-action="details" aria-label="Ver ${entry.code}"><i class="ri-arrow-right-s-line"></i></button>
				</td>
			`;
			fragment.appendChild(tr);
		});

		if (elements.tableBody) {
			elements.tableBody.innerHTML = '';
			elements.tableBody.appendChild(fragment);
		}

		if (elements.count) {
			elements.count.textContent = `Mostrando ${rows.length} ${rows.length === 1 ? 'bien' : 'bienes'}`;
		}
	};

	const bindSearch = () => {
		if (!elements.search) return;
		elements.search.addEventListener('input', (event) => {
			inventoryState.filters.search = event.target.value || '';
			renderTable();
		});
	};

	const simulateAction = (message) => {
		console.info(`[Libro de Inventario] ${message}`);
	};

	const bindActions = () => {
		elements.newAsset?.addEventListener('click', () => {
			document.dispatchEvent(new CustomEvent('humana:inventario-nuevo'));
			simulateAction('Nuevo bien (prototipo)');
		});
		elements.importCsv?.addEventListener('click', () => simulateAction('Importar CSV (prototipo)'));
		elements.exportData?.addEventListener('click', () => simulateAction('Exportar inventario (prototipo)'));
		elements.print?.addEventListener('click', () => simulateAction('Imprimir inventario (prototipo)'));
		elements.refresh?.addEventListener('click', () => {
			elements.refresh.classList.add('is-spin');
			setTimeout(() => {
				elements.refresh.classList.remove('is-spin');
				renderTable();
			}, 650);
		});
		elements.tableBody?.addEventListener('click', (event) => {
			const button = event.target.closest('button[data-action]');
			if (!button) return;
			const row = button.closest('tr');
			const code = row?.firstElementChild?.textContent?.trim() || 'bien';
			simulateAction(`${button.dataset.action} → ${code}`);
		});
	};

	const bindBackHome = () => {
		if (!elements.backHome) return;
		elements.backHome.addEventListener('click', () => {
			const navEvent = new CustomEvent('humana:volver-inicio', {
				detail: { source: 'inventario' },
				cancelable: true
			});
			const proceed = document.dispatchEvent(navEvent);
			if (proceed) {
				try {
					window.location.href = '../../index.html';
				} catch (error) {
					console.warn('No se pudo regresar automáticamente al inicio', error);
				}
			}
		});
	};

	const init = () => {
		renderMetrics();
		renderTable();
		bindSearch();
		bindActions();
		bindBackHome();
	};

	init();
})();
