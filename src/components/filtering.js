/**
 * Инициализация фильтров в таблице
 * @param {*} elements Селект, куда добавляем опции для фильтрации
 * @param {*} indexes Опции для фильтрации
 * @returns { updateIndexes, applyFiltering }
 */
export function initFiltering(elements) {
  /**
   * Функция заполнения выпадающих списков фильров опциями для филтрации
   * @param {*} elements Селект, куда добавляем опции для фильтрации
   * @param {*} indexes Опции для фильтрации
   */
  const updateIndexes = (elements, indexes) => {
    // Заполняем выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
      // В каждый элемент добавляем опции
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map(name => {
          // Создаем и возвращаем тег опции
          const option = document.createElement('option');

          option.textContent = name;
          option.value = name;

          return option;
        })
      )
    });
  };

  /**
   * Функция перерисовки при применении фильтра
   * @param {*} query Параметры запроса
   * @param {Object} state Состояние полей
   * @param {String} action Действие для фильтрации
   */
  const applyFiltering = (query, state, action) => {
    const filter = {};

    // Обрабатываем очистку поля
    if (action && action.name === 'clear') {
      // Находим родительский элемент
      const parent = action.parentElement; 
      // Находим input
      const input = parent.querySelector('input'); 
      const fieldToClear = action.dataset.field;

      // Сбрасываем значение поля
      if (input) {
        input.value = '';
      }

      // Обновляем состояние фильтра
      if (fieldToClear) {
        state[fieldToClear] = '';
      }
    };

    Object.keys(elements).forEach(key => {
      if (elements[key]) {
        // ищем поля ввода в фильтре с непустыми данными
        if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
          // чтобы сформировать в query вложенный объект фильтра
          filter[`filter[${elements[key].name}]`] = elements[key].value; 
        }
      }
    });

    // если в фильтре что-то добавилось, применим к запросу
    return Object.keys(filter).length 
            ? Object.assign({}, query, filter) 
            : query;
  };

  return {
    updateIndexes,
    applyFiltering
  };
}
