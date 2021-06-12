import {AppsV1Api, CoreV1Api, CustomObjectsApi, KubeConfig, PolicyV1beta1Api, RbacAuthorizationV1beta1Api, RbacAuthorizationV1Api, AdmissionregistrationV1Api} from '@kubernetes/client-node';

export const createCoreV1Api = (kubeConfig: KubeConfig): CoreV1Api => kubeConfig.makeApiClient(CoreV1Api);
export const createRbacAuthorizationV1beta1Api = (kubeConfig: KubeConfig): RbacAuthorizationV1beta1Api => kubeConfig.makeApiClient(RbacAuthorizationV1beta1Api);
export const createRbacAuthorizationV1Api = (kubeConfig: KubeConfig): RbacAuthorizationV1Api => kubeConfig.makeApiClient(RbacAuthorizationV1Api);
export const createAppsV1Api = (kubeConfig: KubeConfig): AppsV1Api => kubeConfig.makeApiClient(AppsV1Api);
export const createCustomObjectsApi = (kubeConfig: KubeConfig): CustomObjectsApi => kubeConfig.makeApiClient(CustomObjectsApi);
export const createAdmissionregistrationV1Api = (kubeConfig: KubeConfig): AdmissionregistrationV1Api => kubeConfig.makeApiClient(AdmissionregistrationV1Api);
export const createPolicyV1beta1Api = (kubeConfig: KubeConfig): PolicyV1beta1Api => kubeConfig.makeApiClient(PolicyV1beta1Api);

export const createAllApis = (kubeConfig: KubeConfig): {
  coreV1Api: CoreV1Api,
  rbacAuthV1beta1Api: RbacAuthorizationV1beta1Api,
  rbacAuthV1Api: RbacAuthorizationV1Api,
  appsV1Api: AppsV1Api,
  customObjectsApi: CustomObjectsApi,
  admissionregistrationV1Api: AdmissionregistrationV1Api,
  policyV1beta1Api: PolicyV1beta1Api,
} => ({
  coreV1Api: createCoreV1Api(kubeConfig),
  rbacAuthV1beta1Api: createRbacAuthorizationV1beta1Api(kubeConfig),
  rbacAuthV1Api: createRbacAuthorizationV1Api(kubeConfig),
  appsV1Api: createAppsV1Api(kubeConfig),
  customObjectsApi: createCustomObjectsApi(kubeConfig),
  admissionregistrationV1Api: createAdmissionregistrationV1Api(kubeConfig),
  policyV1beta1Api: createPolicyV1beta1Api(kubeConfig),
});
