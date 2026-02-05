
export function initSearching(searchField) {

    return function applySearching(query, state, action) {

        if (!state[searchField]) {
            return query;
        }

        return {
            ...query,
            search: state[searchField]
        };
    };
}
