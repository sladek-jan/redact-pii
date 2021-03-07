import * as simpleRegexpBuiltIns from './built-ins/simple-regexp-patterns';

export type SimpleFinding = {
  text: string,
  replaceWith: string
}

export interface ISyncRedactor {
  /**
 * @param textToRedact 
 * @param whitelist Applies only to GoogleDLPRedactor. Set of strings that should not be redacted.
 */
  redact(textToRedact: string, whitelist?: Set<string>): { text: string, findings: SimpleFinding[] };
}

export interface IAsyncRedactor {
  /**
   * @param textToRedact 
   * @param whitelist Applies only to GoogleDLPRedactor. Set of strings that should not be redacted.
   */
  redactAsync(textToRedact: string, whitelist?: Set<string> | undefined): Promise<{ text: string, findings: SimpleFinding[] }>;
}

export type IRedactor = ISyncRedactor | IAsyncRedactor;

export interface SimpleRegexpCustomRedactorConfig {
  regexpPattern: RegExp;
  replaceWith: string;
}

export type SyncCustomRedactorConfig = SimpleRegexpCustomRedactorConfig | ISyncRedactor;

export type AsyncCustomRedactorConfig = SyncCustomRedactorConfig | IAsyncRedactor;

export interface CompositeRedactorOptions<T extends AsyncCustomRedactorConfig> {
  globalReplaceWith?: string;
  disableBuiltInRedactors?: boolean;
  builtInRedactors?: {
    [RedactorName in keyof typeof simpleRegexpBuiltIns | 'names']?: {
      enabled?: boolean;
      replaceWith?: string;
    };
  };
  customRedactors?: {
    before?: Array<T>;
    after?: Array<T>;
  };
}
