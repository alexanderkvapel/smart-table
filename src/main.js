import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from './data/dataset_1.js';

import { initData } from './data.js';
import { processFormData } from './lib/utils.js';

import { initTable } from './components/table.js';

import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initSorting } from './components/sorting.js';


/**
 * Инициализация
 */
async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(
    sampleTable.filter.elements, 
    { searchBySeller: indexes.sellers }
  );
}

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  // Приведём количество страниц к числу
  const rowsPerPage = parseInt(state.rowsPerPage);
  // Номер страницы по умолчанию 1 и тоже число
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  // состояние полей из таблицы
  let state = collectState();
  // параметры запроса
  let query = {};

  query = applyPagination(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySearching(query, state, action);
  query = applySorting(query, state, action);

  // Запрашиваем данные с собранными параметрами
  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);

  sampleTable.render(items);
}


const appRoot = document.querySelector('#app');

const api = initData(sourceData);

const sampleTable = initTable(
  {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['table', 'pagination', 'row'],
  },
  render
);

const { applyPagination, updatePagination } = initPagination(
  // Передаём элементы пагинации, найденные в шаблоне
  sampleTable.pagination.elements, 
  // Передаем колбэк, чтобы заполнять кнопки страниц данными
  (element, page, isCurrent) => {
    const input = element.querySelector('input');
    const label = element.querySelector('span');

    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;

    return element;
  }
);
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);
const applySearching = initSearching(sampleTable.search.elements);
const applySorting = initSorting([
  // Передаем массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);


appRoot.appendChild(sampleTable.container);

init().then(render);
