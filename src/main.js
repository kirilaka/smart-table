import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение
import {initPagination} from "./components/pagination.js"
import {initSorting} from "./components/sorting.js"
import {initSearching} from "./components/searching.js"
import {initFiltering} from "./components/filtering.js";

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
    const page = parseInt(state.page) || 1;


    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    let result = [...data];

    // 1) поиск
    result = applySearching(result, state, action);

    // 2) фильтры
    result = applyFiltering(result, state, action);

    // 3) сортировка
    result = applySorting(result, state, action);

    // 4) пагинация
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'], 
    after: ['pagination']
}, render);

document.getElementById('app').appendChild(sampleTable.container);



// Модули
const applySearching = initSearching(sampleTable.search.elements.search);
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchByCustomer: indexes.customers,
    searchBySeller: indexes.sellers
});



const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

render();
