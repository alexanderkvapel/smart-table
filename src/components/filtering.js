import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        // В каждый элемент добавляем опции
        elements[elementName].append(
            ...Object.values(indexes[elementName])
                     .map(name => { 
                         // Создаем и возвращаем тег опции
                         const option = document.createElement('option');

                         option.value = name;
                         option.textContent = name;

                         return option;
                     })
        );
     });

    return (data, state, action) => {
        // Обрабатываем очистку поля
        if (action === 'clear') {
            const parent = action.closest('.table-column'); // Находим родительский элемент
            const input = parent.querySelector('input, select'); // Находим input/select

            // Сбрасываем значение поля
            if (input) {
                input.value = '';
            }

            // Обновляем состояние фильтра
            const fieldToClear = action.dataset.field;
            if (fieldToClear) {
                state[fieldToClear] = '';
            }
        }

        // Отфильтровываем данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}