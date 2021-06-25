import Operator, {ResourceEvent, ResourceEventType} from '@dot-i/k8s-operator';
import path from 'path';
import {deleteDatabase, deployDatabase} from './database.deployment';
import {DatabaseCustomResource} from './interfaces';
import {deleteDatabaseSecret, deployDatabaseSecret} from './secret.deployment';

export class DatabaseOperator extends Operator {
  protected async init() {
    try {
      console.log('DatabaseOperator init');
      const crdFile = path.resolve(__dirname, 'crds.yaml');
      const {group, versions, plural} = await this.registerCustomResourceDefinition(crdFile);
      await this.watchResource(group, versions[0].name, plural, async (e) => {
        switch (e.type) {
          case ResourceEventType.Added:
          case ResourceEventType.Modified:
            if (!await this.handleResourceFinalizer(e, `${plural}.${group}`, (event) => this.resourceDeleted(event))) {
              await this.onModified(e);
            }
            break;
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  private async onModified(e: ResourceEvent) {
    const object = e.object as DatabaseCustomResource;
    if (!object) {
      return;
    }

    const namespace = object.metadata!.namespace!;

    await deployDatabaseSecret(this.k8sApi, namespace);
    await deployDatabase(this.kubeConfig, namespace, object.spec.withUI);
  }

  private async resourceDeleted(e: ResourceEvent) {
    const object = e.object as DatabaseCustomResource;
    if (!object) {
      return;
    }

    const namespace = object.metadata!.namespace!;

    await deleteDatabaseSecret(this.k8sApi, namespace);
    await deleteDatabase(this.kubeConfig, namespace);
  }
}
