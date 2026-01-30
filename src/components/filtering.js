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
        // код с обработкой очистки поля
        if (action && action.name === 'clear') {

            const wrapper = action.parentElement;
            const input = wrapper.querySelector('input, select');

            if (input) {
                input.value = '';
                const field = action.dataset.field;
                state[field] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];

            if (!el || !['INPUT', 'SELECT'].includes(el.tagName) || !el.value) return;

            if (el.name === 'date') {
                filter['filter[date_from]'] = `${el.value}-01-01`;
                filter['filter[date_to]'] = `${el.value}-12-31`;
                return;
            }

            filter[`filter[${el.name}]`] = el.value;
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}

