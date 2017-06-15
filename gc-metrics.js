// Credits go to @tcolgate

import Counter from 'prom-client/lib/counter';
import { version } from 'prom-client/package.json';
import optional from 'optional';

const promMajor = Number(version.split('.')[0]);

const promSupportsRegistries = promMajor >= 9;

const gc = optional('gc-stats');

const gcTypes = {
  0: 'Unknown',
  1: 'Scavenge',
  2: 'MarkSweepCompact',
  3: 'ScavengeAndMarkSweepCompact',
  4: 'IncrementalMarking',
  8: 'WeakPhantom',
  15: 'All',
};

const noop = () => {};

export default registry => {
  if (typeof gc !== 'function') {
    return noop;
  }

  let gcCount;
  let gcTimeCount;
  let gcReclaimedCount;

  if (registry) {
    if (!promSupportsRegistries) {
      throw new Error(
        "You've provided a registry, but your version of prom-client is too old. Please use prom-client@9 or higher"
      );
    }

    const registers = [registry];
    const labelNames = ['gctype'];

    gcCount = new Counter({
      name: 'nodejs_gc_runs_total',
      help: 'Count of total garbage collections.',
      labelNames,
      registers,
    });
    gcTimeCount = new Counter({
      name: 'nodejs_gc_pause_seconds_total',
      help: 'Time spent in GC Pause in seconds.',
      labelNames,
      registers,
    });
    gcReclaimedCount = new Counter({
      name: 'nodejs_gc_reclaimed_bytes_total',
      help: 'Total number of bytes reclaimed by GC.',
      labelNames,
      registers,
    });
  } else {
    gcCount = new Counter(
      'nodejs_gc_runs_total',
      'Count of total garbage collections.',
      ['gctype'],
      registry && [registry]
    );
    gcTimeCount = new Counter('nodejs_gc_pause_seconds_total', 'Time spent in GC Pause in seconds.', ['gctype']);
    gcReclaimedCount = new Counter('nodejs_gc_reclaimed_bytes_total', 'Total number of bytes reclaimed by GC.', [
      'gctype',
    ]);
  }

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
