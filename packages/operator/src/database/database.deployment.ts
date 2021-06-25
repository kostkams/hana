import {KubeConfig} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {deleteCustomResource} from '../helper/delete';
import {deployCustomResource} from '../helper/deploy';
import {CustomResource} from '../interface/custom-resource';

export const deployDatabase = async (kubeConfig: KubeConfig, namespace: string, withUI?: boolean) => {
  await deployCustomResource('database', kubeConfig, load(namespace, withUI) as CustomResource[]);
};

export const deleteDatabase = async (kubeConfig: KubeConfig, namespace: string) => {
  await deleteCustomResource('database', kubeConfig, load(namespace, true) as CustomResource[]);
};

const load = (namespace: string, withUI?: boolean): (null | { item: any })[] => {
  const filePath = path.resolve(__dirname, 'k8s.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return yaml.safeLoadAll(fileContent)
      .map((item) => {
        item.metadata!.namespace = namespace;

        if (!withUI && item.metadata!.name === 'ui') {
          return null;
        }

        return {
          item,
        };
      })
      .filter((item) => item);
};
