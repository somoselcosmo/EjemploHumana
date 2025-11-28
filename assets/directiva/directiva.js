(() => {
	const layout = document.querySelector('[data-js="directiva-layout"]');
	if (!layout) return;

	const elements = {
		period: layout.querySelector('[data-js="council-period"]'),
		boardCard: layout.querySelector('[data-js="board-card"]'),
		committeeCard: layout.querySelector('[data-js="committee-card"]'),
		conciliatorsBody: layout.querySelector('[data-js="conciliators-body"]'),
		delegateFilter: layout.querySelector('[data-js="delegate-filter"]'),
		delegatesList: layout.querySelector('[data-js="delegates-list"]')
	};

	const statusMap = {
		online: { label: 'Activo', className: 'is-active' },
		offline: { label: 'Inactivo', className: 'is-inactive' },
		busy: { label: 'En reunión', className: 'is-busy' }
	};

	const groups = [
		{
			id: 'junta',
			title: 'Junta Directiva actual',
			description: 'Equipo encargado de la estrategia general de la JAC y del cumplimiento del plan comunitario.',
			members: [
				{
					name: 'Felipe Chaverra',
					position: 'Presidente',
					idCode: 'DDI 024567',
					status: 'online',
					tenure: 'Mandato 2024 – 2026',
					focus: 'Representación legal y articulación institucional.',
					tags: ['Gobernanza', 'Planeación'],
					email: 'presidencia@jacprov.co',
					phone: '301 555 0199'
				},
				{
					name: 'Mateo Cárdenas',
					position: 'Vicepresidente',
					idCode: 'DDI 031234',
					status: 'busy',
					tenure: 'Mandato 2024 – 2026',
					focus: 'Seguimiento de proyectos productivos.',
					tags: ['Productividad', 'Innovación'],
					email: 'vicepresidencia@jacprov.co',
					phone: '300 201 8899'
				},
				{
					name: 'Laura Vélez',
					position: 'Secretaria',
					idCode: 'DDI 045678',
					status: 'online',
					tenure: 'Mandato 2024 – 2026',
					focus: 'Archivo, actas y comunicaciones oficiales.',
					tags: ['Documentación'],
					email: 'secretaria@jacprov.co',
					phone: '302 115 8842'
				},
				{
					name: 'Diana Laverde',
					position: 'Tesorera',
					idCode: 'DDI 056789',
					status: 'offline',
					tenure: 'Mandato 2024 – 2026',
					focus: 'Ejecución presupuestal y reportes contables.',
					tags: ['Finanzas'],
					email: 'tesoreria@jacprov.co',
					phone: '317 998 2204'
				}
			]
		},
		{
			id: 'comite',
			title: 'Comité de Trabajo',
			description: 'Coordina comisiones temáticas (infraestructura, cultura y convivencia) y acompaña la ejecución de proyectos.',
			members: [
				{
					name: 'Héctor Ospina',
					position: 'Coordinador',
					idCode: 'DDI 078901',
					status: 'online',
					tenure: 'Líder comunitario · 8 años',
					focus: 'Seguimiento a obras y frentes de servicio.',
					tags: ['Infraestructura', 'Supervisión'],
					email: 'coordinacion@jacprov.co',
					phone: '316 778 1250'
				},
				{
					name: 'Ana Gutiérrez',
					position: 'Gestora de Cultura',
					idCode: 'DDI 089012',
					status: 'busy',
					tenure: 'Voluntaria · 5 años',
					focus: 'Programación cultural y talleres juveniles.',
					tags: ['Cultura', 'Juventud'],
					email: 'cultura@jacprov.co',
					phone: '315 665 7421'
				},
				{
					name: 'Gustavo Marin',
					position: 'Logística',
					idCode: 'DDI 097531',
					status: 'online',
					tenure: 'Voluntario · 3 años',
					focus: 'Apoyo operativo en eventos y asambleas.',
					tags: ['Operación'],
					email: 'logistica@jacprov.co',
					phone: '300 551 1120'
				}
			]
		},
		{
			id: 'conciliadores',
			title: 'Conciliadores',
			description: 'Equipo encargado de la resolución de conflictos, orientación legal comunitaria y veeduría social.',
			members: [
				{
					name: 'Iván Madera',
					position: 'Conciliador principal',
					idCode: 'DDI 067890',
					status: 'online',
					tenure: 'Conciliador certificado',
					focus: 'Casos de convivencia vecinal.',
					tags: ['Mediación'],
					email: 'conciliador@jacprov.co'
				},
				{
					name: 'Natalia Rivera',
					position: 'Asesora jurídica',
					idCode: 'DDI 072113',
					status: 'busy',
					tenure: 'Abogada comunitaria',
					focus: 'Acompaña asuntos contractuales.',
					tags: ['Legal'],
					email: 'juridica@jacprov.co'
				}
			]
		},
		{
			id: 'delegados',
			title: 'Delegados',
			description: 'Representan a la JAC ante instancias municipales y mesas de participación ciudadana.',
			members: [
				{
					name: 'Camilo Restrepo',
					position: 'Delegado municipal',
					idCode: 'DDI 084201',
					status: 'online',
					tenure: 'Enlace Alcaldía',
					focus: 'Veeduría en presupuesto participativo.',
					tags: ['Veeduría', 'Participación'],
					email: 'delegado@jacprov.co',
					phone: '311 880 3344'
				},
				{
					name: 'María Alejandra Hoyos',
					position: 'Delegada sector rural',
					idCode: 'DDI 091044',
					status: 'offline',
					tenure: 'Representante veredal',
					focus: 'Interlocución con veredas y asociaciones campesinas.',
					tags: ['Ruralidad'],
					email: 'rural@jacprov.co',
					phone: '320 441 9020'
				}
			]
		}
	];

	const getInitials = (name = '') => name.split(' ').filter(Boolean).map((segment) => segment[0]).slice(0, 2).join('').toUpperCase();

	const groupById = groups.reduce((acc, group) => {
		acc[group.id] = group;
		return acc;
	}, {});

	const state = {
		delegateFilter: 'all'
	};

	const renderBoardCard = () => {
		if (!elements.boardCard) return;
		const board = groupById.junta;
		if (!board || !board.members.length) {
			elements.boardCard.innerHTML = '<p class="council-empty">Aún no hay integrantes registrados.</p>';
			return;
		}
		const leader = board.members[0];
		const secondaryLine = leader.focus || leader.tenure || '—';
		const tagChips = Array.isArray(leader.tags)
			? leader.tags.map((tag) => `<span class="council-tag">${tag}</span>`).join('')
			: '';
		elements.boardCard.innerHTML = `
			<header class="council-card__header">
				<div>
					<p class="council-chip">${board.title}</p>
					<h2 class="council-card__title">${leader.position}</h2>
				</div>
				<button class="council-link" type="button">
					Ver perfil<i class="ri-arrow-right-line" aria-hidden="true"></i>
				</button>
			</header>
			<div class="council-highlight">
				<span class="council-avatar">${getInitials(leader.name)}</span>
				<div>
					<h3>${leader.name}</h3>
					<p class="council-meta">${secondaryLine}</p>
				</div>
			</div>
			<footer class="council-card__footer">
				<span class="council-link council-link--muted" role="button">Ver perfil</span>
				<span class="council-count">${board.members.length} integrante${board.members.length > 1 ? 's' : ''}</span>
			</footer>
			${tagChips ? `<div class="council-tags">${tagChips}</div>` : ''}
		`;
	};

	const renderCommitteeCard = () => {
		if (!elements.committeeCard) return;
		const committee = groupById.comite;
		if (!committee) {
			elements.committeeCard.innerHTML = '<p class="council-empty">No se han definido comités de trabajo.</p>';
			return;
		}
		const committeeLead = committee.members[0];
		const summary = `${committee.title} · ${committee.members.length} integrante${committee.members.length !== 1 ? 's' : ''}`;
		const actionButtons = [
			{ label: 'Ver integrantes', icon: 'ri-team-line' },
			{ label: 'Tareas', icon: 'ri-task-line' },
			{ label: 'Actas', icon: 'ri-article-line' }
		];
		elements.committeeCard.innerHTML = `
			<header class="council-card__header">
				<div>
					<p class="council-chip">Comité de trabajo</p>
					<h2 class="council-card__title">${committeeLead ? committeeLead.name : committee.title}</h2>
					<p class="council-meta">${committeeLead ? committeeLead.position : 'Coordinación'}</p>
				</div>
			</header>
			<div class="council-summary">
				<p>${summary}</p>
				<p class="council-meta">${committee.description}</p>
			</div>
			<div class="council-actions">
				${actionButtons.map((action) => `
					<button type="button" class="council-action">
						<i class="${action.icon}" aria-hidden="true"></i>${action.label}
					</button>
				`).join('')}
			</div>
		`;
	};

	const getStatus = (status) => statusMap[status] || statusMap.offline;

	const renderConciliators = () => {
		if (!elements.conciliatorsBody) return;
		const conciliators = groupById.conciliadores;
		if (!conciliators) {
			elements.conciliatorsBody.innerHTML = '<tr><td colspan="4" class="council-empty">Sin registros</td></tr>';
			return;
		}
		const rows = conciliators.members.map((member) => {
			const status = getStatus(member.status);
			return `
				<tr>
					<td>
						<div class="council-name">
							<span class="council-avatar council-avatar--sm">${getInitials(member.name)}</span>
							<div>
								<span class="council-name__label">${member.name}</span>
								${member.email ? `<span class="council-meta">${member.email}</span>` : ''}
							</div>
						</div>
					</td>
					<td>${member.position || '—'}</td>
					<td>${member.tenure || '—'}</td>
					<td><span class="council-status ${status.className}">${status.label}</span></td>
				</tr>
			`;
		}).join('');
		elements.conciliatorsBody.innerHTML = rows;
	};

	const collectDelegateTags = () => {
		const delegates = groupById.delegados;
		if (!delegates) return [];
		const tagSet = new Set();
		delegates.members.forEach((member) => {
			(member.tags || []).forEach((tag) => tagSet.add(tag));
		});
		return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
	};

	const renderDelegateFilterOptions = () => {
		if (!elements.delegateFilter) return;
		const tags = collectDelegateTags();
		const baseOption = '<option value="all">Todos</option>';
		elements.delegateFilter.innerHTML = baseOption + tags.map((tag) => `<option value="${tag}">${tag}</option>`).join('');
		if (tags.length && !tags.includes(state.delegateFilter)) {
			state.delegateFilter = 'all';
		}
		elements.delegateFilter.value = state.delegateFilter;
	};

	const renderDelegates = () => {
		if (!elements.delegatesList) return;
		const delegates = groupById.delegados;
		if (!delegates) {
			elements.delegatesList.innerHTML = '<p class="council-empty">No hay delegados registrados.</p>';
			return;
		}
		const filtered = delegates.members.filter((member) => {
			if (state.delegateFilter === 'all') return true;
			return (member.tags || []).includes(state.delegateFilter);
		});
		if (!filtered.length) {
			elements.delegatesList.innerHTML = '<p class="council-empty">No hay delegados para este filtro.</p>';
			return;
		}
		elements.delegatesList.innerHTML = filtered.map((member) => {
			const tags = (member.tags || []).map((tag) => `<span class="council-tag">${tag}</span>`).join('');
			return `
				<article class="council-list__item">
					<div class="council-list__main">
						<h3>${member.name}</h3>
						<p class="council-meta">${member.position || ''}</p>
					</div>
					<div class="council-list__details">
						${member.tenure ? `<span>${member.tenure}</span>` : ''}
						${member.focus ? `<span>${member.focus}</span>` : ''}
						${tags ? `<div class="council-tags">${tags}</div>` : ''}
					</div>
					<div class="council-list__contact">
						${member.email ? `<a href="mailto:${member.email}"><i class="ri-mail-line" aria-hidden="true"></i>${member.email}</a>` : ''}
						${member.phone ? `<span><i class="ri-phone-line" aria-hidden="true"></i>${member.phone}</span>` : ''}
					</div>
				</article>
			`;
		}).join('');
	};

	const bindFilter = () => {
		if (!elements.delegateFilter) return;
		elements.delegateFilter.addEventListener('change', (event) => {
			state.delegateFilter = event.target.value || 'all';
			renderDelegates();
		});
	};

	const bindPeriod = () => {
		if (!elements.period) return;
		elements.period.addEventListener('change', (event) => {
			console.info('[Directiva JAC] Vigencia seleccionada:', event.target.value);
		});
	};

	const init = () => {
		renderBoardCard();
		renderCommitteeCard();
		renderConciliators();
		renderDelegateFilterOptions();
		renderDelegates();
		bindFilter();
		bindPeriod();
	};

	init();
})();
