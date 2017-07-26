/* eslint-env jest */

'use strict';

const promRegister = require('prom-client').register;
const PromRegistry = require('prom-client').Registry;
const gcMetrics = require('./index');

jest.mock('gc-stats');

afterEach(() => {
  promRegister.clear();
});

test('should register metrics', () => {
  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);

  gcMetrics();

  expect(promRegister.getMetricsAsJSON()).toHaveLength(3);
});

test('should register metrics to custom register', () => {
  const register = new PromRegistry();

  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);
  expect(register.getMetricsAsJSON()).toHaveLength(0);

  gcMetrics(register);

  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);
  expect(register.getMetricsAsJSON()).toHaveLength(3);
});
