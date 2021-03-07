import { ISyncRedactor } from '../types';
import { snakeCase } from 'lodash';

// Upper bound for regexps that lead into catastrophic backtracking and/or OOM, e.g. |}{}{|:<>.,,
const MAX_STEPS = 1000

export class SimpleRegexpRedactor implements ISyncRedactor {
  regexpMatcher: RegExp;
  replaceWith: string;

  constructor({
    replaceWith = snakeCase(name).toUpperCase(),
    regexpPattern: regexpMatcher
  }: {
    replaceWith: string;
    regexpPattern: RegExp;
  }) {
    this.replaceWith = replaceWith;
    this.regexpMatcher = regexpMatcher;
  }

  redact(textToRedact: string) {
    const isRegexGlobal = this.regexpMatcher.flags.includes('g');
    let globalRegex = this.regexpMatcher;
    if (!isRegexGlobal) {
      globalRegex = new RegExp(this.regexpMatcher.source, this.regexpMatcher.flags + 'g');
    }
    let findings = [];
    let match, step = 1;
    let result = textToRedact
    while (step <= MAX_STEPS && (match = globalRegex.exec(textToRedact))) {
      findings.push({ text: match[0], replaceWith: this.replaceWith });
      result = textToRedact.replace(match[0], this.replaceWith)
      step++;
    }
    return {
      text: result, findings
    }
  }
}