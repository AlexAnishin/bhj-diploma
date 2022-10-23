/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
    /**
     * Устанавливает полученный элемент
     * в свойство element.
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * */
    constructor(element) {
            if (element) {
                this.element = element;
                this.registerEvents();
            } else {
                throw new Error('Элемент не найден');
            }
        }
        /**
         * Регистрирует обработчики нажатия на
         * кнопки «Новый доход» и «Новый расход».
         * При нажатии вызывает Modal.open() для
         * экземпляра окна
         * */
    registerEvents() {
        this.registerNewIncomeEvents();
        this.registerNewExpenseEvents();
    }

    registerNewIncomeEvents() {
        this.element.querySelector('.create-income-button').addEventListener('click', (e) => {
            App.getModal('newIncome').open();
        });
    }

    registerNewExpenseEvents() {
        this.element.querySelector('.create-expense-button').addEventListener('click', (e) => {
            App.getModal('newExpense').open();
        });
    }
}