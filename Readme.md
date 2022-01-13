# fxhash-feature-manager

**Install**
```
npm install fxhash-feature-manager
```

**Add to your project**

```js
import manager from 'fxhash-feature-manager'

// Initialize each property
manager
  .initValue({ name: 'age', min: 1, max: 1000, step: 10 })
  .initValue({ name: 'scale', min: 0.1, max: 1.0, step: 0.1 })

// Render dat.gui on development only**
if (process.env.NODE_ENV === 'development') {
  manager.attachGUI()
}

// Export to $fxhashFeatures
window.$fxhashFeatures = manager.export()

// Get the actual value of a property
const age = manager.getValue('age')
```

**fxhashFeatures**

When exporting to $fxhashFeatures, the tool will return `low`, `medium` or `high` for each property, by splitting the available range by 3, and checks on which group the value belongs to.

```js
{
    "age": "medium",
    "scale": "low"
}
```

**Modify props through dat.gui**

<img src="https://user-images.githubusercontent.com/697014/149325383-7968d6e0-5174-40de-9853-398ccfb0999b.png" width="400"/>

On development you will have access to modify the properties through [dat.gui](https://github.com/dataarts/dat.gui)'s interface.

Whenever you make a change to the properties, the current values will be reflected on the URL as query params (i.e. `http://localhost:8080/?age=330&scale=0.4`).

When the page reloads (when code changes), the values from the query params will be used for setting the properties.
