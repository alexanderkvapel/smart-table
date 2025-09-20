// Адрес сервера
const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';


/**
 * Функция инициализации данных
 * @returns {Object} { getIndexes, getRecords}
 */
export function initData() {
    // Переменные для кеширования
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    /**
     * Функция для приведения строк в тот вид, который нужен нашей таблице
     * @param {*} data 
     * @returns {Object} { id, date, seller, customer, total }
     */
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount,
    }));

    /**
     * Функция для получения индексов
     * @returns {Object} { seller, customers }
     */
    const getIndexes = async () => {
        // Если индексы еще не установлены, то получаем их через запросы
        if (!sellers || !customers) {
            // Запрашиваем и деструктурируем в уже объявленные переменные sellers и customers
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(respone => respone.json()),
                fetch(`${BASE_URL}/customers`).then(respone => respone.json()),
            ]);
        }

        return { sellers, customers };
    }
    
    /**
     * Функция для получения записей о продажах с сервера
     * @param {Object} query параметры запроса
     * @param {boolean} isUpdated нужен, чтобы иметь возможность делать запрос без кеша
     * @returns {Object} { total, items }
     */
    const getRecords = async (query, isUpdated = false) => {
        // Преобразуем объект параметров в SearchParams-объект, представляющий query часть url 
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        // Если параметры запроса не поменялись
        if (lastQuery === nextQuery && !isUpdated) {
            // Отдаем сохраненные ранее данные
            return lastResult;
        }

        // Если прошлый query не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        // Сохраняем в кеш для следующих запросов
        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items),
        }

        return lastResult;
    }
    
    return {
        getIndexes,
        getRecords
    }
}
