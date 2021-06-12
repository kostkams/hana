import {
  KubeConfig,
  KubernetesObject,
} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {deleteCustomResource} from '../../helper/delete';
import {deployCustomResource} from '../../helper/deploy';
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

  await deployCustomResource('user', kubeConfig, [{
    item,
    group: 'getambassador.io',
    version: 'v2',
    plural: 'hosts',
  }]);
};

export const deleteUser = async (kubeConfig: KubeConfig) => {
  const item = load();

  await deleteCustomResource('user', kubeConfig, [{
    item,
    group: 'getambassador.io',
    version: 'v2',
    plural: 'hosts',
  }]);
};

const load = (): KubernetesObject => {
  const filePath = path.resolve(__dirname, '3-user.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.safeLoadAll(fileContent)![0];
};
