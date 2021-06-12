import {KubernetesObject} from '@kubernetes/client-node';

export interface CustomResource {
  group?: string;
  version?: string;
  plural?: string;
  item: KubernetesObject;
}
