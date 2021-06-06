import {KubernetesObject} from '@kubernetes/client-node';

export interface JwksCustomResource extends KubernetesObject {
    spec: JwksCustomResourceSpec;
}

export interface JwksCustomResourceSpec {
    wellKnownPath: string;
}
