# fxhash-feature-manager

How to use:

```js
import manager from 'fxhash-feature-manager'

// Initialize the manager with property values.
manager
  .initValue({ name: 'prop1', min: 0.0, max: 1.0 })
  .initValue({ name: 'prop2', min: 1, max: 1000, step: 10})

// Render dat.gui on development
if (process.env.NODE_ENV === 'development') {
  manager.attachGUI()
}

// export to $fxhashFeatures
window.$fxhashFeatures = manager.export()
 
// get the actual value of a property
shader.setUniform('u_age', manager.getValue('age'))
```