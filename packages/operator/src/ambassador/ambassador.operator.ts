import Operator, {ResourceEvent, ResourceEventType} from '@dot-i/k8s-operator';
import {ApiextensionsV1beta1Api} from '@kubernetes/client-node';
import path from 'path';
import {deleteAes, deleteCrds, deleteUser, deployAes, deployCrds, deployUser} from './from-get-ambassador.io';
import {deleteConsul, deployConsul} from './from-get-ambassador.io/consul.deployment';
import {AmbassadorCustomResource} from './interfaces';

export class AmbassadorOperator extends Operator {
  protected async init() {
    console.log('Ambassador Operator init');

    const crdFile = path.resolve(__dirname, 'crds.yaml');
    const {group, versions, plural} = await this.registerCustomResourceDefinition(crdFile);

    await this.watchResource(group, versions[0].name, plural, async (e) => {
      try {
        switch (e.type) {
          case ResourceEventType.Added:
          case ResourceEventType.Modified:
            if (!await this.handleResourceFinalizer(e, `${plural}.${group}`, (event) => this.resourceDeleted(event))) {
              await this.onModified(e);
            }
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  private async onModified(e: ResourceEvent) {
    const object = e.object as AmbassadorCustomResource;
    if (!object) {
      return;
    }

    await deployCrds(this.kubeConfig.makeApiClient(ApiextensionsV1beta1Api));
    await deployAes(this.kubeConfig);
    if (object.spec.tls) {
      await deployUser(this.kubeConfig, object.spec.tls);
    }
    await deployConsul(this.kubeConfig);
  }

  private async resourceDeleted(e: ResourceEvent) {
    const object = e.object as AmbassadorCustomResource;
    if (!object) {
      return;
    }

    await deleteConsul(this.kubeConfig);
    await deleteUser(this.kubeConfig);
    await deleteAes(this.kubeConfig);
    await deleteCrds(this.kubeConfig.makeApiClient(ApiextensionsV1beta1Api));
  }
}
