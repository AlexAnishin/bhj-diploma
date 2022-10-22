/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
    /**
     * Вызывает родительский конструктор и
     * метод renderAccountsList
     * */
    constructor(element) {
        super(element)
        this.renderAccountsList();
    }

    /**
     * Получает список счетов с помощью Account.list
     * Обновляет в форме всплывающего окна выпадающий список
     * */
    renderAccountsList() {
        if (User.current()) {
            Account.list(User.current(), (error, response) => {
                if (response.success) {
                    const select = this.element.querySelector('select');
                    select.innerHTML = '';
                    response.data.forEach((item) => {
                        const selectOption = document.createElement('option');
                        selectOption.innerText = item.name;
                        selectOption.value = item.id;
                        select.options.add(selectOption);
                    });
                } else {
                    throw new Error('Произошла ошибка' + error);
                }
            });
        }
    }

    /**
     * Создаёт новую транзакцию (доход или расход)
     * с помощью Transaction.create. По успешному результату
     * вызывает App.update(), сбрасывает форму и закрывает окно,
     * в котором находится форма
     * */
    onSubmit(data) {
        Transaction.create(data, (error, response) => {
            if (response.success) {
                App.update();
                App.getModal('newIncome').close();
                App.getModal('newExpense').close();
            } else {
                throw new Error('Произошла ошибка' + error);
            }
        });
    }
}