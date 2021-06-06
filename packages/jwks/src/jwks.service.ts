import {Injectable} from '@nestjs/common';
import {JWK} from 'node-jose';

@Injectable()
export class JwksService {
    private keyStore: JWK.KeyStore | undefined;

    async getPublicJwks() {
      await this.load();

      return this.keyStore!.toJSON(false);
    }

    private async load() {
      if (this.keyStore) {
        return;
      }

      this.keyStore = await JWK.asKeyStore(process.env.JWKS!);
    }
}
