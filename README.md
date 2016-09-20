# prometheus-gc-stats
> Report Garbage Collection stats using Prometheus

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

[![Dependency Status][david-image]][david-url]
[![Optional Dependency Status][david-optional-image]][david-optional-url]
[![Peer Dependency Status][david-peer-image]][david-peer-url]
[![Dev Dependency Status][david-dev-image]][david-dev-url]

## Usage

This module has a peer dependency on [`prom-client`](https://github.com/siimon/prom-client). Currently, version 3-5 are supported.

This module follows the same API as the core default metrics. To start collection GC stats, invoke the exported function to create the
metrics, then invoke the returned function to start the collecting.

### `gc-stats`

The module doing the GC stats collecing is [`gc-stats`](https://github.com/dainis/node-gcstats). This module requires native dependencies.
If the stats don't show up, make sure to check `npm`'s install log for failures.

## Credits

Thanks to @tcolgate for the original implementation.


[travis-url]: https://travis-ci.org/SimenB/node-prometheus-gc-stats
[travis-image]: https://img.shields.io/travis/SimenB/node-prometheus-gc-stats.svg
[npm-url]: https://npmjs.org/package/prometheus-gc-stats
[npm-image]: https://img.shields.io/npm/v/prometheus-gc-stats.svg
[david-url]: https://david-dm.org/SimenB/node-prometheus-gc-stats
[david-image]: https://img.shields.io/david/SimenB/node-prometheus-gc-stats.svg
[david-dev-url]: https://david-dm.org/SimenB/node-prometheus-gc-stats#info=devDependencies
[david-dev-image]: https://img.shields.io/david/dev/SimenB/node-prometheus-gc-stats.svg
[david-peer-url]: https://david-dm.org/SimenB/node-prometheus-gc-stats#info=peerDependencies
[david-peer-image]: https://img.shields.io/david/peer/SimenB/node-prometheus-gc-stats.svg
[david-optional-url]: https://david-dm.org/SimenB/node-prometheus-gc-stats#info=optionalDependencies
[david-optional-image]: https://img.shields.io/david/optional/SimenB/node-prometheus-gc-stats.svg
