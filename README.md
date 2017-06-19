# react-dependencies

Straight forward dependency injection for React. It uses React context to _encapsulate_ dependencies, and those dependencies can be injected to components via props at any node of your component tree.

This is a useful and well known pattern for larger applications, that I have used extensively for the last two years. It is especially needed for universal applications where _services_ and app-wide dependencies can't be singletons you import and consume in your components: in that case the use of context avoid having to pass dependencies from root to leaves.

Relying on context is fine for static data: see [How to safely use React context](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076). For dependency injection, it is the right feature.

### Install

```
yarn add react-dependencies
## or
## npm install react-dependencies
```

### Example

You have an entry point to your app, rendering an `App` component: you have a function creating your app-wide dependencies like constants, i18n formatters, messages, store, router, data api, etc...

```js
export default function render() {
    const dependencies = createDependencies()

    ReactDOM.render(
        <App { ...dependencies } />
        document.getElementById('root')
    )
}
```

```js
import { setDependencies } from 'react-dependencies'

function App(props) {
    return (
        <div>
            <Header />
            <View />
            <Footer />
        </div>
    )
}

export default setDependencies((props) => ({
    formatters: props.formatters,
    messages: props.messages
}))(App)
```

Then, as long as a dependency was provided, you can use it in any component:

```js
import { inject } from 'react-dependencies'

function DateTime({ formatters, date, format }) {
    return (
        <time>
            { formatters.formatDateTime(date, format) }
        </time>
    );
}

export default inject('formatters')(DateTime);
```

### API

This packages offers two higher-order components:
- __setDependencies(dependencies: Object|Function [, options: Object])(component: Component): Component__
- __inject(...dependencies: String [, options: Object])(component: Component): Component__

Supported options:
- `pure` (default to `true`): by default, your components are wrapped with React `PureComponent`. Set to `false` to disable that behaviour.
- `contextName`(default to `'__dependencies'`): context key name of where dependencies are stored. You only need to change in case of a namespace collision.
