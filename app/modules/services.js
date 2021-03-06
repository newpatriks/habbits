var Services = class Services {
    constructor(url, token) {
        this.token = token;
        this.foursqApiUrl = url;
        this.apiURL = 'http://localhost:9000/api/';
        // this.apiURL = 'https://fsq-habits.herokuapp.com/api/';
    }

    get(dataSource, attr) {
        let buildURL = this.foursqApiUrl + dataSource;
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

    createUser(data) {
        $.ajax({
            type: "POST",
            url: this.apiURL + 'profile',
            data: data,
            success: function(res) {
                // console.log(res);
            }
        });
    }

    update(id, data) {
        return $.ajax({
            type: "POST",
            url: this.apiURL + 'checkins',
            data: {id: id, data: data},
            success: function(res) {
                // console.log(res);
            }
        });
    }

    getRequest(URL, method, mode, headers) {
        return new Request(URL, {
        	method: method,
        	mode: mode,
        	headers: headers || new Headers({})
        });
    }

    getHistory(id) {
        return fetch(this.getRequest(this.apiURL + 'history/' + id, 'GET', 'cors'));
    };

    checkUser(id) {
        return fetch(this.getRequest(this.apiURL + 'user/' + id, 'GET', 'cors'));
    };

    getUserCheckins(id) {
        return fetch(this.getRequest(this.apiURL + 'user-checkins/' + id, 'GET', 'cors'));
    };
};

export default Services;
