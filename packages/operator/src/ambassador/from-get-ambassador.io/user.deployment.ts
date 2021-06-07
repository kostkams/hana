import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesObject,
} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {AmbassadorTLSCustomResource} from '../interfaces';

export const deployUser= async (kubeConfig: KubeConfig, tls: AmbassadorTLSCustomResource) => {
  if (!tls) {
    return;
  }

  const item = load();


  console.log(`Deploy user ${item.kind} '${item.metadata?.name}'`);

  item.metadata!.name = tls.spec.publicHostname;
  (item as any).spec.hostname = tls.spec.publicHostname;
  (item as any).spec.acmeProvider.email = tls.spec.email;

  await createApis(kubeConfig).createNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'hosts', item);
};

export const deleteUser = async (kubeConfig: KubeConfig) => {
  const item = load();

  if (!await exists(kubeConfig, item)) {
    return;
  }

  console.log(`Delete user ${item.kind} '${item.metadata?.name}'`);
  await createApis(kubeConfig).deleteNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'hosts', item.metadata!.namespace!);
};

const exists = async (kubeConfig: KubeConfig, item: KubernetesObject): Promise<boolean> => {
  try {
    await createApis(kubeConfig).getNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'hosts', item.metadata!.name!);

    return true;
  } catch {
    return false;
  }
};

const load = (): KubernetesObject => {
  const filePath = path.resolve(__dirname, '3-user.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.safeLoadAll(fileContent)![0];
};

const createApis = (kubeConfig: KubeConfig) => {
  return kubeConfig.makeApiClient(CustomObjectsApi);
};
