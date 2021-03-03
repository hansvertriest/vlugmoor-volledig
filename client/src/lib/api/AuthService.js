import * as jwt from 'jsonwebtoken';


export default class AuthService {
    constructor () {
        this.BASE_URL = "http://localhost:8080/api";
    }

    verifyUserFromLocalStorage () {
        if (JSON.parse(localStorage.getItem('authUser'))) {
          try {
            const token = JSON.parse(localStorage.getItem('authUser')).token;
            if (!token) {
              localStorage.setItem('authUser', null);
              throw new Error('Token is not present on localstorage!');
            }
            const decoded = jwt.verify(token, 'gdm-nmd');
            if (!decoded) {
              localStorage.setItem('authUser', null);
              throw new Error('Couldn\'t decode the token!');
            }
    
            if (decoded.exp > Date.now()) {
              localStorage.setItem('authUser', null);
              throw new Error('Token is expired!')
            }

            return JSON.parse(localStorage.getItem('authUser'));
          } catch (error) {
            return null;
          }
        }
        return null;
    }

    async signInLocal (email, password) {
        const url = `${this.BASE_URL}/auth/signin`;
    
        const body = {
          email,
          password
        };

        console.log(body);
    
        const myHeaders = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        const options = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(body),
          redirect: 'follow'
        };
    
        const response = await fetch(`${url}`, options);
        const user = await response.json();
    
        localStorage.setItem('authUser', JSON.stringify(user));
    
        return user;
    }

    async logout () {
        localStorage.setItem('authUser', null);
        return true;
    }
};