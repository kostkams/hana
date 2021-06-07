import {KubernetesObject} from '@kubernetes/client-node';

export interface AmbassadorCustomResource extends KubernetesObject {
  spec: AmbassadorCustomResourceSpec;
}

export interface AmbassadorCustomResourceSpec {
  tls?: AmbassadorTLSCustomResource;
}

export interface AmbassadorTLSCustomResource {
  spec: AmbassadorTLSCustomResourceSpec;
}

export interface AmbassadorTLSCustomResourceSpec {
  publicHostname: string;
  email: string;
}
