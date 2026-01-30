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
const api = initData(sourceData);

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
async function render(action) {
    let state = collectState();
    let query = {};


    // 1) поиск
    query = applySearching(query, state, action);

    // 2) фильтры
    query = applyFiltering(query, state, action);

    // 3) сортировка
    query = applySorting(query, state, action);

    // 4) пагинация
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрами

    updatePagination(total, query); // перерисовываем пагинатор
    sampleTable.render(items);
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

const { applyFiltering, updateIndexes } = initFiltering(
    sampleTable.filter.elements,
    {}
);


const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const {applyPagination, updatePagination} = initPagination(sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    });

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchByCustomer: indexes.customers,
        searchBySeller: indexes.sellers
    });
}

init().then(render);
