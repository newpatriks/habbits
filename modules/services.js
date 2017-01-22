var Services = class Services {
    constructor(url, token) {
        this.token = token;
        this.apiURL = url;
    }

    get(dataSource) {
        let buildURL = this.apiURL + dataSource;
        buildURL += '?oauth_token=' + this.token;
        buildURL += '&v=20170121';

        const myInit = {
            method: 'GET'
        };
        return fetch(buildURL, myInit);
    }
};

export default Services;
