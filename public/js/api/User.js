/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
    static URL = '/user';

    /**
     * Устанавливает текущего пользователя в
     * локальном хранилище.
     * */
    static setCurrent(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    /**
     * Удаляет информацию об авторизованном
     * пользователе из локального хранилища.
     * */
    static unsetCurrent() {
        localStorage.removeItem('currentUser');
    }

    /**
     * Возвращает текущего авторизованного пользователя
     * из локального хранилища
     * */
    static current() {
        if (localStorage.getItem('currentUser') === null) {
            return null;
        }
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    /**
     * Получает информацию о текущем
     * авторизованном пользователе.
     * */
    static fetch(callback) {
        createRequest({
            method: 'GET',
            url: this.URL + '/current',
            callback: (error, response) => {
                if (response.success && response.user) {
                    User.setCurrent(response.user);
                } else {
                    User.unsetCurrent();
                }
                callback(error, response);
            }
        });
    }

    /**
     * Производит попытку авторизации.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static login(data, callback) {
        createRequest({
            url: this.URL + '/login',
            method: 'POST',
            data,
            callback: (error, response) => {
                if (response && response.user) {
                    User.setCurrent(response.user);
                }
                callback(error, response);
            }
        });
    }

    /**
     * Производит попытку регистрации пользователя.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static register(data, callback) {
        createRequest({
            url: this.URL + '/register',
            method: 'POST',
            data,
            callback: (error, response) => {
                if (response.success) {
                    User.setCurrent(response.user);
                }
                callback(error, response);
            }
        });
    }

    /**
     * Производит выход из приложения. После успешного
     * выхода необходимо вызвать метод User.unsetCurrent
     * */
    static logout(callback) {
        createRequest({
            url: this.URL + '/logout',
            method: 'POST',
            callback: (error, response) => {
                if (response.success) {
                    User.unsetCurrent();
                }
                callback(error, response);
            }
        });
    }
}