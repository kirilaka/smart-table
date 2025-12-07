import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {

    // #4.3 — компаратор
    const compare = createComparison(defaultRules);

    // #4.1 — заполняем списки <select> опциями
    Object.keys(indexes).forEach(elementName => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {

        // #4.2 — обработка очистки
        if (action && action.name === 'clear') {

            const wrapper = action.parentElement;
            const input = wrapper.querySelector('input, select');

            if (input) {
                input.value = '';
                const field = action.dataset.field;
                state[field] = '';
            }
        }

        // #4.5 — фильтрация через компаратор
        return data.filter(row => compare(row, state));
    };
}
