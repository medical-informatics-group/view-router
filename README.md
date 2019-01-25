# view-router

This package is a simplified pushState router with support for URL parameters and nesting.

Since view-router was taken, you may pull this package with:

    $ npm install --save mig-view-router

## Example

Below is an example, basically you have two types of tags/web components, the view-router and inside that element, web components that uses the mixin ViewBehavior e.g. ViewBehavior(LitElement). See example/ for more details.

    <!doctype html>
    <html>
      <head>
        <title>Loading... - View router example</title>
        <base href="/">
        <script>
          if (!window.customElements) {
            document.write('<script src="polyfills/webcomponents/webcomponents-loader.js"><\/script>');
          }
        </script>
      </head>
      <body>
        <view-router update-document-title="true">
          <view-posts pattern="/"></view-posts>
          <view-about pattern="/about/*"></view-about>
          <view-post pattern="/:postId"></view-post>
          <view-not-found></view-not-found>
        </view-router>
        <noscript>This service requires JavaScript to function. Please make sure that JavaScript is enabled.</noscript>
      </body>
    </html>

### Starting the web server

    $ cd example/
    $ npm install
    $ npm start

## How does it work

A web component with the ViewBehavior mixin will have a *pattern* attribute that matches against the URL and determins when the component should be shown. The attribute accepts three kinds of patterns.

* /my/path - A static path, the view will show when the URL matches
* /posts/:postId - Will match if the views load function resolves
* /posts/* - Will match if the URL starts with /posts, useful when you want to add sub views

For the views with parameters (e.g. /posts/:postId) the views .load() method will be called, you may implement this method any way you want as long as it returns a Promise. Any parameters in the URL that is also declared in the properties for that view will be automatically populated so that you can use them for XHR requests or similar when figuring out whether to resolve/reject a view.

To have a fallback view, add a web component with the ViewBehavior mixin but without any pattern attribute, that one will then be shown if there are no matches in any of the other views.

If you want to deploy your app in a sub path, just add a <base href="/my/base/path"> to your index.html head tag.

## License

This software is provided as is under the MIT License. It might break at any moment or might perfectly for you, feel free to send pull requests if you figure out any improvements.
