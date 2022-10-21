/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
    /**
     * Запускает initAuthLinks и initToggleButton
     * */
    static init() {
        this.initAuthLinks();
        this.initToggleButton();
    }

    /**
     * Отвечает за скрытие/показа боковой колонки:
     * переключает два класса для body: sidebar-open и sidebar-collapse
     * при нажатии на кнопку .sidebar-toggle
     * */
    static initToggleButton() {
        document.querySelector('.sidebar-toggle').addEventListener('click', (e) => {
            document.body.classList.toggle('sidebar-open');
            document.body.classList.toggle('sidebar-collapse');
        });
    }

    /**
     * При нажатии на кнопку входа, показывает окно входа
     * (через найденное в App.getModal)
     * При нажатии на кнопку регастрации показывает окно регистрации
     * При нажатии на кнопку выхода вызывает User.logout и по успешному
     * выходу устанавливает App.setState( 'init' )
     * */
    static initAuthLinks() {
        Sidebar.initLoginLink();
        Sidebar.initRegisterLink();
        Sidebar.initLogoutLink();
    }

    /**
     * При нажатии на кнопку входа, показывает окно входа
     * (через найденное в App.getModal)
     */
    static initLoginLink() {
        document.querySelector('.menu-item_login a').addEventListener('click', (e) => {
            e.preventDefault();
            App.getModal('login').open();
        });
    }

    /**
     * При нажатии на кнопку регастрации показывает окно регистрации
     */
    static initRegisterLink() {
        document.querySelector('.menu-item_register a').addEventListener('click', (e) => {
            e.preventDefault();
            App.getModal('register').open();
        });
    }

    /**
     * При нажатии на кнопку выхода вызывает User.logout и по успешному
     * выходу устанавливает App.setState( 'init' )
     */
    static initLogoutLink() {
        document.querySelector('.menu-item_logout a').addEventListener('click', (e) => {
            e.preventDefault();
            User.logout((error, apiResponse) => {
                if (apiResponse.success) {
                    App.setState('init');
                } else {
                    throw new Error('Произошла ошибка :' + error);
                }
            });
        });
    }
}