import { sortMap } from '../lib/sort.js';

/**
 * Инициализация сортировки
 * @param {*} columns 
 * @returns 
 */
export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === 'sort') {
      // Запомним выбранный режим сортировки
      // Текущее следующее состояние из карты
      action.dataset.value = sortMap[action.dataset.value];
      // Информация о сортируемом поле
      field = action.dataset.field;
      // Направление сортировки
      order = action.dataset.value;

      // Сбросим сортировки остальных колонок
      columns.forEach(column => {
        // Если это не та кнопка, что нажал пользователь
        if (column.dataset.field !== action.dataset.field) {
          // то сбрасываем ее в начальное состояние
          column.dataset.value = 'none';
        }
      });
    } else {
      // Получим выбранный режим сортировки
      columns.forEach(column => {
        // Ищем колонку, которая находится не в начальном состоянии
        if (column.dataset.value !== 'none') {
          // Сохраняем информацию о сортируемом поле
          field = column.dataset.field;
          // Сохраняем направление сортировки
          order = column.dataset.value;
        }
      });
    }

    // Сохраним в переменную параметр сортировки в виде field:direction
    const sort = (field && order !== 'none') ? `${field}:${order}` : null; 

    // Если применена сортировка, применим к запросу
    return sort ? Object.assign({}, query, { sort }) : query; 
  };
}
