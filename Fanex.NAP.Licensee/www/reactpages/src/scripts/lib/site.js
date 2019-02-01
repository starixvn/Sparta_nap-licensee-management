import axios from 'axios';
import Utility from './utility';

axios.interceptors.response.use(response => Promise.resolve(response),
    error => {
        const { response } = error;
        if (response) {
            const { data } = response;
            const status = data && data.ErrCode || response.status;

            switch (status) {
                case 401:
                case 403:
                    location.reload(true);
                    break;
                default:
                    Utility.showErrorMessage('Sorry, an error occurred while processing your request!');
                    break;
            }
        }

        return Promise.reject(error);
    });

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