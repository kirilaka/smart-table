import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        // Если нажали кнопку сортировки
        if (action && action.name === 'sort') {

            // #3.1 — переключаем режим по кругу из sortMap
            action.dataset.value = sortMap[action.dataset.value] ?? 'none';

            field = action.dataset.field;
            order = action.dataset.value;

            // #3.2 — сбрасываем остальные сортировки
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } 
        
        // #3.3 — если не нажимали, нужно взять активную сортировку
        else {
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }
        
        const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    
    }
}
