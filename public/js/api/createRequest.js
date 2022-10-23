const xhrOnloadCallback = (xhr, callback) => {
    let error = null;
    if (xhr.status !== 200) {
        error = new Error(xhr.response.statusText);
    } else if (xhr.response && !xhr.response.success) {
        alert(xhr.response.error);
    }
    callback(error, xhr.response);
}

/**
 * Отправляет AJAX GET запрос на сервер
 */
const createGetRequest = (url, data, callback) => {
    const formData = new FormData();
    if (!!data) {
        url = url + '?' + Object.keys(data).map(key => key + '=' + data[key]).join('&');
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function() { xhrOnloadCallback(xhr, callback); };
    xhr.send();
}

/**
 * Отправляет AJAX POST/PUT|DELETE запрос на сервер
 */
const createPostPutDeleteRequest = (method, url, data, callback) => {
    const formData = new FormData();
    if (!!data) {
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
    }
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url);
    xhr.onload = function() { xhrOnloadCallback(xhr, callback); };
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
    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
        createPostPutDeleteRequest(options.method, options.url, options.data, options.callback);
    }
};