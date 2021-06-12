import {KubeConfig} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {deleteCustomResource} from '../helper/delete';
import {deployCustomResource} from '../helper/deploy';
import {CustomResource} from '../interface/custom-resource';

export const deployJwks = async (kubeConfig: KubeConfig, namespace: string, wellKnownPath: string, containerVersion: string) => {
  await deployCustomResource('jwks', kubeConfig, load(namespace, wellKnownPath, containerVersion));
};

export const deleteJwks = async (kubeConfig: KubeConfig, namespace: string) => {
  await deleteCustomResource('jwks', kubeConfig, load(namespace, '', '').reverse());
};

const load = (namespace: string, wellKnownPath: string, containerVersion: string): CustomResource[] => {
  const filePath = path.resolve(__dirname, 'k8s.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return yaml.safeLoadAll(fileContent)
      .map((item) => {
      item.metadata!.namespace = namespace;

      switch (item.kind) {
        case 'Mapping':
          const group = 'getambassador.io';
          const version = 'v2';
          item.spec.prefix = `/${wellKnownPath}`;
          return {
            group,
            version,
            item,
            plural: 'mappings',
          };
        case 'Deployment':
          item.spec!.template.spec!.containers[0].env![0].value = wellKnownPath;
          item.spec!.template.spec!.containers[0].image = item.spec!.template.spec!.containers[0].image!.replace(/VERSION/g, containerVersion);
          break;
      }

      return {
        item,
      };
      });
};
