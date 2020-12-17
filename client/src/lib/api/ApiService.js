export default class ApiService {
    constructor() {
        this.BASE_URL = "http://localhost:8080/api";
    }

    queryParams (options) {
        return Object.keys(options)
        .map(key => encodeURIComponent(key) + '=' +encodeURIComponent(options[key])).join('&');
    }

    async findAllMetaData (query = null) {
        let url = `${this.BASE_URL}/metadata`;
        if (query !== null) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + this.queryParams(query);
        }
        const response =  await fetch(url);
        
        return response.json();
    }

    async storeMetaData (metaData) {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metaData)
        };

        let url = `${this.BASE_URL}/metadata`;
        const response = await fetch(url, options);
        return response.json();
    }


}