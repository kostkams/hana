import {CoreV1Api} from '@kubernetes/client-node';
import {JWK} from 'node-jose';

const NAME = 'jwks';

export const generateJwksSecret = async (k8sApi: CoreV1Api, namespace: string) => {
  if (await exists(k8sApi, namespace)) {
    return;
  }

  console.log('Generate JWKS secret');
  const store = JWK.createKeyStore();
  await store.generate('RSA', 2048, {alg: 'RS512', use: 'sig'});
  const data = store.toJSON(true);


  await k8sApi.createNamespacedSecret(namespace, {
    metadata: {
      name: NAME,
      namespace,
      labels: {
        hana: 'v0.0.1',
      },
    },
    type: 'Opaque',
    immutable: true,
    stringData: {
      jwks: JSON.stringify(data),
    },
  });
};


export const deleteJwksSecret = async (k8sApi: CoreV1Api, namespace: string) => {
  if (!await exists(k8sApi, namespace)) {
    return;
  }

  console.log('Delete JWKS secret');
  await k8sApi.deleteNamespacedSecret(NAME, namespace);
};

const exists = async (k8sApi: CoreV1Api, namespace: string): Promise<boolean> => {
  try {
    await k8sApi.readNamespacedSecret(NAME, namespace);
    return true;
  } catch (e) {
    return false;
  }
};
