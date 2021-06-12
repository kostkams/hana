import {KubeConfig} from '@kubernetes/client-node';
import {CustomResource} from '../interface/custom-resource';
import {createAllApis} from './create-apis';

export const exists = async (kubeConfig: KubeConfig, customResource: CustomResource): Promise<boolean> => {
  try {
    const {
      coreV1Api,
      rbacAuthV1beta1Api,
      appsV1Api,
      customObjectsApi,
      rbacAuthV1Api,
      admissionregistrationV1Api,
      policyV1beta1Api,
    } = createAllApis(kubeConfig);

    switch (customResource.item.kind) {
      case 'Namespace':
        await coreV1Api.readNamespace(customResource.item.metadata!.name!);
        break;
      case 'ConfigMap':
        await coreV1Api.readNamespacedConfigMap(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'ServiceAccount':
        await coreV1Api.readNamespacedServiceAccount(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'ClusterRoleBinding':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.readClusterRoleBinding(customResource.item.metadata!.name!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.readClusterRoleBinding(customResource.item.metadata!.name!);
            break;
        }
        break;
      case 'ClusterRole':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.readClusterRole(customResource.item.metadata!.name!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.readClusterRole(customResource.item.metadata!.name!);
            break;
        }
        break;
      case 'RoleBinding':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.readNamespacedRoleBinding(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.readNamespacedRoleBinding(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
        }
        break;
      case 'Role':
        switch (customResource.item.apiVersion) {
          case 'rbac.authorization.k8s.io/v1':
            await rbacAuthV1Api.readNamespacedRole(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
          case 'rbac.authorization.k8s.io/v1beta1':
            await rbacAuthV1beta1Api.readNamespacedRole(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
            break;
        }
        break;
      case 'Service':
        await coreV1Api.readNamespacedService(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'Deployment':
        await appsV1Api.readNamespacedDeployment(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'DaemonSet':
        await appsV1Api.readNamespacedDaemonSet(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'StatefulSet':
        await appsV1Api.readNamespacedStatefulSet(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'Secret':
        await coreV1Api.readNamespacedSecret(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
      case 'RateLimitService':
      case 'AuthService':
      case 'Mapping':
      case 'Host':
      case 'TLSContext':
        await customObjectsApi.getNamespacedCustomObject(customResource.group!, customResource.version!, customResource.item.metadata!.namespace!, customResource.plural!, customResource.item.metadata!.name!);
        break;
      case 'MutatingWebhookConfiguration':
        await admissionregistrationV1Api.readMutatingWebhookConfiguration(customResource.item.metadata!.name!);
        break;
      case 'PodDisruptionBudget':
        await policyV1beta1Api.readNamespacedPodDisruptionBudget(customResource.item.metadata!.name!, customResource.item.metadata!.namespace!);
        break;
    }
    return true;
  } catch {
    return false;
  }
};
