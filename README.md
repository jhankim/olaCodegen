# Olapic Widget Instance Manager

This application allows you to view a list of widget instances available in your Olapic account, and allow you to generate a widget code instruction guide in Markdown format + Gist.

## Dependencies

- NPM + Bower - Package Manager

## Instructions

1. Clone this repo

  ```sh
  git clone git@github.com:jaepanda/olaCodegen.git
  ```

2. Place in your Olapic API key & GitHub API auth key in `app/js/app.js` file. Lines 14 to 15:

  ```js
  codegenApp.factory('AuthKeys', function() {
    return {
        olapic : 'YOUR OLAPIC API KEY GOES HERE',
        github : 'YOUR GITHUB API KEY GOES HERE'
    };
  });
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

## Future Plans

- Creating OAuth layer between app and Github to make usage easy.
