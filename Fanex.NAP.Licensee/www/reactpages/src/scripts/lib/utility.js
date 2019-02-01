const DEFAULT_TIME_DELAY = 500;

export default class Utility {
    static getTodayString() {
        return this.getDateString(new Date());
    }

    static getDateString(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}/${date.getFullYear()}`;
    }

    static showMessage(msg) {
        window.alert(msg);
    }

    static showErrorMessage(msg) {
        const content = '<p class="red"><b>Error:</b></p>' + msg;
        window.alert(content);
    }

    static showWarningMessage(msg) {
        const content = '<p class="orange"><b>Warning:</b></p>' + msg;
        window.alert(content);
    }

    static debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this,
                args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait || DEFAULT_TIME_DELAY);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }
}