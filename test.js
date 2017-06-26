/* eslint-env jest*/

import promRegister from 'prom-client/lib/register';
import { version as promVersion } from 'prom-client/package.json';
import gcMetrics from './gc-metrics';

const promMajor = Number(promVersion.split('.')[0]);

const promSupportsRegistries = promMajor >= 9;

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
  if (!promSupportsRegistries) {
    return;
  }

  // eslint-disable-next-line
  const PromRegistry = require('prom-client/lib/registry');

  const register = new PromRegistry();

  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);
  expect(register.getMetricsAsJSON()).toHaveLength(0);

  gcMetrics(register);

  expect(promRegister.getMetricsAsJSON()).toHaveLength(0);
  expect(register.getMetricsAsJSON()).toHaveLength(3);
});
