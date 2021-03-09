import * as consts from '../.././const';

export default class ApiService {
    constructor() {
        this.BASE_URL = "http://localhost:8080/api";
        this.CONST_URL = `${consts.BASE_URL}/api`
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
        let url = `${this.CONST_URL}/metadata`;
        if (query !== null) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + this.queryParams(query);
        }
        const response =  await fetch(url);
        
        return response.json();
    }

    // store metadata to server

    async storeMetaData (title, description, date, picture, caseDataPath, coordsPath, forcesPath, windPath) {
        const metaData = {
            title: title, 
            description: description,
            date: date,
            picture: picture,
            caseDataPath: caseDataPath,
            coordsPath: coordsPath,
            forcesPath: forcesPath,
            windPath: windPath,
            published: false,
        }

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metaData)
        };


        let url = `${this.CONST_URL}/metadata`;
        const response = await fetch(url, options);
        return response.json();
    }

    // find by id

    async findMetaDataById (id) {
        let url = `${this.CONST_URL}/metadata/${id}`;
        const response = await fetch(url);
        return response.json();
    }


    async editMetaDataModel (id) {
        const options ={
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        let url = `${this.CONST_URL}/metadata/${id}/edit`;
        const response = await fetch(url, options);
        return response.json();
    };

    async updateMetaData (metaData) {
        const options ={
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(metaData),
        };

        let url = `${this.CONST_URL}/metadata/${metaData.id}`;
        const response = await fetch(url, options);
        return response.json();
    };


    async deleteMetaData (id, mode = 0) {
        const options = {
            method: 'DELETE',
            headers: {
                'Accept': '*/*'
            },
        }
        let url = `${this.CONST_URL}/metadata/${id}?mode=${mode}`;
        const response = await fetch(url, options).then((result) => result);
        console.log(response);
        return response;
    };

    // Store file to server

    async storeDataFile (data) {
        console.log(data);
        const formData = new FormData();
        formData.append('file', data); 
        console.log(formData);
        const options = {
            method: 'POST',
            headers: {
                'Accept': '*/*',
            },
            body: formData
            
        };

        let url = `${this.CONST_URL}/upload`;
        const response = await fetch(url, options).then((result) => result.json());
        return response;
    }

    // find by id

    async findDataById (id) {
        let url = `${this.CONST_URL}/data/${id}`;
        const response = await fetch(url);
        return response.json();
    }

    async findXlsx (filePath) {
        let url = `${this.CONST_URL}/upload/${filePath}`;
        const response = await fetch(url);
        return response.arrayBuffer();
    }

    async findCsv (filePath) {
        let url = `${this.CONST_URL}/upload/${filePath}`;
        const response = await fetch(url);
        return response.text();
    }

    // Delete file from server

    async deleteFile (filePath) {
        let url = `${this.CONST_URL}/upload/${filePath}`;
        const options = {
            method: 'DELETE',
            headers: {
                'Accept': '*/*'
            },
        }
        const response = await fetch(url, options);
        return response;
    };


}