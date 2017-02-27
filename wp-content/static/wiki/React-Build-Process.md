Go into `./wp-content/themes/wp-property-pro/static/scripts/src` and run `npm install`, if not done already.

Then to build React's `bundle.js` file run:

```sh
npm run build
```

To run the react build process from the project root:

```
npm --prefix ./wp-content/themes/wp-property-pro/static/scripts/src run build
```

Or add following git hook: https://gist.github.com/andypotanin/54bbfe27cba7a4e696dae3cea929be3d