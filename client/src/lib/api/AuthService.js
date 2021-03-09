import * as jwt from 'jsonwebtoken';
import App from '../App';
import * as consts from '../.././const';


export default class AuthService {
    constructor () {
        this.BASE_URL = `${consts.BASE_URL}/api`;
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
        App.router.navigate('/home')
        return user;
    }

    async logout () {
        localStorage.setItem('authUser', null);
        return true;
    }

    async signUp (email, password , firstname, lastname, role) {
        const url = `${this.BASE_URL}/auth/signup`;

        const body = {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            role: role
        };

        console.log(body);

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        };

        const response = await fetch(url, options);
        console.log(response);
        const user = await response.json();
        if (user) {
            App.router.navigate('/home');
        }
    };
};