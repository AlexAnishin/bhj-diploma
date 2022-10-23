/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
    /**
     * Устанавливает текущий элемент в свойство element
     * Регистрирует обработчики событий с помощью
     * AccountsWidget.registerEvents()
     * Вызывает AccountsWidget.update() для получения
     * списка счетов и последующего отображения
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * */
    constructor(element) {
        if (element) {
            this.element = element;
            this.update();
            this.registerEvents();
        } else {
            throw new Error('Элемент не найден');
        }
    }

    /**
     * При нажатии на .create-account открывает окно
     * #modal-new-account для создания нового счёта
     * При нажатии на один из существующих счетов
     * (которые отображены в боковой колонке),
     * вызывает AccountsWidget.onSelectAccount()
     * */
    registerEvents() {
        // При нажатии на .create-account открывает окно
        // #modal-new-account для создания нового счёта
        document.querySelector('.create-account').addEventListener('click', (e) => {
            e.preventDefault();
            App.getModal('createAccount').open();
        });

        // При нажатии на один из существующих счетов
        // (которые отображены в боковой колонке),
        // вызывает AccountsWidget.onSelectAccount()
        [...this.element.querySelectorAll('.account')].forEach((menuItem) => {
            menuItem.addEventListener('click', (e) => {
                this.onSelectAccount(e.currentTarget);
            });
        });
    }

    /**
     * Метод доступен только авторизованным пользователям
     * (User.current()).
     * Если пользователь авторизован, необходимо
     * получить список счетов через Account.list(). При
     * успешном ответе необходимо очистить список ранее
     * отображённых счетов через AccountsWidget.clear().
     * Отображает список полученных счетов с помощью
     * метода renderItem()
     * */
    update() {
        if (User.current()) {
            Account.list(User.current(), (error, response) => {
                if (response.success) {
                    this.clear();
                    this.renderItem(response.data);
                    this.registerEvents();
                } else {
                    throw new Error('Произошла ошибка' + error);
                }
            });
        }
    }

    /**
     * Очищает список ранее отображённых счетов.
     * Для этого необходимо удалять все элементы .account
     * в боковой колонке
     * */
    clear() {
        [...this.element.querySelectorAll('.account')].forEach((elem) => {
            elem.remove();
        });
    }

    /**
     * Срабатывает в момент выбора счёта
     * Устанавливает текущему выбранному элементу счёта
     * класс .active. Удаляет ранее выбранному элементу
     * счёта класс .active.
     * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
     * */
    onSelectAccount(element) {
        [...this.element.querySelectorAll('.account')].forEach((link) => {
            link.classList.remove('active');
        });

        element.classList.add('active');

        App.showPage('transactions', {
            account_id: element.dataset.id
        });
    }

    /**
     * Возвращает HTML-код счёта для последующего
     * отображения в боковой колонке.
     * item - объект с данными о счёте
     * */
    getAccountHTML(item) {
        const accountNameElement = document.createElement('span');
        accountNameElement.textContent = item.name;

        const accountSumElement = document.createElement('span');
        accountSumElement.textContent = item.sum;

        const accountLinkElement = document.createElement('a');
        accountLinkElement.href = '#';
        accountLinkElement.appendChild(accountNameElement);
        accountLinkElement.appendChild(accountSumElement);

        const accountElement = document.createElement('li');
        accountElement.className = 'account';
        accountElement.dataset.id = item.id;
        accountElement.appendChild(accountLinkElement);
        return accountElement;
    }

    /**
     * Получает массив с информацией о счетах.
     * Отображает полученный с помощью метода
     * AccountsWidget.getAccountHTML HTML-код элемента
     * и добавляет его внутрь элемента виджета
     * */
    renderItem(data) {
        data.forEach((item) => {
            this.element.appendChild(this.getAccountHTML(item));
        });
    }
}