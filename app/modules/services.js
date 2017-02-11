var Services = class Services {
    constructor(url, token) {
        this.token = token;
        this.foursqApiUrl = url;
        this.apiURL = 'http://localhost:9000/api/';
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

    checkUser(id) {
        return fetch(this.apiURL + 'user/' + id, {method: 'GET'});
    }

    getUserCheckins(id) {
        return fetch(this.apiURL + 'user-checkins/' + id, {method: 'GET'});
    }
};

export default Services;
