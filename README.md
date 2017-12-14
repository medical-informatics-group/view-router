# view-router

This package is a simplified pushState router with support for URL parameters and nesting.

Since view-router was taken, you may pull this package with:

    $ yarn add mig-view-router

## Example

Below is an example, basically you have two types of tags/web components, the view-router and inside that element, Polymer web components that extends and element with the mixin ViewBehavior e.g. ViewBehavior(PolymerElement). See examples/ for more details about this example.

    <!doctype html>
    <html>
      <head>
        <title>Loading... - View router example</title>
        <base href="/">
        <script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <script type="module" src="node_modules/mig-view-router/view-router.js"></script>
        <script type="module" src="view-posts.js"></script>
        <script type="module" src="view-about.js"></script>
        <script type="module" src="view-about-author.js"></script>
        <script type="module" src="view-post.js"></script>
        <script type="module" src="view-not-found.js"></script>
      </head>
      <body>
        <view-router update-document-title>
          <view-posts pattern="/"></view-posts>
          <view-about pattern="/about/*"></view-about>
          <view-post pattern="/:postId"></view-post>
          <view-not-found></view-not-found>
        </view-router>
        <noscript>This service requires JavaScript to function. Please make sure that JavaScript is enabled.</noscript>
      </body>
    </html>

### Starting the go web server in examples (requires go and yarn to be installed)

    $ cd examples/
    $ yarn install
    $ go get -u github.com/labstack/echo
    $ go get -u github.com/mojlighetsministeriet/utils
    $ go run server-example.go

To change port to 4000 (or something else), replace the last line with:

    $ PORT=4000 go run server-example.go

## How does it work

A web component with the ViewBehavior mixin applied will have a *pattern* attribute. The attribute accepts three kinds of pattern.

* /my/path - A static path, the view will show when the URL matches
* /posts/:postId - Will match if the views load function resolves
* /posts/* - Will match if the URL starts with /posts, useful when you want to add sub views

For the views with parameters (e.g. /posts/:postId) the views .load() method will be called, you may implement this method any way you want as long as you return a Promise and resolve/reject this promise as works for your application. Any parameters in the URL that is also declared in the properties for that view will be automatically populated so that you can use them for XHR requests or similar when figuring out whether to resolve/reject a view.

To have a fallback view, add a web component with the ViewBehavior mixin but without any pattern attribute, that one will then be shown if there are no matches in any of the other views.

If you want to deploy your app in a sub path, just add a <base href="/my/base/path"> to your index.html head tag and exclude any of these routes.

## License

This software is provided as is under the MIT License. It might break at any moment or might perfectly for you, feel free to send pull requests if you figure out any improvements.
