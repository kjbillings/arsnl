App Router & Stateful Node Library (ARSNL)
======
#### Tools to build a single-page web-app in javascript
A template-free framework library

- App
- Node
- State
    - subscribe
    - extract
- Router
    - Link

***
# App
```
App(object)
```

This function provides a method of attaching your app component to the root html element with the given `id`.

#### Only Argument:

| Key           | Description                                      | Type  |
| :-----------: |:------------------------------------------------:| :------:|
| **id**        | ID to look for in the document as a root element | string |
| **routes**    | Configures the App level Router                  | Routes Object (see below)  |
| **component** | The Node to be injected into the html            | object |

...
#### Usage:

Example `index.html`:
```javascript
<!doctype html>
<html>
    <body>
        <div id="app-root"></div>
        <script src="index.js"></script>
    </body>
</html>
```

Example `index.js`:
```javascript
import { App } from 'arsnl'
import AppComponent from './AppComponent'
import AppRoutes from './routes'

new App({
    id: 'app-root',
    routes: AppRoutes,
    component: AppComponent,
})
```

Example `routes.js`:
```javascript
import Dashboard from './Dashboard'
import Profile from './Profile'

const routes = {
    "/": Dashboard,
    "/profile/:id": Profile,
}

export default routes
```

Example `AppComponent.js`:
```javascript
import { Node } from 'arsnl'

export default (app) => (
    Node({
        r: [
            `Hello world! App root is #${app.id}`,
            app.renderRoutes(),
        ]
    })
)
```
And just like that, you've set up an ARSNL app!

**Note:** In order to render the routes provided to the app, you may call the Router's render method attached to the app provided to the top-level app component. If you don't want to use a Router at the top level of your app, you don't have to provide a configuration for it when constructing your app, and you don't have to render routes as we did in this example.

***
# Node
```
Node(object | function, array)
```

This function builds a basic ARSNL component. Really it's just a wrapper around code that generates a vanilla DOM element and knows how to decorate it based on what you've provided.

#### First Argument:
**Required:** The first argument is an object of attributes describing the Node OR it's a function that returns said configuration.

| Key        | Required | Description                                      | Value Type  |
| :----------: |:--------:|:--------------------------------------------:|:------:|
| **t**      | No       | Shortname for 'tagName' (defaults to 'div')  | String |
| **r**      | Yes      | Render                                       | Node, string, number, Array of Nodes/strings/numbers, ARSNL State (if only one property is present, it will attempt to render its value) |
| **s**      | No       | object of css properties                     | object |
| **onLoad** | No       | fires during tick after node has rendered    | function  |

Config Object also will take any [properties supported by standard JS DOM Nodes](https://www.w3schools.com/jsref/dom_obj_all.asp).

...

#### Second Argument:
**Optional:** The second argument is an array of ARSNL State objects. Whenever a property is updated on one of the state objects, the node will re-render itself. (Note: Using the second argument requires the first one to be a **function** that returns the config.)

...
#### Usage:

Here's a minimal example of a component:
```javascript
import { Node } from 'arsnl'

export default () => Node({ r: "Hello world!" })
```

Here's a complex example of a component:
```javascript
import { Node, State } from 'arsnl'

export default () => {
    const background = State({ value: 'none' })
    const onLoad = () => alert('component has loaded')
    const onclick = () => {
        (background.value === 'blue')
            ? background.value = 'red'
            : background.value = 'blue'
    }
    return Node(() => ({
        t: 'p',
        className: 'toggleable-background',
        s: { background: background.value },
        r: [
            'Wutang ',
            Node({
                t: 'strong',
                r: 'FOREVER'
            }),
        ],
        onLoad,
        onclick,
    }), [ background ])
}
```
(**Note:** This component will re-render when the background is changed by clicking the component because it's tracking the state of 'background' in it's array of tracked states.)

(**Note:** I put the function properties outside the config method so they aren't re-defined with every re-render.)

***
# State
```
State(object, function)
```

This function allows you to enhance an object with proxy so subscribers can listen for changes.

#### First Argument:
**Required:** Object of data for which you want to track changes on.

#### Second Argument:
**Optional:** Function you want to fire every time state changes. (This onChange is the first subscriber to changes added. You can use the subscribe() function to add additional listeners.)

(**Note:** This onChange function will receive two arguments: 'name' of changed field, and the updated 'value' of changed field respectively.)

(**Note:** In order to trigger an update to occur, you must set the entire top-level property on the state object.)

...
#### Usage:

An example of user being able to update state:
```javascript
import { Node, State } from 'arsnl'

