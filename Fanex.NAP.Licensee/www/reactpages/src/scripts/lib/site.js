import axios from 'axios'

export default class Site {
    static getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    static fetchData(param, actionLink, headers = {}) {
        const url = window.rootUrl + actionLink;
        const requestHeaders = Object.assign({
            'X-Requested-With': 'XMLHttpRequest'
        }, headers);

        return axios.post(url, param, {
            headers: requestHeaders
        });
    }
}