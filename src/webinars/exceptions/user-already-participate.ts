export class UserAlreadyParticipateException extends Error {
  constructor() {
    super('The user already participates to the Webinar');
    this.name = 'UserAlreadyParticipateException';
  }
}
