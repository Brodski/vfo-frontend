Project webpage: betteryoutube.dns-cloud.net

About  

N-tier web app with Presentation, Logic, and Data layer.
Backend using Java, Spring Boot framework, with MongoDB for data persistence.
Frontend: React framework & materialize css framework.
Everything is hosted on one VM; the http server, backend server, & mongoDB are all in one VM in Google's Cloud Platform.


Authorization & Authentication
Client
Through OAuth2, the user authorizes the client to view his Youtube profile, ie his Youtube subscriptions. Uses OAuth2 for the [https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps](client-side-flow)  

Backend Server
User authorization is based on a guide by Google( [https://developers.google.com/identity/sign-in/web/server-side-flow](Authenticate With a Backend Server, Sign In for Websites). Basicly, when the user clicks "Save" the client sents a id token to the backend. This token is sent to Google where they verify the legitamcy of the user and responds back to my server.



Getting Started (for development):  
  Start HTTP Server
1) Get api-key.js from me.  
2) Put "api-key.js" in "src/"   
3) $ npm install   
4) $ npm start   
5) Open [http://localhost:3000](http://localhost:3000) to view it in the browser.   

  Start Backend Server:
1) Have mongodb installed and have its service running
2) Get SecretKeyz.java from me.
3) Put "SecretKeyz.java" in  "src/main/java/com/Brodski/restApi"
4) $ mvn spring-boot:run
5a) App should be listening on port 8080
5b) Verify at [http://localhost:8080/](http://localhost:8080/) to view a message of "Hello!!!" 

See deployment.txt for info on deploying this to your own VM

------------------------------------------------------------------------------
  
  
Domain name (free) provided by [https://www.cloudns.net/](Cloud DNS) 
















This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
