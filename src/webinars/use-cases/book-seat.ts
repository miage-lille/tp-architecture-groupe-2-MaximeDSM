import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { Participation } from '../entities/participation.entity';
import { UserAlreadyParticipateException } from '../exceptions/user-already-participate';
import { Webinar } from '../entities/webinar.entity';
import { WebinarNotEnoughSeatsException } from '../exceptions/webinar-not-enough-seats';

type Request = {
  webinarId: string;
  user: User;
};
type Response = void;

export class BookSeat implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly webinarRepository: IWebinarRepository,
    private readonly mailer: IMailer,
  ) {}
  async execute({ webinarId, user }: Request): Promise<Response> {
    let actualNbSeats: number;
    let organizerId: string;

    // Check if the user does not already participate
    this.participationRepository
      .findByWebinarId(webinarId)
      .then((value: Participation[]) => {
        actualNbSeats = value.length;
        value.forEach((participation: Participation) => {
          if (participation.props.userId === user.props.id) {
            throw new UserAlreadyParticipateException();
          }
        });
      });

    // Check if the webinar is not full
    this.webinarRepository.get(webinarId).then((value: Webinar) => {
      if (actualNbSeats >= value.props.seats) {
        throw new WebinarNotEnoughSeatsException();
      }
    });

    // At this point we can book a seat
    this.participationRepository.save(
      new Participation({ userId: user.props.id, webinarId: webinarId }),
    );

    // We also send a mail to the organizer
    this.mailer.send({
      to: webinarId,
      subject: 'New Booking',
      body:
        user.props.email + ' has booked  seat for your webinar ' + webinarId,
    });
  }
}
