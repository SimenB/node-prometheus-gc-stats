# prometheus-gc-stats

> Report Garbage Collection stats using Prometheus

[![NPM Version][npm-image]][npm-url]
[![Build Status][circle-ci-image]][circle-ci-url]

## Usage

This module has a peer dependency on [`prom-client`](https://github.com/siimon/prom-client). Currently, 10 is supported.

This module follows the same API as the core default metrics. To start collection GC stats, invoke the exported function to create the
metrics, then invoke the returned function to start the collecting.

The exported function takes a single parameter, which is a registry. If provided, and the version of prom-client you use support it, that is
the registry which the metrics will register to. If no registry is provided it will use the default one provided by `prom-client`.

Example:

```js
const prometheus = require('prom-client');
const gcStats = require('prometheus-gc-stats');

prometheus.collectDefaultMetrics();
const startGcStats = gcStats(prometheus.register); // gcStats() would have the same effect in this case
startGcStats();
```

### `gc-stats`

The module doing the GC stats collecting is [`gc-stats`](https://github.com/dainis/node-gcstats). This module requires native dependencies.
If the stats don't show up, make sure to check `npm`'s install log for failures.

## Metrics exposed

This module exposes 3 metrics:

1. `nodejs_gc_runs_total`: Counts the number of time GC is invoked
2. `nodejs_gc_pause_seconds_total`: Time spent in GC in seconds
3. `nodejs_gc_reclaimed_bytes_total`: The number of bytes GC has freed

You can add a prefix to metric names using options:

```js
const startGcStats = gcStats(prometheus.register, {
  prefix: 'my_application_',
});
```

## Credits

Thanks to @tcolgate for the original implementation.

[circle-ci-url]: https://circleci.com/gh/SimenB/node-prometheus-gc-stats
[circle-ci-image]: https://circleci.com/gh/SimenB/node-prometheus-gc-stats/tree/main.svg?style=shield&circle-token=05b6e173edee3b1494b0370d5d3caea00ad358a3
[npm-url]: https://npmjs.org/package/prometheus-gc-stats
[npm-image]: https://img.shields.io/npm/v/prometheus-gc-stats.svg
