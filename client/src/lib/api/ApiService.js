export default class ApiService {
    constructor() {
        this.BASE_URL = "http://localhost:8080/api";
    }

    queryParams (options) {
        return Object.keys(options)
        .map(key => encodeURIComponent(key) + '=' +encodeURIComponent(options[key])).join('&');
    }

   /*
    *   Metadata functions
    */

    // find all meta data 

    async findAllMetaData (query = null) {
        let url = `${this.BASE_URL}/metadata`;
        if (query !== null) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + this.queryParams(query);
        }
        const response =  await fetch(url);
        
        return response.json();
    }

    // store metadata to server

    async storeMetaData (title, description, date, picture, _dataId) {
        const metaData = {
            title: title, 
            description: description,
            date: date,
            picture: picture,
            _dataId: _dataId
        }
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

    // find by id

    async findMetaDataById (id) {
        let url = `${this.BASE_URL}/metadata/${id}`;
        const response = await fetch(url);
        return response.json();
    }

    

   /*
    *   Data functions
    */

    // store data to server

    async storeData (data) {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        let url = `${this.BASE_URL}/data`;
        const response = await fetch(url, options).then((result) => result.json());
        console.log(response);
        return response;
    }

    // find by id

    async findDataById (id) {
        let url = `${this.BASE_URL}/data/${id}`;
        const response = await fetch(url);
        return response.json();
    }



}