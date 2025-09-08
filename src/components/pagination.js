import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // Подготовим шаблон кнопки для страницы и очистим контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true); // В качестве шаблона берем первый элемент
  pages.firstElementChild.remove();

  return (data, state, action) => {
    const rowsPerPage = state.rowsPerPage; // Кол-во строк на странице
    const pageCount = Math.ceil(data.length / rowsPerPage); // Число страниц
    let page = state.page; // Страница переменной

    // Обработаем действия
    if (action) {
      switch (
        action.name // Переход на...
      ) {
        case "prev": // предыдущую страницу
          page = Math.max(1, page - 1);
          break;
        case "next": // следующую страницу
          page = Math.min(pageCount, page + 1);
          break;
        case "first": // первую страницу
          page = 1;
          break;
        case "last": // последнюю страницу
          page = pageCount;
          break;
      }
    }

    const visiblePages = getPages(page, pageCount, 5); // Получим массив страниц, которые нужно показать, выводим только 5 страниц
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        // Перебираем их и создаём для них кнопку
        const el = pageTemplate.cloneNode(true); // Клонируем шаблон, который запомнили ранее
        return createPage(el, pageNumber, pageNumber === page); // Вызываем колбэк из настроек, чтобы заполнить кнопку данными
      })
    );

    // Обновить статус пагинации
    fromRow.textContent = (page - 1) * rowsPerPage + 1; // С какой строки выводим
    toRow.textContent = Math.min(page * rowsPerPage, data.length); // До какой страницы выводим
    totalRows.textContent = data.length; // Сколько всего строк выводим на всех страницах вместе

    const skip = (page - 1) * rowsPerPage; // Сколько строк нужно пропустить

    return data.slice(skip, skip + rowsPerPage);
  };
};
