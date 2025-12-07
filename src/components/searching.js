import {createComparison} from "../lib/compare.js";

export function initSearching(searchField) {

    const compare = createComparison(
        [], 
        [
            (key, sourceValue, targetValue, source, target) => {
                if (key !== 'search') return { continue: true };

                const query = String(targetValue).trim().toLowerCase();
                if (!query) return { skip: true };

                const rowValues = Object.values(source).map(v => String(v).toLowerCase());

                return {
                    result: rowValues.some(v => v.includes(query))
                };
            }
        ]
    );

    return (data, state) => {

        if (state.search && state.search.trim() !== '') {
            return data.filter(row => compare(row, state));
        }

        return data;
    };
}
