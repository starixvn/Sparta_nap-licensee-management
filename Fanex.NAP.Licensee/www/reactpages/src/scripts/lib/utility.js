const DEFAULT_TIME_DELAY = 500;

export default class Utility {
    static getTodayString() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        return `${today.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    }

    static showMessage(msg) {
        window.alert(msg);
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