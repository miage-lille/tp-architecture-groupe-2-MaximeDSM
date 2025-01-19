import { IDateGenerator } from 'src/core/ports/date-generator.interface';
import { IIdGenerator } from 'src/core/ports/id-generator.interface';
import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { OrganizeWebinars } from './organize-webinar';
import { FixedDateGenerator } from 'src/core/adapters/fixed-date-generator';
import { FixedIdGenerator } from 'src/core/adapters/fixed-id-generator';
import { BookSeat } from './book-seat';
import { IParticipationRepository } from '../ports/participation-repository.interface';
import { InMemoryParticipationRepository } from '../adapters/participation-repository.in-memory';
import { IMailer } from 'src/core/ports/mailer.interface';
import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { User } from 'src/users/entities/user.entity';

describe('Feature: book a seat', () => {
  let repository: InMemoryWebinarRepository;
  let idGenerator: IIdGenerator;
  let createWebinar: OrganizeWebinars;
  let dateGenerator: IDateGenerator;
  let useCase: BookSeat;
  let participationRepository: IParticipationRepository;
  let iMailer: IMailer;
  let user: User;
  let webinarId: string;

  const payload = {
    userId: 'user-alice-id',
    title: 'Webinar title',
    seats: 100,
    startDate: new Date('2024-01-10T10:00:00.000Z'),
    endDate: new Date('2024-01-10T11:00:00.000Z'),
  };

  beforeEach(() => {
    repository = new InMemoryWebinarRepository();
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();
    participationRepository = new InMemoryParticipationRepository();
    iMailer = new InMemoryMailer();
    createWebinar = new OrganizeWebinars(
      repository,
      idGenerator,
      dateGenerator,
    );
    useCase = new BookSeat(participationRepository, repository, iMailer);

    user = new User({
      id: idGenerator.generate(),
      email: 'test@gmail.com',
      password: 'test',
    });

    createWebinar.execute(payload).then((value) => {
      webinarId = value.id;
      useCase.execute({ webinarId: value.id, user: user });
    });
  });

  describe('Scenario: user has already booked for this webinar', () => {
    it('should throw an error', async () => {
      await expect(
        useCase.execute({ webinarId: webinarId, user: user }),
      ).rejects.toThrow('The user already participates to the Webinar');
    });
  });
});
