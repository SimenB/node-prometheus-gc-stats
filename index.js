'use strict';

// Credits go to @tcolgate

const Counter = require('prom-client').Counter;
const optional = require('optional');

const gc = optional('gc-stats');

const v8Version = process.versions.v8;
const v8MajorVersion = Number(v8Version.split('.')[0]);

const gcTypes =
  v8MajorVersion < 10
    ? {
        // https://github.com/nodejs/node/blob/554fa24916c5c6d052b51c5cee9556b76489b3f7/deps/v8/include/v8.h#L6137-L6144
        0: 'Unknown',
        1: 'Scavenge',
        2: 'MarkSweepCompact',
        3: 'ScavengeAndMarkSweepCompact',
        4: 'IncrementalMarking',
        8: 'WeakPhantom',
        15: 'All',
      }
    : {
        // https://github.com/nodejs/node/blob/ccd3a42dd9ea2132111610e667ee338618e3b101/deps/v8/include/v8-callbacks.h#L150-L159
        0: 'Unknown',
        1: 'Scavenge',
        2: 'MinorMarkCompact',
        4: 'MarkSweepCompact',
        8: 'IncrementalMarking',
        16: 'ProcessWeakCallbacks',
        31: 'All',
      };

const noop = () => {};

module.exports = (registry, config = {}) => {
  if (typeof gc !== 'function') {
    return noop;
  }

  const registers = registry ? [registry] : undefined;

  const labelNames = ['gctype'];

  const namePrefix = config.prefix ? config.prefix : '';

  const gcCount = new Counter({
    name: `${namePrefix}nodejs_gc_runs_total`,
    help: 'Count of total garbage collections.',
    labelNames,
    registers,
  });
  const gcTimeCount = new Counter({
    name: `${namePrefix}nodejs_gc_pause_seconds_total`,
    help: 'Time spent in GC Pause in seconds.',
    labelNames,
    registers,
  });
  const gcReclaimedCount = new Counter({
    name: `${namePrefix}nodejs_gc_reclaimed_bytes_total`,
    help: 'Total number of bytes reclaimed by GC.',
    labelNames,
    registers,
  });

  let started = false;

  return () => {
    if (started !== true) {
      started = true;

      gc().on('stats', stats => {
        const gcType = gcTypes[stats.gctype];

        gcCount.labels(gcType).inc();
        gcTimeCount.labels(gcType).inc(stats.pause / 1e9);

        if (stats.diff.usedHeapSize < 0) {
          gcReclaimedCount.labels(gcType).inc(stats.diff.usedHeapSize * -1);
        }
      });
    }
  };
};
