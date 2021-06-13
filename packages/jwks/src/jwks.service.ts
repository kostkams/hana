import {Injectable} from '@nestjs/common';
import {JWK, JWS} from 'node-jose';

@Injectable()
export class JwksService {
    private keyStore: JWK.KeyStore | undefined;

    async getPublicJwks() {
      await this.load();

      return this.keyStore!.toJSON(false);
    }

    async sign(id: string, email: string) {
      await this.load();

      const key = await JWK.asKey(this.keyStore!.all({use: 'sig'})[0]);
      const opt = {compact: true, jwk: key, fields: {type: 'jwt'}};

      const now = Math.floor(Date.now() / 1000);
      const payload = JSON.stringify({
        iat: now - 30,
        iss: id,
        email,
        exp: now + 60 * 60,
      });

      return await JWS.createSign(opt, key)
          .update(payload)
          .final();
    }

    private async load() {
      if (this.keyStore) {
        return;
      }

      this.keyStore = await JWK.asKeyStore(process.env.JWKS!);
    }
}
