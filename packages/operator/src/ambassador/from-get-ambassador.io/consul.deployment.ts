import {KubeConfig} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {deleteCustomResource} from '../../helper/delete';
import {deployCustomResource} from '../../helper/deploy';
import {CustomResource} from '../../interface/custom-resource';

export const deployConsul = async (kubeConfig: KubeConfig) => {
  const items = load();

  await deployCustomResource('consul', kubeConfig, items);
};

export const deleteConsul = async (kubeConfig: KubeConfig) => {
  const items = load().reverse();

  await deleteCustomResource('consul', kubeConfig, items);
};


const load = (): CustomResource[] => {
  const filePath = path.resolve(__dirname, '4-consul.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.safeLoadAll(fileContent)
      .map((item) => {
        const group = 'getambassador.io';
        const version = 'v2';

        switch (item.kind) {
          case 'ConsulResolver':
            return {
              item,
              group,
              version,
              plural: 'consulresolvers',
            };
          case 'TLSContext':
            return {
              item,
              group,
              version,
              plural: 'tlscontexts',
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
