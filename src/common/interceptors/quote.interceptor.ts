import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddUserInfoToResponseInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        data.userInformation = {};
        if (data.showUserInformation) {
          const user = await this.prismaService.quote.findUnique({
            where: { id: data.id },
            include: {
              user: { select: { fname: true, lname: true } },
            },
          });
          data.userInformation = user;
        }
        return data;
      }),
    );
  }
}
