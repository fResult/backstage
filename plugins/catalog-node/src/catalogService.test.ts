/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import {
  createBackendModule,
  createServiceFactory,
  discoveryServiceRef,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { CatalogClient } from '@backstage/catalog-client';
import { catalogServiceRef } from './catalogService';

describe('catalogServiceRef', () => {
  it('should return a catalogClient', async () => {
    const mockDiscoveryFactory = createServiceFactory({
      service: discoveryServiceRef,
      deps: {},
      factory: async ({}) => {
        return async () => jest.fn() as unknown as PluginEndpointDiscovery;
      },
    });

    const testModule = createBackendModule({
      moduleId: 'test.module',
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            catalog: catalogServiceRef,
          },
          async init({ catalog }) {
            expect(catalog).toBeInstanceOf(CatalogClient);
          },
        });
      },
    });

    await startTestBackend({
      services: [mockDiscoveryFactory],
      features: [testModule({})],
    });
  });
});
