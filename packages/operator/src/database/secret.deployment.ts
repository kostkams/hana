import {CoreV1Api} from '@kubernetes/client-node';
import passwordGenerator from 'generate-password';

const NAME = 'database-cred';

export const deployDatabaseSecret = async (k8sApi: CoreV1Api, namespace: string) => {
  if (await exists(k8sApi, namespace)) {
    return;
  }

  console.log('Generate Database secret');

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
      username: passwordGenerator.generate({length: 10, strict: true}),
      password: passwordGenerator.generate({length: 64, strict: true}),
    },
  })
  ;
};

export const deleteDatabaseSecret = async (k8sApi: CoreV1Api, namespace: string) => {
  if (!await exists(k8sApi, namespace)) {
    return;
  }

  console.log('Delete Database secret');
  await k8sApi.deleteNamespacedSecret(NAME, namespace);
};

const exists = async (k8sApi: CoreV1Api, namespace: string) => {
  try {
    await k8sApi.readNamespacedSecret(NAME, namespace);
    return true;
  } catch (e) {
    return false;
  }
};
