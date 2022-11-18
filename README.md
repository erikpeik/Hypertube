# Hypertube - A Netflix-like movie streaming website
## ⚠️⚠️⚠️ this was created only for pure educational reasons! 
### by [erikpeik](https://github.com/erikpeik), [SeanTroy](https://github.com/SeanTroy), [ghorvath](https://github.com/mobahug) and [acamaras0](https://github.com/acamaras0)

A Netflix-like movie streaming website where you can choose from over 43.000 movies.
The website has 4 different language options: English, Finnish, Romanian and Hungarian and different streaming qualities.

## Tools & Languages

  - React with Redux
  - NodeJS with Express
  - MUI
  - Docker
  - PostgreSQL
  - pgAdmin
  - DataGrip
  - Atlassian, Jira
  - CSS
  - HTML


# Features:

## Logging in/Registration and Profile Page

  - The website has a secure authentification system using cookies
  - Two-step registration with email verification
  - Forget password with email link token.
  - Google API used to translate the emails and every error/success messages
  - User profile page
  - Upload profile picture
  - Possibility to change the password, email, firstname, lastname, username, language and/or profile page
  - Possibility to change between infinite scroll and pagination on the movie browsing page
  
  
  <div>
    <img height="320em"  src="https://user-images.githubusercontent.com/83179142/202658873-2df0c9f2-3e1c-43da-9aa3-1d2088ce2a1a.gif" alt="gif"/>
  </div>
  
  
  ## Browsing
  
  - Listing movies (IMBD Rating by default)
  - Complex search and filter features
  - Search movies by their title


  <div>
    <img height="320em"  src="https://user-images.githubusercontent.com/83179142/202667460-26960950-79a1-47cc-a932-69ba974d253f.gif" alt="gif"/>
  </div>


  ## Movie page
  
  - Video player
  - Comment section
  - Visit other user's profile page
  - Movie description and additional details
  - Based on the movie, a recommendation list of movies
  - After clicking the play button, the movie is added to the user's watchlist and marked as watched on the browsing page

  <div>
    <img height="320em"  src="https://user-images.githubusercontent.com/83179142/202673859-8fda9939-d2fc-4f68-a8b9-3a1687e7139d.gif" alt="gif"/>
  </div>


## Video player

  - Streaming the video using yts torrent API
  - Changeable subtitles, by default based on the choosen language or availability
  - Changeable movie quality
  - Basic features like: pause/play
  - Fullscreen option
 
 
  <div>
    <img height="320em" src="https://user-images.githubusercontent.com/83179142/202702017-ddacdcd1-1e05-4d8d-8d8d-92750eed1d21.gif" alt="gif"/>
  </div>
 
## Additional feature:

  - Using crontab, a movie that wasn't watched for over 30 days, will be deleted.
  - On users Watched movies list will still appear as watched.