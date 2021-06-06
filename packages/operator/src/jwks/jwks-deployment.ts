import {AppsV1Api, CoreV1Api, KubernetesObject, V1Deployment} from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export const createService = async (k8sApi: CoreV1Api, namespace: string) => {
  console.log('Create JWKS service');

  const filePath = path.resolve(__dirname, 'k8s.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const specs: KubernetesObject[] = yaml.safeLoadAll(fileContent);

  const service = specs.find((spec) => spec.kind === 'Service');
  await deployService(k8sApi, namespace, service!);
};

export const createDeployment = async (k8sApi: AppsV1Api, namespace: string, wellKnownPath: string, version: string) => {
  console.log('Create JWKS deployment');

  const filePath = path.resolve(__dirname, 'k8s.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const specs: KubernetesObject[] = yaml.safeLoadAll(fileContent);

  const deployment = specs.find((spec) => spec.kind === 'Deployment');
  await deployDeployment(k8sApi, namespace, deployment!, wellKnownPath, version);
};

export const deleteService = async (k8sApi: CoreV1Api, namespace: string) => {
  console.log('Delete JWKS service');

  const filePath = path.resolve(__dirname, 'k8s.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const specs: KubernetesObject[] = yaml.safeLoadAll(fileContent);

  const service = specs.find((spec) => spec.kind === 'Service');
  await removeService(k8sApi, namespace, service!);
};

export const deleteDeployment = async (k8sApi: AppsV1Api, namespace: string) => {
  console.log('Delete JWKS deployment');

  const filePath = path.resolve(__dirname, 'k8s.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const specs: KubernetesObject[] = yaml.safeLoadAll(fileContent);

  const deployment = specs.find((spec) => spec.kind === 'Deployment');
  await removeDeployment(k8sApi, namespace, deployment!);
};

const serviceExists = async (k8sApi: CoreV1Api, namespace: string, service: KubernetesObject) => {
  try {
    await k8sApi.readNamespacedService(service.metadata!.name!, namespace);
    return true;
  } catch (e) {
    return false;
  }
};

const deploymentExists = async (k8sApi: AppsV1Api, namespace: string, service: KubernetesObject) => {
  try {
    await k8sApi.readNamespacedDeployment(service.metadata!.name!, namespace);
    return true;
  } catch (e) {
    return false;
  }
};

const deployService = async (k8sApi: CoreV1Api, namespace: string, service: KubernetesObject) => {
  if (await serviceExists(k8sApi, namespace, service)) {
    return;
  }

    service.metadata!.labels = {
      ...service.metadata!.labels,
      hana: 'v0.0.1',
    };

    await k8sApi.createNamespacedService(namespace, service);
};

const deployDeployment = async (
  k8sApi: AppsV1Api,
  namespace: string,
  deployment: V1Deployment,
  wellKnownPath: string,
  version: string
) => {
  if (await deploymentExists(k8sApi, namespace, deployment)) {
    return;
  }

    deployment.metadata!.labels = {
      ...deployment.metadata!.labels,
      hana: 'v0.0.1',
    };
    deployment.spec!.template.spec!.containers[0].env![0].value = wellKnownPath;
    deployment.spec!.template.spec!.containers[0].image = deployment.spec!.template.spec!.containers[0].image!.replace(/VERSION/g, version);

    await k8sApi.createNamespacedDeployment(namespace, deployment);
};

const removeService = async (k8sApi: CoreV1Api, namespace: string, service: KubernetesObject) => {
  if (!await serviceExists(k8sApi, namespace, service)) {
    return;
  }

  await k8sApi.deleteNamespacedService(service.metadata!.name!, namespace);
};

const removeDeployment = async (k8sApi: AppsV1Api, namespace: string, deployment: KubernetesObject) => {
  if (!await deploymentExists(k8sApi, namespace, deployment)) {
    return;
  }

  await k8sApi.deleteNamespacedDeployment(deployment.metadata!.name!, namespace);
};
