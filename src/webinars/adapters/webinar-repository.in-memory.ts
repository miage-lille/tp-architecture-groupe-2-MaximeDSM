import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { WebinarDoesNotExistsException } from '../exceptions/webinar-not-exists';

export class InMemoryWebinarRepository implements IWebinarRepository {
  constructor(public database: Webinar[] = []) {}
  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }
  async get(webinarId: string): Promise<Webinar> {
    this.database.forEach((value: Webinar) => {
      if (value.props.id === webinarId) {
        return value;
      }
    });
    throw new WebinarDoesNotExistsException();
  }
}
