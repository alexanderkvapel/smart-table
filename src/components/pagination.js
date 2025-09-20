import { getPages } from '../lib/utils.js';

/**
 * Пагинация
 * @param {*} { pages, fromRow, toRow, totalRow } 
 * @param {*} createPage Функция заполнения кнопок страниц данными
 * @returns {Object} { updatePagination, applyPagination }
 */
export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
  // Подготовим шаблон кнопки для страницы и очистим контейнер
  // В качестве шаблона берем первый элемент
  const pageTemplate = pages.firstElementChild.cloneNode(true); 

  // Общее кол-во страниц
  let pageCount;

  // Очищаем таблицу от данных
  pages.firstElementChild.remove();

  /**
   * Функция инициализации пагинации
   * @param {*} query Параметры запроса
   * @param {Object} state Состояние полей
   * @param {String} action Действие для пагинации
   */
  const applyPagination = (query, state, action) => {
    // Кол-во строк на странице
    const limit = state.rowsPerPage;
    // Переменная страницы
    let page = state.page;

    // Обработаем действия перехода на ...
    if (action) switch (action.name) {
      // предыдущую страницу
      case "prev": 
        page = Math.max(1, +page - 1);
        break;
      // следующую страницу
      case "next": 
        page = Math.min(pageCount, +page + 1);
        break;
      // первую страницу
      case "first": 
        page = 1;
        break;
      // последнюю страницу
      case "last": 
        page = pageCount;
        break;
    }

    return Object.assign({}, query, { limit, page });
  };

  /**
   * Функция перерисовки пагинации
   * @param {Number} total 
   * @param {} { номер текущей страницы, лимит записей на одну страницу }  
   */
  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // Массив страниц для отображения
    const visiblePages = getPages(page, pageCount, 5);

    pages.replaceChildren(...visiblePages.map(pageNumber => {
      // Клонируем шаблон, который запомнили ранее
      const el = pageTemplate.cloneNode(true);
      // Вызываем колбэк из настроек, чтобы заполнить кнопку данными
      return createPage(el, pageNumber, pageNumber === page);
    }));

    // Обновляем статус пагинации
    // С какой строки выводим
    fromRow.textContent = (page - 1) * limit + 1;
    // До какой страницы выводим
    toRow.textContent = Math.min((page * limit), total);
    // Сколько всего строк выводим на всех страницах вместе
    totalRows.textContent = total;
  };

  return { 
    updatePagination, 
    applyPagination 
  };
};
