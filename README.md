# Olapic Widget Instance Manager

This application allows you to view a list of widget instances available in your Olapic account, and allow you to generate a widget code instruction guide in Markdown format + Gist.

## Dependencies

- NPM + Bower - Package Manager

## Instructions

1. Clone this repo

  ```sh
  git clone git@github.com:jaepanda/olaCodegen.git
  ```

2. Place in your Olapic API key & GitHub API auth key in `app/js/controllers.js` file. Lines 6 to 10:

  ```js
  // Photorank auth key
  var authKey = 'XXXX';
  
  // GitHub API key
  var gistKey = 'YYYY';
  ```

3. Run `npm install`

  ```sh
  npm install
  ```

4. After npm installs all dependencies, run `npm start` to run the local server

  ```sh
  npm start
  ```

5. Voila! You can now view the application at `http://localhost:8000/app`
