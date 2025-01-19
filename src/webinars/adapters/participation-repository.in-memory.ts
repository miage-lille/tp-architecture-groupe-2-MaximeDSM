import { Participation } from '../entities/participation.entity';
import { IParticipationRepository } from '../ports/participation-repository.interface';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(public database: Participation[] = []) {}

  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    let res: Participation[] = [];
    this.database.forEach((value: Participation) => {
      if (value.props.webinarId == webinarId) {
        res.push(value);
      }
    });
    return res;
  }

  async save(participation: Participation): Promise<void> {
    this.database.push(participation);
  }
}
