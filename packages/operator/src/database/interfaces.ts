import {KubernetesObject} from '@kubernetes/client-node';

export interface DatabaseCustomResource extends KubernetesObject {
  spec: DatabaseCustomResourceSpec;
}

export interface DatabaseCustomResourceSpec {
  withUI?: boolean;
}
