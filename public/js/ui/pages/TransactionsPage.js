/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
        if (element) {
            this.element = element;
            this.lastOptions = null;
            this.registerEvents();
        } else {
            throw new Error('Элемент не найден');
        }
    }

    /**
     * Вызывает метод render для отрисовки страницы
     * */
    update() {
        if (this.lastOptions) {
            this.render(this.lastOptions);
        }
    }

    /**
     * Отслеживает нажатие на кнопку удаления транзакции
     * и удаления самого счёта. Внутри обработчика пользуйтесь
     * методами TransactionsPage.removeTransaction и
     * TransactionsPage.removeAccount соответственно
     * */
    registerEvents() {
        this.element.querySelector('.remove-account').onclick = this.removeAccount.bind(this);

        [...this.element.getElementsByClassName('transaction__remove')].forEach((button) => {
            button.addEventListener('click', () => {
                this.removeTransaction(button.dataset.id);
            });
        });
    }

    /**
     * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
     * Если пользователь согласен удалить счёт, вызовите
     * Account.remove, а также TransactionsPage.clear с
     * пустыми данными для того, чтобы очистить страницу.
     * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
     * либо обновляйте только виджет со счетами и формы создания дохода и расхода
     * для обновления приложения
     * */
    removeAccount() {
        if (confirm(`Вы действительно хотите удалить счет #: ${this.lastOptions.account_id}?`)) {
            Account.remove({ id: this.lastOptions.account_id }, (error, response) => {
                if (response.success) {
                    this.clear();
                    App.updateWidgets();
                } else {
                    throw new Error('Произошла ошибка' + error);
                }
            });
        }
    }

    /**
     * Удаляет транзакцию (доход или расход). Требует
     * подтверждеия действия (с помощью confirm()).
     * По удалению транзакции вызовите метод App.update(),
     * либо обновляйте текущую страницу (метод update) и виджет со счетами
     * */
    removeTransaction(id) {
        if (confirm(`Вы действительно хотите тразакцию счет #: ${id}?`)) {
            Transaction.remove({ account_id: this.lastOptions.account_id, id, }, (err, response) => {
                if (response.success) {
                    App.update();
                } else {
                    throw new Error('Произошла ошибка' + error);
                }
            });
        }
    }

    /**
     * С помощью Account.get() получает название счёта и отображает
     * его через TransactionsPage.renderTitle.
     * Получает список Transaction.list и полученные данные передаёт
     * в TransactionsPage.renderTransactions()
     * */
    render(options) {
        this.lastOptions = {...options };

        if (!options) {
            return;
        }

        Account.get(options.account_id, (error, response) => {
            if (response.success) {
                this.renderTitle(response.data.name);
                Transaction.list(options, (error, response) => {
                    if (response.success) {
                        this.renderTransactions(response.data);
                        this.registerEvents();
                    } else {
                        throw new Error('Произошла ошибка' + error);
                    }
                });
            } else {
                throw new Error('Произошла ошибка' + error);
            }
        });
    }

    /**
     * Очищает страницу. Вызывает
     * TransactionsPage.renderTransactions() с пустым массивом.
     * Устанавливает заголовок: «Название счёта»
     * */
    clear() {
        this.renderTransactions([]);
        this.renderTitle('Название счёта');
        this.lastOptions = null;
    }

    /**
     * Устанавливает заголовок в элемент .content-title
     * */
    renderTitle(name) {
        this.element.querySelector('.content-title').textContent = name;
    }

    /**
     * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
     * в формат «10 марта 2019 г. в 03:20»
     * */
    formatDate(date) {
        const dataObject = new Date(date);
        const monthName = {
            0: 'января',
            1: 'февраля',
            2: 'марта',
            3: 'апреля',
            4: 'мая',
            5: 'июня',
            6: 'июля',
            7: 'августа',
            8: 'сентября',
            9: 'октября',
            10: 'ноября',
            11: 'декабря',
        }[dataObject.getMonth()];
        const hours = dataObject.getHours() < 10 ? '0' + dataObject.getHours() : dataObject.getHours();
        const minutes = dataObject.getMinutes() < 10 ? '0' + dataObject.getMinutes() : dataObject.getMinutes();
        return dataObject.getDate() + ' ' + monthName + ' ' + dataObject.getFullYear() + ' г. в ' + hours + ':' + minutes;
    }

    /**
     * Формирует HTML-код транзакции (дохода или расхода).
     * item - объект с информацией о транзакции
     * */
    getTransactionHTML(item) {
        // transaction__details/transaction__icon
        let transactionDetailsIconValue = document.createElement("span");
        transactionDetailsIconValue.className = 'fa fa-money fa-2x';
        let transactionDetailsIcon = document.createElement("div");
        transactionDetailsIcon.className = 'transaction__icon';

        // transaction__details/transaction__info
        let transactionDetailsInfoTitle = document.createElement("h4");
        transactionDetailsInfoTitle.className = 'transaction__title';
        transactionDetailsInfoTitle.innerText = item.name;
        let transactionDetailsInfoDate = document.createElement("div");
        transactionDetailsInfoDate.className = 'transaction__date';
        transactionDetailsInfoDate.innerText = this.formatDate(item.created_at);
        let transactionDetailsInfo = document.createElement("div");
        transactionDetailsInfo.className = 'transaction__info';
        transactionDetailsInfo.appendChild(transactionDetailsInfoTitle);
        transactionDetailsInfo.appendChild(transactionDetailsInfoDate);

        // transaction__details/transaction__sum
        let transactionSumCurrency = document.createElement("span");
        transactionSumCurrency.innerText = 'Р';
        let transactionSum = document.createElement("div");
        transactionSum.className = 'transaction__summ';
        transactionSum.innerText = '$' + item.sum;
        transactionSum.appendChild(transactionSumCurrency);
        let transactionSumCol = document.createElement("div");
        transactionSumCol.className = 'col-md-3';
        transactionSumCol.appendChild(transactionSum);

        // transaction__details/transaction__controls
        let transactionControlsButtonIcon = document.createElement("i");
        transactionControlsButtonIcon.className = 'fa fa-trash';
        let transactionControlsButton = document.createElement("button");
        transactionControlsButton.className = 'btn btn-danger transaction__remove';
        transactionControlsButton.dataset.id = item.id;
        transactionControlsButton.appendChild(transactionControlsButtonIcon);
        let transactionControls = document.createElement("div");
        transactionControls.className = 'col-md-2 transaction__controls';
        transactionControls.appendChild(transactionControlsButton);

        // transaction__details
        let transactionDetailsElement = document.createElement("div");
        transactionDetailsElement.className = 'col-md-7 transaction__details';
        transactionDetailsElement.appendChild(transactionDetailsIcon);
        transactionDetailsElement.appendChild(transactionDetailsInfo);
        transactionDetailsElement.appendChild(transactionSumCol);
        transactionDetailsElement.appendChild(transactionControls);

        // transaction
        let transactionElement = document.createElement("div");
        transactionElement.className = 'transaction row ' + (item.type === 'income' ? 'transaction_income' : 'transaction_expense');
        transactionElement.appendChild(transactionDetailsElement);
        return transactionElement;
    }

    /**
     * Отрисовывает список транзакций на странице
     * используя getTransactionHTML
     * */
    renderTransactions(data) {
        const transactionsList = this.element.querySelector('.content');
        transactionsList.innerHTML = '';
        if (data.length) {
            data.forEach((item) => {
                transactionsList.appendChild(this.getTransactionHTML(item));
            });
        }
    }
}