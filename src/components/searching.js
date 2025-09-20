/**
 * Инициализация поиска
 * @param {*} searchField запрос в строке поиска
 * @returns 
 */
export function initSearching(searchField) {
  return (query, state, action) => {
    // Если в поле поиска что-то введено, применим к запросу
    return state[searchField] 
      ? Object.assign({}, query, { search: state[searchField] })
      : query;
  };
}