export default () => {
    const counter = State({ value: 0 })    
    return Node({
        r: [
            Node({
                t: 'button',
                onclick: () => counter.value++,
                r: 'Add it up',
            }),
            Node(() => ({
                r: `clicked ${counter.value} times`
            }), [ counter ])
        ],
    })
}
```
(**Note:** Because the second child Node has "counter" in it's second argument, it will re-render when the value updates.)

***
# subscribe
```
subscribe(State, function)
```

This function adds an onChange listener to a given State object.

#### First Argument:
**Required:** A reference to an ARSNL State Object.

#### Second Argument:
**Required:** A method to call whenever state changes.

(**Note:** This onChange function will receive two arguments: 'name' of changed field, and the updated 'value' of changed field, respectively.)

...
#### Usage:

```javascript
import { Node, State, subscribe } from 'arsnl'

export default () => {
    const counter = State({ value: 0 })  
    const counterButton = Node({
        t: 'button',
        r: 'Add it up',
        onclick: () => counter.value++,
    })
    subscribe(counter, (key, value) => {
        alert(`Clicked ${value} times!`)
    })
    return counterButton
}
```

***
# extract
```
extract(State)
```

This function sanitizes the ARSNL State object by removing the ARSNL-specific meta-fields that were added to it on initialization.

#### Only Argument:
**Required:** A reference to an ARSNL State Object.

This example is a button that auto-saves a counter State on every change using some imaginary post API call.

...
#### Usage:

```javascript
import { Node, State, extract } from 'arsnl'
import { autoSaveCounterState } from 'some-api-helper'

export default () => {
    const counter = State({ value: 0 }, () => {
        autoSaveCounterState(extract(counter))
    })  
    const counterButton = Node({
        t: 'button',
        r: 'Add it up',
        onclick: () => counter.value++,
    })
    return counterButton
}
```

***
# Router
```
new Router(object)
```
This function returns an instance of a Router object. This object subscribes to navigation changes in the app, and when a change occurs, attempts to render the appropriate route provided to it by the configuration object.

Call the router's render method wherever you want the route to be displayed. It will automatically update itself based on the current url in the browser.

It always provides any path variables in the `window.location.pathname` as specified by the name of the route in the config, as well as any data in the query params of the url.

THIS ONLY LISTENS to location changes made using the ARSNL Link component - see below...

#### Only Argument:
**Required:** A configuration object representing the routes you wish to render. Key names on the object are strings representing the url of the given page, and the values are functions representing something that will be rendered based on the current url.

...
#### Usage:

```javascript
import { Node, Router } from 'arsnl'

import Home from './routes/Home'
import Work from './routes/Work'

const routes = {
    "/": Home,
    "/work": Work,
    "/sports/:sport": ({ params, search }) => {
        // For example: if the url is www.example.com/sports/baseball?field="Wrigley"
        return (
            Node({
                r: `hello ${search.field} Field! Someone likes ${params.sport}!`
                // So this route component would render:
                // <div>hello Wrigley Field! Someone likes baseball!</div>
            })
        )
    }
}

const router = new Router(routes)

export default () => (
    Node({
        r: router.render()
    })
)
```

(**Note:** The key names of the routes object may contain [path variables](https://www.npmjs.com/package/path-to-regexp).)

(**Note:** Path variables and query params will be passed into the rendered route component.)

***
# Link
```
Link(object)
```
This function builds a link component that ties into the navigation provided by ARSNL Router (see above).

#### Only Argument:
**Required:** Object of ARSNL Node configuration with a special "path" property.

...
#### Usage:

```javascript
import { Node, Router } from 'arsnl'

export default () => (
    Link({
        path: '/sports/baseball',
        r: 'Visit Baseball',
    })
)
// this will render as: <a href="/sports/baseball">Visit Baseball</a>
```

(**Note:** This component does not support a custom onclick attribute.)


***
# Third-Party Dependencies:
`classname`,
`query-string`,
`lodash`,
`webpack`
