import {ApiextensionsV1beta1Api, V1beta1CustomResourceDefinition} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';

import path from 'path';

export const deployCrds = async (k8sApi: ApiextensionsV1beta1Api) => {
  for (const spec of load()) {
    if (!await exists(k8sApi, spec.metadata!.name!)) {
      console.log(`Deploy ambassador crd '${spec.metadata!.name!}'`);
      await k8sApi.createCustomResourceDefinition(spec);
    }
  }
};

export const deleteCrds = async (k8sApi: ApiextensionsV1beta1Api) => {
  for (const spec of load().reverse()) {
    if (await exists(k8sApi, spec.metadata!.name!)) {
      console.log(`Delete ambassador crd '${spec.metadata!.name!}'`);
      await k8sApi.deleteCustomResourceDefinition(spec.metadata!.name!);
    }
  }
};

const load = (): V1beta1CustomResourceDefinition[] => {
  const filePath = path.resolve(__dirname, '1-aes-crds.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.safeLoadAll(fileContent);
};

const exists = async (k8sApi: ApiextensionsV1beta1Api, name: string) => {
  try {
    await k8sApi.readCustomResourceDefinition(name);
    return true;
  } catch {
    return false;
  }
};
