Project webpage: [betteryoutube.dns-cloud.net](betteryoutube.dns-cloud.net)

# About  

(Still in development)  
It's a cool webiste that lets you organized your youtube subscriptions!  
### Tech details  
A dynamic website based on N-tier architecture with Presentation, Logic, and Data layer.
Backend: Java, Spring Boot framework, with MongoDB database.
Frontend: React framework & Materialize CSS framework.
Everything is hosted on one VM; the http server, backend server, & mongoDB are all in one VM in Google's Cloud Platform.


### Authorization & Authentication  
##### Client  
Through OAuth2, the user authorizes the client to view his Youtube profile, ie his Youtube subscriptions. Uses OAuth2 for the [client-side-flow](https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps)  

##### Backend Server
User authorization is based on a guide by Google [Authenticate With a Backend Server, Sign In for Websites](https://developers.google.com/identity/sign-in/web/server-side-flow). Basicly, when the user clicks "Save" the client sents a id token to the backend. This token is sent to Google where they verify the legitamcy of the user and responds back to my server.



# Getting Started (for development):  
  
  ### Start HTTP Server
1) Get api-key.js from me.  
2) Put "api-key.js" in "src/"   
3) $ npm install   
4) $ npm start   
5) Open [http://localhost:3000](http://localhost:3000) to view it in the browser.   

  ### Start Backend Server:
1) Have mongodb installed and have its service running
2) Get SecretKeyz.java from me.
3) Put "SecretKeyz.java" in  "src/main/java/com/Brodski/restApi"
4) $ mvn spring-boot:run
5a) App should be listening on port 8080
5b) Verify at [http://localhost:8080/](http://localhost:8080/) to view a message of "Hello!!!" 

# Deployment  

See deployment.txt for info about deploying this to your own VM
