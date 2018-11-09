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
}