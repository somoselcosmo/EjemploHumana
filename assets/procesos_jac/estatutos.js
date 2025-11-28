(() => {
	const layout = document.querySelector('[data-js="estatutos-layout"]');
	if (!layout) return;

	const elements = {
		chaptersList: layout.querySelector('[data-js="chapters-list"]'),
		chapterChip: layout.querySelector('[data-js="chapter-chip"]'),
		chapterTitle: layout.querySelector('[data-js="chapter-title"]'),
		chapterSummary: layout.querySelector('[data-js="chapter-summary"]'),
		chapterBody: layout.querySelector('[data-js="chapter-body"]'),
		downloadBtn: layout.querySelector('[data-js="download-statutes"]'),
		metrics: {
			chapters: layout.querySelector('[data-js="estatutos-metric-chapters"]'),
			articles: layout.querySelector('[data-js="estatutos-metric-articles"]'),
			points: layout.querySelector('[data-js="estatutos-metric-points"]')
		},
		meta: {
			version: layout.querySelector('[data-js="estatutos-version"]'),
			lastUpdate: layout.querySelector('[data-js="estatutos-last-update"]')
		}
	};

	const statutesChapters = [
		{
			id: 'cap-1',
			label: 'Capítulo 1',
			title: 'Naturaleza y Finalidades',
			summary: 'Define el carácter, principios y objetivos de la organización comunal.',
			articles: [
				{
					title: 'Artículo 1. Naturaleza',
					description: 'La Junta de Acción Comunal es una organización cívica sin ánimo de lucro que representa los intereses colectivos del territorio.'
				},
				{
					title: 'Artículo 2. Principios orientadores',
					description: 'Las actuaciones de la JAC se fundamentan en valores que garantizan la participación comunitaria.',
					points: [
						'Participación democrática y equitativa de los afiliados.',
						'Transparencia en la administración de recursos.',
						'Solidaridad y corresponsabilidad comunitaria.'
					]
				},
				{
					title: 'Artículo 3. Finalidades',
					description: 'Promover procesos de desarrollo social, económico y cultural que fortalezcan la convivencia y la identidad barrial.'
				}
			]
		},
		{
			id: 'cap-2',
			label: 'Capítulo 2',
			title: 'Composición y Afiliación',
			summary: 'Describe quiénes integran la organización y los requisitos de ingreso y permanencia.',
			articles: [
				{
					title: 'Artículo 4. Integrantes',
					description: 'La JAC está integrada por afiliados residentes, dignatarios elegidos y miembros honorarios.'
				},
				{
					title: 'Artículo 5. Requisitos de afiliación',
					description: 'Toda persona mayor de 14 años residente en la jurisdicción podrá afiliarse si cumple con los siguientes criterios:',
					points: [
						'Acreditar domicilio dentro del territorio comunal.',
						'No haber sido sancionada por faltas graves en otra organización comunal.',
						'Aceptar expresamente los estatutos y reglamentos vigentes.'
					]
				},
				{
					title: 'Artículo 6. Derechos y deberes',
					description: 'Los afiliados podrán elegir, ser elegidos y participar en los proyectos; a su vez deben asistir a las asambleas y cumplir las comisiones asignadas.'
				}
			]
		},
		{
			id: 'cap-3',
			label: 'Capítulo 3',
			title: 'Órganos de Gobierno',
			summary: 'Establece la estructura interna y responsabilidades de cada instancia.',
			articles: [
				{
					title: 'Artículo 7. Asamblea general',
					description: 'Máxima autoridad de la JAC, convoca mínimo dos veces al año y define lineamientos estratégicos.'
				},
				{
					title: 'Artículo 8. Junta directiva',
					description: 'Dirige la gestión ordinaria, ejecuta las decisiones de la asamblea y vigila la ejecución presupuestal.',
					points: [
						'Presidencia: representa legalmente a la JAC.',
						'Secretaría: custodia archivos y comunicaciones oficiales.',
						'Tesorería: administra y reporta los recursos financieros.'
					]
				},
				{
					title: 'Artículo 9. Comisiones de trabajo',
					description: 'Se conformarán comisiones temáticas para proyectos de infraestructura, cultura, convivencia y control social.'
				}
			]
		},
		{
			id: 'cap-4',
			label: 'Capítulo 4',
			title: 'Régimen Disciplinario y Reformas',
			summary: 'Define los procedimientos para sanciones y las reglas para modificar los estatutos.',
			articles: [
				{
					title: 'Artículo 10. Faltas',
					description: 'Se consideran faltas las conductas que lesionen la imagen, los recursos o el orden interno de la JAC.'
				},
				{
					title: 'Artículo 11. Procedimiento sancionatorio',
					description: 'Toda sanción deberá garantizar derecho a la defensa, etapas de descargos y registro escrito de la decisión.'
				},
				{
					title: 'Artículo 12. Reforma de estatutos',
					description: 'Las modificaciones se aprobarán en asamblea extraordinaria con el voto favorable de al menos las dos terceras partes de los asistentes hábiles.'
				}
			]
		}
	];

	const statutesMetadata = {
		version: '2025',
		lastUpdate: 'Junio 2025'
	};

	const state = {
		currentChapter: statutesChapters[0]?.id || null
	};

	const simulateAction = (message) => {
		console.info(`[Estatutos JAC] ${message}`);
	};

	const createArticleNode = (article) => {
		const section = document.createElement('section');
		section.className = 'estatutos-article';

		const title = document.createElement('h4');
		title.className = 'estatutos-article__title';
		title.textContent = article.title;
		section.appendChild(title);

		if (article.description) {
			const description = document.createElement('p');
			description.className = 'estatutos-article__description';
			description.textContent = article.description;
			section.appendChild(description);
		}

		if (Array.isArray(article.points) && article.points.length) {
			const list = document.createElement('ol');
			list.className = 'estatutos-article__list';
			article.points.forEach((point) => {
				const item = document.createElement('li');
				item.textContent = point;
				list.appendChild(item);
			});
			section.appendChild(list);
		}

		return section;
	};

	const renderChapterContent = (chapterId) => {
		const chapter = statutesChapters.find((entry) => entry.id === chapterId);
		if (!chapter || !elements.chapterBody || !elements.chapterChip || !elements.chapterTitle) return;

		elements.chapterChip.textContent = chapter.label;
		elements.chapterTitle.textContent = `${chapter.label} - ${chapter.title}`;
		if (elements.chapterSummary) {
			elements.chapterSummary.textContent = chapter.summary;
		}

		const fragment = document.createDocumentFragment();
		chapter.articles.forEach((article) => {
			fragment.appendChild(createArticleNode(article));
		});

		elements.chapterBody.innerHTML = '';
		elements.chapterBody.appendChild(fragment);
	};

	const setActiveButton = (chapterId) => {
		if (!elements.chaptersList) return;
		const buttons = elements.chaptersList.querySelectorAll('.estatutos-nav__button');
		buttons.forEach((btn) => {
			if (btn.dataset.chapter === chapterId) {
				btn.classList.add('is-active');
				btn.setAttribute('aria-current', 'true');
			} else {
				btn.classList.remove('is-active');
				btn.removeAttribute('aria-current');
			}
		});
	};

	const renderChaptersList = () => {
		if (!elements.chaptersList) return;
		const fragment = document.createDocumentFragment();
		statutesChapters.forEach((chapter) => {
			const listItem = document.createElement('li');
			listItem.className = 'estatutos-nav__item';
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'estatutos-nav__button';
			button.dataset.chapter = chapter.id;

			const label = document.createElement('span');
			label.className = 'estatutos-nav__label';
			label.textContent = chapter.label;
			const title = document.createElement('span');
			title.className = 'estatutos-nav__title';
			title.textContent = chapter.title;
			const summary = document.createElement('p');
			summary.className = 'estatutos-nav__summary';
			summary.textContent = chapter.summary;

			button.append(label, title, summary);
			button.addEventListener('click', () => {
				state.currentChapter = chapter.id;
				renderChapterContent(chapter.id);
				setActiveButton(chapter.id);
			});
			listItem.appendChild(button);
			fragment.appendChild(listItem);
		});
		elements.chaptersList.innerHTML = '';
		elements.chaptersList.appendChild(fragment);
		setActiveButton(state.currentChapter);
	};

	const renderMetrics = () => {
		const totals = statutesChapters.reduce((acc, chapter) => {
			acc.chapters += 1;
			acc.articles += chapter.articles.length;
			acc.points += chapter.articles.reduce((memo, article) => {
				if (Array.isArray(article.points)) {
					return memo + article.points.length;
				}
				return memo;
			}, 0);
			return acc;
		}, { chapters: 0, articles: 0, points: 0 });

		if (elements.metrics.chapters) elements.metrics.chapters.textContent = totals.chapters;
		if (elements.metrics.articles) elements.metrics.articles.textContent = totals.articles;
		if (elements.metrics.points) elements.metrics.points.textContent = totals.points;
	};

	const setMetadata = () => {
		if (elements.meta.version) elements.meta.version.textContent = statutesMetadata.version;
		if (elements.meta.lastUpdate) elements.meta.lastUpdate.textContent = statutesMetadata.lastUpdate;
	};

	const bindDownloadButton = () => {
		if (!elements.downloadBtn) return;
		elements.downloadBtn.addEventListener('click', () => {
			simulateAction('Descarga de estatutos iniciada.');
			const originalText = elements.downloadBtn.innerHTML;
			elements.downloadBtn.innerHTML = '<i class="ri-check-line" aria-hidden="true"></i>Descargado';
			setTimeout(() => {
				elements.downloadBtn.innerHTML = originalText;
			}, 1500);
		});
	};

	const init = () => {
		if (!state.currentChapter) return;
		setMetadata();
		renderMetrics();
		renderChaptersList();
		renderChapterContent(state.currentChapter);
		bindDownloadButton();
	};

	init();
})();
