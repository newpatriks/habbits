var Services = class Services {
    constructor(url, token) {
        this.token = token;
        this.apiURL = url;
    }

    get(dataSource, attr) {
        let buildURL = this.apiURL + dataSource;
        buildURL += '?oauth_token=' + this.token;
        buildURL += '&v=20170121';
        if (attr) {
            buildURL += '&v=20170121'+attr;
        }

        const myInit = {
            method: 'GET'
        };
        return fetch(buildURL, myInit);
    }
};

export default Services;
