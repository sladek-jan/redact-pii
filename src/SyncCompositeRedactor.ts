import { composeChildRedactors } from './composition';
import { CompositeRedactorOptions, ISyncRedactor, SimpleFinding, SyncCustomRedactorConfig } from './types';

/** @public */
export interface SyncCompositeRedactorOptions extends CompositeRedactorOptions<SyncCustomRedactorConfig> { }

/** @public */
export class SyncCompositeRedactor implements ISyncRedactor {
  private childRedactors: ISyncRedactor[] = [];

  constructor(opts?: SyncCompositeRedactorOptions) {
    this.childRedactors = composeChildRedactors(opts);
  }

  redact = (textToRedact: string, whitelist?: Set<string>) => {
    let allFindings = [] as SimpleFinding[];
    let redactedText = textToRedact
    for (const redactor of this.childRedactors) {
      const { text, findings } = redactor.redact(textToRedact, whitelist);
      findings.forEach(f => allFindings.push(f))
      redactedText = text
    }
    return {
      text: redactedText, findings: allFindings
    };
  };
}
