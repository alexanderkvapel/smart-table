import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // Запомним выбранный режим сортировки
      action.dataset.value = sortMap[action.dataset.value]; // Текущее следующее состояние из карты
      field = action.dataset.field; // Информация о сортируемом поле
      order = action.dataset.value; // Направление сортировки

      // Сбросим сортировки остальных колонок
      columns.forEach((column) => {
        // Если это не та кнопка, что нажал пользователь, то сбрасываем ее в начальное состояние
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // Получим выбранный режим сортировки
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          // Ищем колонку, которая находится не в начальном состоянии (предполагаем, что одна)
          field = column.dataset.field; // Сохраняем информацию о сортируемом поле
          order = column.dataset.value; // Сохраняем направление сортировки
        }
      });
    }

    return sortCollection(data, field, order);
  };
}
