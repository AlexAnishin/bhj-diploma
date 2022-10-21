/**
 * Отправляет AJAX GET запрос на сервер
 */
const createGetRequest = (url, data, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
}

/**
 * Отправляет AJAX POST запрос на сервер
 */
const createPostRequest = (url, responseType, data, callback) => {
    const formData = new FormData();
    if (!!data) {
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
    }
    const xhr = new XMLHttpRequest();
    xhr.responseType = responseType;
    xhr.open('POST', url);
    xhr.onload = function() {
        let error = null;
        if (xhr.status !== 200) {
            error = new Error(xhr.response.statusText);
        } else if (!xhr.response.success) {
            alert(xhr.response.error);
        }
        callback(error, xhr.response);
    };
    xhr.send(formData);
}

/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    if (options.method === 'GET') {
        createGetRequest(options.url, options.data, options.callback);
    }
    if (options.method === 'POST') {
        createPostRequest(options.url, options.responseType, options.data, options.callback);
    }
};