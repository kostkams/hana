import {
  AppsV1Api,
  CoreV1Api,
  CustomObjectsApi,
  KubeConfig,
  KubernetesObject,
  RbacAuthorizationV1beta1Api,
} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export const deployAes = async (kubeConfig: KubeConfig) => {
  const {
    coreV1Api,
    rbacAuthV1beta1Api,
    appsV1Api,
    customObjectsApi,
  } = createApis(kubeConfig);

  for (const item of load()) {
    if (await exists(kubeConfig, item)) {
      continue;
    }

    console.log(`Deploy aes ${item.kind} '${item.metadata?.name}'`);

    switch (item.kind) {
      case 'Namespace':
        await coreV1Api.createNamespace(item);
        break;
      case 'ServiceAccount':
        await coreV1Api.createNamespacedServiceAccount(item.metadata!.namespace!, item);
        break;
      case 'ClusterRoleBinding':
        await rbacAuthV1beta1Api.createClusterRoleBinding(item as any);
        break;
      case 'ClusterRole':
        await rbacAuthV1beta1Api.createClusterRole(item);
        break;
      case 'Role':
        await rbacAuthV1beta1Api.createNamespacedRole(item.metadata!.namespace!, item);
        break;
      case 'Service':
        await coreV1Api.createNamespacedService(item.metadata!.namespace!, item);
        break;
      case 'Deployment':
        await appsV1Api.createNamespacedDeployment(item.metadata!.namespace!, item);
        break;
      case 'RateLimitService':
        await customObjectsApi.createNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'ratelimitservices', item);
        break;
      case 'AuthService':
        await customObjectsApi.createNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'authservices', item);
        break;
      case 'Secret':
        await coreV1Api.createNamespacedSecret(item.metadata!.namespace!, item);
        break;
      case 'Mapping':
        await customObjectsApi.createNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'mappings', item);
        break;
    }
  }
};

export const deleteAes = async (kubeConfig: KubeConfig) => {
  const {
    coreV1Api,
    rbacAuthV1beta1Api,
    appsV1Api,
    customObjectsApi,
  } = createApis(kubeConfig);

  for (const item of load()) {
    if (!await exists(kubeConfig, item)) {
      continue;
    }

    console.log(`Delete aes ${item.kind} '${item.metadata?.name}'`);

    switch (item.kind) {
      case 'Namespace':
        await coreV1Api.deleteNamespace(item.metadata!.name!);
        break;
      case 'ServiceAccount':
        await coreV1Api.deleteNamespacedServiceAccount(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'ClusterRoleBinding':
        await rbacAuthV1beta1Api.deleteClusterRoleBinding(item.metadata!.name!);
        break;
      case 'ClusterRole':
        await rbacAuthV1beta1Api.deleteClusterRole(item.metadata!.name!);
        break;
      case 'Role':
        await rbacAuthV1beta1Api.deleteNamespacedRole(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'Service':
        await coreV1Api.deleteNamespacedService(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'Deployment':
        await appsV1Api.deleteNamespacedDeployment(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'RateLimitService':
        await customObjectsApi.deleteNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'ratelimitservices', item.metadata!.namespace!);
        break;
      case 'AuthService':
        await customObjectsApi.deleteNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'authservices', item.metadata!.namespace!);
        break;
      case 'Secret':
        await coreV1Api.deleteNamespacedSecret(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'Mapping':
        await customObjectsApi.deleteNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'mappings', item.metadata!.namespace!);
        break;
    }
  }
};

const load = (): KubernetesObject[] => {
  const filePath = path.resolve(__dirname, '2-aes.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return yaml.safeLoadAll(fileContent);
};

const exists = async (kubeConfig: KubeConfig, item: KubernetesObject): Promise<boolean> => {
  try {
    const {
      coreV1Api,
      rbacAuthV1beta1Api,
      appsV1Api,
      customObjectsApi,
    } = createApis(kubeConfig);

    switch (item.kind) {
      case 'Namespace':
        await coreV1Api.readNamespace(item.metadata!.name!);
        break;
      case 'ServiceAccount':
        await coreV1Api.readNamespacedServiceAccount(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'ClusterRoleBinding':
        await rbacAuthV1beta1Api.readClusterRoleBinding(item.metadata!.name!);
        break;
      case 'ClusterRole':
        await rbacAuthV1beta1Api.readClusterRole(item.metadata!.name!);
        break;
      case 'Role':
        await rbacAuthV1beta1Api.readNamespacedRole(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'Service':
        await coreV1Api.readNamespacedService(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'Deployment':
        await appsV1Api.readNamespacedDeployment(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'RateLimitService':
        await customObjectsApi.getNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'ratelimitservices', item.metadata!.name!);
        break;
      case 'AuthService':
        await customObjectsApi.getNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'authservices', item.metadata!.name!);
        break;
      case 'Secret':
        await coreV1Api.readNamespacedSecret(item.metadata!.name!, item.metadata!.namespace!);
        break;
      case 'Mapping':
        await customObjectsApi.getNamespacedCustomObject('getambassador.io', 'v2', item.metadata!.namespace!, 'mappings', item.metadata!.name!);
        break;
    }
    return true;
  } catch {
    return false;
  }
};

const createApis = (kubeConfig: KubeConfig) => {
  const coreV1Api = kubeConfig.makeApiClient(CoreV1Api);
  const rbacAuthV1beta1Api = kubeConfig.makeApiClient(RbacAuthorizationV1beta1Api);
  const appsV1Api = kubeConfig.makeApiClient(AppsV1Api);
  const customObjectsApi = kubeConfig.makeApiClient(CustomObjectsApi);

  return {
    coreV1Api,
    rbacAuthV1beta1Api,
    appsV1Api,
    customObjectsApi,
  };
};
