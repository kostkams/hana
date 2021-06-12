import Operator, {ResourceEvent, ResourceEventType} from '@dot-i/k8s-operator';
import path from 'path';
import {JwksCustomResource} from './interfaces';
import {
  deployJwks,
  deleteJwks,
} from './jwks.deployment';
import {deleteJwksSecret, generateJwksSecret} from './key-store';

export class JwksOperator extends Operator {
  protected async init() {
    console.log('JwksOperator init');
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
      // ...
    });
  }

  private async onModified(e: ResourceEvent) {
    const object = e.object as JwksCustomResource;
    if (!object) {
      return;
    }

    const namespace = object.metadata!.namespace!;

    await generateJwksSecret(this.k8sApi, namespace);
    await deployJwks(this.kubeConfig, namespace, object.spec.wellKnownPath, object.spec.version);
  }

  private async resourceDeleted(e: ResourceEvent) {
    const object = e.object as JwksCustomResource;
    if (!object) {
      return;
    }

    const namespace = object.metadata!.namespace!;

    await deleteJwksSecret(this.k8sApi, object.metadata!.namespace!);
    await deleteJwks(this.kubeConfig, namespace);
  }
}
