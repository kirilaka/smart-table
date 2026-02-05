export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {

    if (action && action.name === 'clear') {
        const field = action.dataset.field;
        state[field] = '';
    }

    const filter = {};

    Object.keys(state).forEach((key) => {
        const value = state[key];

        if (!value) return;

        // исключаем служебные поля + search
        if ([
            'page',
            'rowsPerPage',
            'total',
            'totalFrom',
            'totalTo',
            'search'      // ← ВОТ ЭТО ВАЖНО
        ].includes(key)) return;

        filter[`filter[${key}]`] = value;
    });

    return Object.keys(filter).length
        ? { ...query, ...filter }
        : query;
};



    return {
        updateIndexes,
        applyFiltering
    }
}

