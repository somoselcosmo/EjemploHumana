(() => {
	const layout = document.querySelector('[data-js="directiva-layout"]');
	if (!layout) return;

	const elements = {
		summary: layout.querySelector('[data-js="directiva-summary"]'),
		sections: layout.querySelector('[data-js="directiva-sections"]'),
		nav: layout.querySelector('[data-js="directiva-nav"]'),
		refreshBtn: layout.querySelector('[data-js="directiva-refresh"]')
	};

	const statusMap = {
		online: { label: 'Online', className: 'is-online' },
		offline: { label: 'Offline', className: 'is-offline' },
		busy: { label: 'Reunión', className: 'is-busy' }
	};

	const groups = [
		{
			id: 'junta',
			title: 'Junta Directiva',
			description: 'Orienta la estrategia general de la JAC, aprueba proyectos y vela por el cumplimiento del plan comunitario.',
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

	const createSummaryData = () => {
		const totalMembers = groups.reduce((acc, group) => acc + group.members.length, 0);
		return [
			{ label: 'Miembros activos', value: totalMembers, meta: 'Registrados 2025' },
			{ label: 'Órganos', value: groups.length, meta: 'Junta + comités' },
			{ label: 'Reuniones programadas', value: 4, meta: 'Próxima: 18 dic' }
		];
	};

	const renderSummary = () => {
		if (!elements.summary) return;
		const fragment = document.createDocumentFragment();
		createSummaryData().forEach((item) => {
			const card = document.createElement('article');
			card.className = 'directiva-summary__card';
			card.innerHTML = `
				<span class="directiva-summary__label">${item.label}</span>
				<strong class="directiva-summary__value">${item.value}</strong>
				<span class="directiva-summary__meta">${item.meta}</span>
			`;
			fragment.appendChild(card);
		});
		elements.summary.innerHTML = '';
		elements.summary.appendChild(fragment);
	};

	const createMemberCard = (member) => {
		const card = document.createElement('article');
		card.className = 'directiva-card';
		const status = statusMap[member.status] || statusMap.offline;
		const tagsTemplate = Array.isArray(member.tags)
			? member.tags.map((tag) => `<span class="directiva-tag">${tag}</span>`).join('')
			: '';

		const contactLines = [];
		if (member.email) contactLines.push(`<span><i class="ri-mail-line" aria-hidden="true"></i>${member.email}</span>`);
		if (member.phone) contactLines.push(`<span><i class="ri-phone-line" aria-hidden="true"></i>${member.phone}</span>`);

		card.innerHTML = `
			<div class="directiva-card__header">
				<div class="directiva-avatar">${getInitials(member.name)}</div>
				<div>
					<p class="directiva-role">${member.position}</p>
					<h3 class="directiva-name">${member.name}</h3>
				</div>
				<span class="directiva-status ${status.className}">${status.label}</span>
			</div>
			<div class="directiva-card__body">
				<span><i class="ri-fingerprint-line" aria-hidden="true"></i>${member.idCode || 'N/D'}</span>
				<span><i class="ri-compass-3-line" aria-hidden="true"></i>${member.focus || ''}</span>
				<span><i class="ri-timer-line" aria-hidden="true"></i>${member.tenure || ''}</span>
			</div>
			${tagsTemplate ? `<div class="directiva-tags">${tagsTemplate}</div>` : ''}
			${contactLines.length ? `<div class="directiva-card__footer">${contactLines.join('')}</div>` : ''}
		`;
		return card;
	};

	const renderSections = () => {
		if (!elements.sections) return;
		const fragment = document.createDocumentFragment();
		groups.forEach((group) => {
			const section = document.createElement('section');
			section.className = 'directiva-group';
			section.id = `directiva-${group.id}`;
			section.innerHTML = `
				<div class="directiva-group__header">
					<div>
						<h2>${group.title}</h2>
						<p class="directiva-group__meta">${group.description}</p>
					</div>
					<span class="directiva-summary__meta">Miembros: ${group.members.length}</span>
				</div>
				<div class="directiva-members" data-group="${group.id}"></div>
			`;
			const membersWrapper = section.querySelector('.directiva-members');
			group.members.forEach((member) => {
				membersWrapper.appendChild(createMemberCard(member));
			});
			fragment.appendChild(section);
		});
		elements.sections.innerHTML = '';
		elements.sections.appendChild(fragment);
	};

	const bindNavigation = () => {
		if (!elements.nav) return;
		const buttons = elements.nav.querySelectorAll('.directiva-tab');
		const setActive = (targetId) => {
			buttons.forEach((btn) => {
				btn.classList.toggle('is-active', btn.dataset.target === targetId);
			});
		};
		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				const targetId = button.dataset.target;
				setActive(targetId);
				const section = layout.querySelector(`#directiva-${targetId}`);
				section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});
		});
	};

	const bindRefresh = () => {
		if (!elements.refreshBtn) return;
		const defaultHtml = elements.refreshBtn.innerHTML;
		elements.refreshBtn.addEventListener('click', () => {
			elements.refreshBtn.disabled = true;
			elements.refreshBtn.innerHTML = '<i class="ri-loader-2-line ri-spin"></i>Sincronizando';
			setTimeout(() => {
				elements.refreshBtn.disabled = false;
				elements.refreshBtn.innerHTML = defaultHtml;
				console.info('[Directiva JAC] Datos sincronizados (prototipo)');
			}, 1400);
		});
	};

	const init = () => {
		renderSummary();
		renderSections();
		bindNavigation();
		bindRefresh();
	};

	init();
})();
