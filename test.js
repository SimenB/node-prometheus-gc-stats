/* eslint-env jest */

'use strict';

const promRegister = require('prom-client').register;
const PromRegistry = require('prom-client').Registry;
const gcMetrics = require('./index');

jest.mock('gc-stats');

afterEach(() => {
  promRegister.clear();
});

test('register metrics', () => {
  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);

  gcMetrics();

  expect(promRegister.getMetricsAsJSON()).toHaveLength(3);
});

test('register metrics to custom register', () => {
  const register = new PromRegistry();

  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);
  expect(register.getMetricsAsJSON()).toHaveLength(0);

  gcMetrics(register);

  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);
  expect(register.getMetricsAsJSON()).toHaveLength(3);
});

test('include prefix', () => {
  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);

  gcMetrics(undefined, { prefix: 'prefix_' });

  expect(promRegister.getMetricsAsJSON()).toHaveLength(3);

  expect(promRegister.getMetricsAsJSON().map(metric => metric.name)).toEqual([
    'prefix_nodejs_gc_runs_total',
    'prefix_nodejs_gc_pause_seconds_total',
    'prefix_nodejs_gc_reclaimed_bytes_total',
  ]);
});
