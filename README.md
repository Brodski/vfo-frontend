Project webpage: [customyoutube.com](https://customyoutube.com)

# About  

(Still in development)  
It's a cool webiste that lets you organize your youtube subscriptions!  



# Getting Started (for development):  
  
  ### Start Node.js Server  
  ##### Hosts React app (UI)  
1) Get api-key.js from me. (A file with a Youtube Data API key and a Client ID, obtained via Google)  
2) Put "api-key.js" in "src/"   
3) $ npm install   
4) $ npm start   
5) Open [http://localhost:3000](http://localhost:3000) to view it in the browser.   
  
  ### Start Java Server:  
  ##### Hosts Spring Boot app (Data - REST API)  
1) Have mongodb installed and have its service running  
2) Get ActualSecretKeys.java from me.  
3) Put "ActualSecretKeys.java" in  "src/main/java/com/Brodski/restApi"  
4) "application.properties" file should have this line "spring.profiles.active=dev" (not equal to prod)  
5) $ mvn spring-boot:run  
a) App should be listening on port 8080  
b) Verify at [http://localhost:8080/](http://localhost:8080/) to view a message of "Hello!!!"   


#### Backend  
Project repo is [here](https://github.com/Brodski/customyoutube-backend)  

### Tech details  
- A dynamic website based on N-tier architecture with Presentation, Logic, and Data layer.  
- Backend: Java, Spring Boot framework, with MongoDB database.  
- Frontend: React framework, Materialize CSS framework, and SASS.  
- Uses Google's API libraries to authenticate user and to perform REST operations to retrieve all relevent data.
- Everything is hosted on one VM; the frontend server is running on a Node.js server, backend server is running on a Apache Tomcat server through the Spring Boot framework, & mongoDB are all on one VM in Google's Cloud Platform.  
- All endpoints are https secured using Certbot.  


### Authorization & Authentication  
##### Client  
Through OAuth2, the user authorizes the client to view his Youtube profile, ie his Youtube subscriptions. The app follows this [client-side-flow guide by Google](https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps). It implement Google's API client library for JavaScript to perform OAuth2 and all API calls. 

##### Backend Server
User authorization is based on a guide by Google [Authenticate With a Backend Server, Sign In for Websites](https://developers.google.com/identity/sign-in/web/server-side-flow). Basicly, when the user clicks "Save" the client sents a id token to the backend. This token is sent to Google where they verify the legitamcy of the user and responds back to the server.


### Deployment  

See [deployment.txt](./deployment.txt) for info about deploying this to your own VM
