import {KubeConfig} from '@kubernetes/client-node';
import {CustomResource} from '../interface/custom-resource';
import {createAllApis} from './create-apis';
import {exists} from './resource-exists';

export const deployCustomResource = async (name: string, kubeConfig: KubeConfig, customResources: CustomResource[]) => {
  const {
    coreV1Api,
    rbacAuthV1beta1Api,
    appsV1Api,
    customObjectsApi,
    rbacAuthV1Api,
    admissionregistrationV1Api,
    policyV1beta1Api,
  } = createAllApis(kubeConfig);

  for (const customResource of customResources) {
    if (await exists(kubeConfig, customResource)) {
      continue;
    }


    customResource.item.metadata!.labels = {
      ...customResource.item.metadata!.labels,
      hana: 'v0.0.1',
    };

    console.log(`Deploy ${name} ${customResource.item.kind} '${customResource.item.metadata?.name}'`);

    switch (customResource.item.kind) {
      case 'Namespace':
        await coreV1Api.createNamespace(customResource.item);
        break;
      case 'ConfigMap':
        await coreV1Api.createNamespacedConfigMap(customResource.item.metadata!.namespace!, customResource.item);
        break;
      case 'ServiceAccount':
        await coreV1Api.createNamespacedServiceAccount(customResource.item.metadata!.namespace!, customResource.item);
        break;
      case 'ClusterRoleBinding':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.createClusterRoleBinding(customResource.item as any);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.createClusterRoleBinding(customResource.item as any);
            break;
        }
        break;
      case 'ClusterRole':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.createClusterRole(customResource.item);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.createClusterRole(customResource.item);
            break;
        }
        break;
      case 'RoleBinding':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.createNamespacedRoleBinding(customResource.item.metadata!.namespace!, customResource.item as any);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.createNamespacedRoleBinding(customResource.item.metadata!.namespace!, customResource.item as any);
            break;
        }
        break;
      case 'Role':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.createNamespacedRole(customResource.item.metadata!.namespace!, customResource.item);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.createNamespacedRole(customResource.item.metadata!.namespace!, customResource.item);
            break;
        }
        break;
      case 'Service':
        await coreV1Api.createNamespacedService(customResource.item.metadata!.namespace!, customResource.item);
        break;
      case 'Deployment':
        await appsV1Api.createNamespacedDeployment(customResource.item.metadata!.namespace!, customResource.item);
        break;
      case 'DaemonSet':
        await appsV1Api.createNamespacedDaemonSet(customResource.item.metadata!.namespace!, customResource.item);
        break;
      case 'StatefulSet':
        await appsV1Api.createNamespacedStatefulSet(customResource.item.metadata!.namespace!, customResource.item);
        break;
      case 'Secret':
        await coreV1Api.createNamespacedSecret(customResource.item.metadata!.namespace!, customResource.item);
        break;
      case 'RateLimitService':
      case 'AuthService':
      case 'Mapping':
      case 'Host':
      case 'ConsulResolver':
      case 'TLSContext':
        await customObjectsApi.createNamespacedCustomObject(customResource.group!, customResource.version!, customResource.item.metadata!.namespace!, customResource.plural!, customResource.item);
        break;
      case 'MutatingWebhookConfiguration':
        await admissionregistrationV1Api.createMutatingWebhookConfiguration(customResource.item);
        break;
      case 'PodDisruptionBudget':
        await policyV1beta1Api.createNamespacedPodDisruptionBudget(customResource.item.metadata!.namespace!, customResource.item);
        break;
      default:
        console.error(`Unknown kind: ${customResource.item.kind}`);
        throw new Error(`Unknown kind: ${customResource.item.kind}`);
    }
  }
};
