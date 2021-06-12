import {KubeConfig} from '@kubernetes/client-node';
import {CustomResource} from '../interface/custom-resource';
import {createAllApis} from './create-apis';
import {exists} from './resource-exists';

export const deleteCustomResource = async (name: string, kubeConfig: KubeConfig, customResources: CustomResource[]) => {
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
    if (!await exists(kubeConfig, customResource)) {
      continue;
    }

    console.log(`Delete ${name} ${customResource.item.kind} '${customResource.item.metadata?.name}'`);

    switch (customResource.item.kind) {
      case 'Namespace':
        await coreV1Api.deleteNamespace(customResource.item.metadata!.name!);
        break;
      case 'ConfigMap':
        await coreV1Api.deleteNamespacedConfigMap(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'ServiceAccount':
        await coreV1Api.deleteNamespacedServiceAccount(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'ClusterRoleBinding':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.deleteClusterRoleBinding(customResource.item.metadata!.name!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.deleteClusterRoleBinding(customResource.item.metadata!.name!);
            break;
        }
        break;
      case 'ClusterRole':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.deleteClusterRole(customResource.item.metadata!.name!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.deleteClusterRole(customResource.item.metadata!.name!);
            break;
        }
        break;
      case 'RoleBinding':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.deleteNamespacedRoleBinding(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.deleteNamespacedRoleBinding(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
        }
        break;
      case 'Role':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.deleteNamespacedRole(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.deleteNamespacedRole(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
        }
        break;
      case 'Service':
        await coreV1Api.deleteNamespacedService(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'Deployment':
        await appsV1Api.deleteNamespacedDeployment(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'DaemonSet':
        await appsV1Api.deleteNamespacedDaemonSet(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'StatefulSet':
        await appsV1Api.deleteNamespacedStatefulSet(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'Secret':
        await coreV1Api.deleteNamespacedSecret(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'RateLimitService':
      case 'AuthService':
      case 'Mapping':
      case 'Host':
      case 'ConsulResolver':
      case 'TLSContext':
        await customObjectsApi.deleteNamespacedCustomObject(customResource.group!, customResource.version!, customResource.item.metadata!.namespace!, customResource.plural!, customResource.item.metadata!.namespace!);
        break;
      case 'MutatingWebhookConfiguration':
        await admissionregistrationV1Api.deleteCollectionMutatingWebhookConfiguration(customResource.item.metadata!.name!);
        break;
      case 'PodDisruptionBudget':
        await policyV1beta1Api.deleteNamespacedPodDisruptionBudget(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      default:
        console.error(`Unknown kind: ${customResource.item.kind}`);
        throw new Error(`Unknown kind: ${customResource.item.kind}`);
    }
  }
};
