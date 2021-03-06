import {KubeConfig} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {deleteCustomResource} from '../../helper/delete';
import {deployCustomResource} from '../../helper/deploy';
import {CustomResource} from '../../interface/custom-resource';

export const deployAes = async (kubeConfig: KubeConfig) => {
  await deployCustomResource('aes', kubeConfig, load());
};

export const deleteAes = async (kubeConfig: KubeConfig) => {
  await deleteCustomResource('aes', kubeConfig, load().reverse());
};

const load = (): CustomResource[] => {
  const filePath = path.resolve(__dirname, '2-aes.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.safeLoadAll(fileContent)
      .map((item) => {
        const group = 'getambassador.io';
        const version = 'v2';

        switch (item.kind) {
          case 'RateLimitService':
            return {
              item,
              group,
              version,
              plural: 'ratelimitservices',
            };
          case 'AuthService':
            return {
              item,
              group,
              version,
              plural: 'authservices',
            };
          case 'Mapping':
            return {
              item,
              group,
              version,
              plural: 'mappings',
            };
        }

        return {
          item,
        };
      });
};
