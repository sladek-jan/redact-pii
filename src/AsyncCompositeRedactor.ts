import { composeChildRedactors } from './composition';
import { AsyncCustomRedactorConfig, CompositeRedactorOptions, IAsyncRedactor, ISyncRedactor, SimpleFinding } from './types';
import { isSyncRedactor } from './utils';

/** @public */
export interface AsyncCompositeRedactorOptions extends CompositeRedactorOptions<AsyncCustomRedactorConfig> { }

/** @public */
export class AsyncCompositeRedactor implements IAsyncRedactor {
  private childRedactors: Array<ISyncRedactor | IAsyncRedactor> = [];

  constructor(opts?: AsyncCompositeRedactorOptions) {
    this.childRedactors = composeChildRedactors(opts);
  }

  redactAsync = async (textToRedact: string, whitelist?: Set<string>) => {
    let allFindings: SimpleFinding[] = []
    let redactedText = textToRedact
    for (const redactor of this.childRedactors) {
      if (isSyncRedactor(redactor)) {
        const { text, findings } = redactor.redact(textToRedact, whitelist);
        findings.forEach(f => allFindings.push(f))
        redactedText = text;
      } else {
        const { text, findings } = await redactor.redactAsync(textToRedact, whitelist);
        findings.forEach(f => allFindings.push(f))
        redactedText = text;
      }
    }
    return { text: redactedText, findings: allFindings };
  };
}
