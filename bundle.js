'use strict';

const map = (value, min1, max1, min2, max2) => {
    return ((value - min1) / (max1 - min1)) * (max2 - min2) + min2
  };
  
  const getQueryParams = () =>
    Object.fromEntries(new URLSearchParams(location.search));
  
  const createQueryString = data =>
    Object.keys(data)
      .map(key => {
        let val = data[key];
        if (val !== null && typeof val === 'object') val = createQueryString(val);
        return `${key}=${encodeURIComponent(`${val}`.replace(/\s/g, '_'))}`
      })
      .join('&');
  
  const updateQueryParams = data => {
    const queryString = createQueryString(data);
    history.replaceState(null, null, `${location.pathname}?${queryString}`);
  };
  
  const fxhashFeatureManager = {
    props: {},
  
    initValue({ name, min, max, value, step }) {
      if (!name) {
        throw new Error('fxhashFeatureManager: name is required')
      }
      if (!value && !min && !max) {
        throw new Error(
          `fxhashFeatureManager: value or min and max for ${name} is required`
        )
      }
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        this.props[name] = {
          min,
          max,
          value: map(fxrand(), 0, 1, min, max),
          step
        };
      } else {
        this.props[name] = {
          value
        };
      }
      const query = getQueryParams();
      if (query[name]) {
        this.props[name].value = parseFloat(query[name]);
      }
  
      return this
    },
  
    getValue(name) {
      return this.props[name].value
    },
  
    export() {
      const result = Object.entries(this.props).reduce((acc, [key, value]) => {
        if (!Number.isNaN(value.min) || !Number.isNaN(value.max)) {
          if (value.step) {
            acc[key] = Math.floor(value.value);
          } else {
            const mappedValue = map(value.value, value.min, value.max, 0, 1);
            acc[key] =
              mappedValue < 0.33 ? 'low' : mappedValue < 0.66 ? 'medium' : 'high';
          }
        } else {
          acc[key] = value.value;
        }
        return acc
      }, {});
      return result
    },
  
    attachGUI() {
      const dat = require('dat.gui');
      const gui = new dat.GUI();
      const { props } = this;
      Object.entries(props).forEach(([key, value]) => {
        let ctrl;
        if (!Number.isNaN(value.min) || !Number.isNaN(value.max)) {
          ctrl = gui
            .add(value, 'value', value.min, value.max, value.step)
            .name(key);
        } else {
          ctrl = gui.add(value, 'value').name(key);
        }
        ctrl.onFinishChange(() => {
          updateQueryParams(
            Object.entries(props).reduce((acc, [key, value]) => {
              acc[key] = value.value;
              return acc
            }, {})
          );
        });
      });
    }
  };

module.exports = fxhashFeatureManager;
