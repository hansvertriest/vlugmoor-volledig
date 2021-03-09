# Deployment Guide

This web-application consists of three important components. On the frontend there's the webpage. On the backend we have a database storing all the data of saved simulations. Connecting these two components is the server. Whenever the webpage needs data of a particular simulation, it sends a call to the server. The server goes looking for the requested data in de database and sends it back to the webpage.

Everyone of these components have to be put online seperately. There are a lot of ways to do this. We'll be discussing how we would host the application using available online tools.

# Hosting the frontend

When looking at the ./client folder, we see a lot of files and directories. Luckily, we can compile all of these into a single .html and .js file by running the following command in the ./client folder:

```jsx
npm run build
```

This command will create a ./docs folder next to the ./client folder. This is the folder we will be putting online. Important note, whenever making any changes to the files in the ./client folder, these file will have to be compiled again using the same command.

The easiest way to host this /docs folder is to use Github-Pages. For this method to work, we have to create a Github repository where we upload the project to. Then we go to the settings of this repository. Scrolling down we'll find a section "Github-Pages".  Over there we are able to host our ./docs folder. We do this by firstly selecting the master branch, next we select the ./docs folder. Clicking save will reload the page. Scrolling down again we are presented by a message telling us our site is ready to be published at a Github domain. Scrolling down just a bit further there's an option to add our own domain. This too, is fairly easy, but requires a few changes in the DNS settings of this domain. Clicking Learn more will teach us more about that.

Seperately, from Github, a lot of hosting platforms allow the user to upload a few files to host their website. This might be the case when hosting through the UGent IT-system. To achieve this, just upload the contents of the ./docs folder. The platform should automatically detect the index.html file which is the entry-file to hosting the webpage.

In ./client/src/const.js adjust BASE_URL to rest API url from server.

export const BASE_URL = 'http://localhost:8080';

# Hosting the database

Our database is a MongoDB database. This is a noSQL database. This means, in contrast to SQL databases, the data is not stored in tables with records and columns. Rather it uses a document-based model, which basically resembles the JSON-notation. 

The easiest way to host a mongoDB database is to head over to [https://cloud.mongodb.com](https://cloud.mongodb.com/) and sign up. When you have an account, in the upper left corner, we can create a new project. We will be asked to name the project and optionally to add members. After clicking Create Project, in the center of the screen, we see a green button "Build Cluster". 

- Click it so now we can choose the type of cluster. Because our web-application won't be used by a lot of people at the same time, the free option will certainly suffice. The Shared (M2 Cluster) offers a backup service, but this  costs $9/month.
- After selecting an option, we can configure our new database. We can choose between AWS, Google Cloud and Azure. It's recommended to use Google Cloud.
- Next we choose the location of the database. The closer to home the better.
- Next up is the cluster tier. Because of the small scale of the project, the simplest option will do.
- In additional settings we can choose a backup service if desired, along with other extra's.
- Lastly we can name our cluster.

After configuring the cluster, we are redirected to a overview of all clusters in our project. Here we see that our cluster is being created. After this is done, click connect to connect the server to the database.

- Firstly we have to add the ip address of our server. As our server may not be hosted yet, click **Allow access from anywhere**. Make sure to change this setting once the server is hosted.
- Next we create an administrator user to acces the database. It is recommended to use **Autogenerate Secure Password**.
- We click **Choose a connection** method and choose **Connect your application**
- In the first step we select Node.js and version 3.6 or later
- The second step presents us with a connection string. This string has to be copy-pasted in our project's ./server/.env file. This file should not be automatically present in any Github Repositories as it contains secret passwords and variables. You should be getting the initial contents of this file from the developers. (Note: this file may not be visible in regular file-explorer's. Using a code editor like Visual Studio code or tweaking the view setting of your specific file editor will solve this. ) The string should be present in this file as follows:

```jsx
MONGODB_CONNECTION=mongodb+srv://dbUser:password@cluster0test.y8f9j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

Where dbUser and password is replaced with the user credentials of the administrator user.

Now our database should be connected to the server. We should by able to test this by running the server locally. If no error's are logged, our database has been successfully connected.

To run the server locally run the following command in ./server:

```jsx
npm install && npm run watch:serve
```

It's also possible to host a mongoDB server yourself. More info can be found [here](https://marketplace.digitalocean.com/apps/mongodb).

# Hosting the server

Create a .env file for variables 

NMD_BASELINE='Like Graphics Love Code' 
NODE_DOCS=true
NODE_ENV=development or production 
NODE_SERVER_HOST=localhost  
NODE_SERVER_PORT=8080 
NODE_SERVER_PROTOCOL=8080
MONGODB_CONNECTION=mongodb+srv://dbUser:<password>@cluster0test.y8f9j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
AUTH_BCRYPT_SALT=10 
AUTH_JWT_SECRET=gdm-nmd
AUTH_JWT_SESSION=false
