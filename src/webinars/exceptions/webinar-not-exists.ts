export class WebinarDoesNotExistsException extends Error {
  constructor() {
    super('The webinar does not exist');
    this.name = 'WebinarDoesNotExistsException';
  }
}
