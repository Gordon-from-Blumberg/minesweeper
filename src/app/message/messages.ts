import messages from './messages.json';

/**
 * This class may be used for internationlization
 */
export class Messages {
  private static messages: any;

  static loadMessages(locale: string) {
    this.messages = messages;
  }

  static get(code: string, ...params: string[]): string {
    let i = 0;
    return this.messages[code].replace(/%s/g, () => params[i++]);
  }
}

