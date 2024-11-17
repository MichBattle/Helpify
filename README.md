Helpify
=======

Helpify is a web application that allows users to interact with their Spotify accounts through an OAuth2 authentication system. It offers a range of advanced features to enhance the listening experience, including the creation of personalized playlists, detailed statistics visualization, comparisons between artists and tracks, advanced playlist management, and a special "Time Capsule" feature.

Features
--------

### 1\. Login with Spotify via OAuth2

Securely authenticate users using Spotify's OAuth2 system, ensuring access to personalized features without compromising data security.

### 2\. Personalized Playlists

Generate tailored playlists based on various criteria:

-   **Mood:** Select a mood such as happy, sad, energetic, or calm. The algorithm determines the mood of the songs by analyzing attributes like key, valence, energy, danceability, acousticness, liveness, and loudness.
-   **Weather:** Create playlists based on current weather conditions using the OpenWeather API.
-   **Recommended:** Suggest songs from the user's top 10 artists.

### 3\. Statistics

View personalized listening statistics:

-   **Top 10 Tracks**
-   **Top 10 Artists**
-   **Top 5 Genres**

Users can select the analysis period between 4 weeks, 6 months, and all time.

### 4\. Comparison

Allow users to compare up to 3 artists or tracks using bar charts:

-   **Artists:** Compare popularity or number of followers.
-   **Tracks:** Compare parameters such as danceability, valence, energy, acousticness, liveness, and loudness.

### 5\. Playlist Management

Manage all playlists in the account:

-   View all playlists and the tracks they contain.
-   For editable playlists, it will be possible to remove duplicate tracks.

### 6\. Time Capsule

Generate a special playlist containing the user's top 30 most listened-to songs from the last 4 weeks.

APIs Used
---------

-   **Spotify Web API:** To access user data, create and manage playlists, and obtain information about tracks and artists.
-   **OpenWeather API:** To obtain current weather conditions and generate weather-based playlists.

How to Use
----------

1.  Navigate to the `Helpify/helpify` folder, create a `.env` file and add the following variables:

     ~~~bash
     REACT_APP_OPENWEATHER_API_KEY=your_openweather_key
     REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
     REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
     ~~~

2.  Install dependencies:

    ~~~bash
    sudo apt install npm
    npm install
    ~~~

3.  Run the application:

    ~~~bash
    npm start
    ~~~

5.  Open a browser and navigate to:\
    <http://localhost:3000>
