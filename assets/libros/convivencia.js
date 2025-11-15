(() => {
	const layout = document.querySelector('[data-js="civics-layout"]');
	if (!layout) return;

	const elements = {
		tbody: layout.querySelector('[data-js="civics-body"]'),
		count: layout.querySelector('[data-js="civics-count"]'),
		search: layout.querySelector('[data-js="civics-search"]'),
		newRule: layout.querySelector('[data-js="new-rule"]'),
		refresh: layout.querySelector('[data-js="refresh"]'),
		backHome: layout.querySelector('[data-js="back-home"]')
	};

	const civicsState = {
		filters: {
			search: ''
		},
		entries: [
			{
				date: '2025-10-01',
				rule: 'Respeto a horarios de silencio',
				description: 'De 10 p. m. a 6 a. m. para que los niños duerman y el cafetal descanse.',
				votes: '12/15 afiliados',
				responsable: 'Presidente 024567'
			},
			{
				date: '2025-11-15',
				rule: 'No botar basura en el río',
				description: 'Proteger el agua para todos; multa interna de $10.000.',
				votes: '14/15 afiliados',
				responsable: 'Secretaría 045678'
			},
			{
				date: '2025-11-20',
				rule: 'Mediación en pleitos de linderos',
				description: 'Hablar en la sede JAC antes de ir a juez (máximo 3 reuniones).',
				votes: '13/15 afiliados',
				responsable: 'Fiscal 067890'
			},
			{
				date: 'revision',
				rule: 'Revisión anual',
				description: 'En asamblea de diciembre votamos los cambios.',
				votes: '—',
				responsable: 'Directiva'
			}
		]
	};

	const formatDate = (value) => {
		if (value === 'revision') return 'Revisión anual';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return new Intl.DateTimeFormat('es-CO', {
			day: '2-digit', month: '2-digit', year: 'numeric'
		}).format(date);
	};

	const getFilteredEntries = () => {
		const query = civicsState.filters.search.trim().toLowerCase();
		return civicsState.entries.filter((entry) => {
			if (!query) return true;
			const haystack = `${entry.rule} ${entry.description} ${entry.responsable}`.toLowerCase();
			return haystack.includes(query);
		});
	};

	const renderTable = () => {
		if (!elements.tbody) return;
		const rows = getFilteredEntries();
		const fragment = document.createDocumentFragment();
		rows.forEach((entry) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${formatDate(entry.date)}</td>
				<td><strong>${entry.rule}</strong></td>
				<td>${entry.description}</td>
				<td>${entry.votes}</td>
				<td>${entry.responsable}</td>
			`;
			fragment.appendChild(tr);
		});
		elements.tbody.innerHTML = '';
		elements.tbody.appendChild(fragment);
		if (elements.count) {
			elements.count.textContent = `Mostrando ${rows.length} ${rows.length === 1 ? 'norma' : 'normas'}`;
		}
	};

	const bindSearch = () => {
		if (!elements.search) return;
		elements.search.addEventListener('input', (event) => {
			civicsState.filters.search = event.target.value || '';
			renderTable();
		});
	};

	const simulateAction = (message) => {
		console.info(`[Libro de Convivencia] ${message}`);
	};

	const bindActions = () => {
		elements.newRule?.addEventListener('click', () => {
			document.dispatchEvent(new CustomEvent('humana:convivencia-norma', { detail: { source: 'convivencia' } }));
			simulateAction('Agregar norma (prototipo)');
		});
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
				detail: { source: 'convivencia' },
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
		renderTable();
		bindSearch();
		bindActions();
		bindBackHome();
	};

	init();
})();
