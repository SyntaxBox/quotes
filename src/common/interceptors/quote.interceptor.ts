import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

// this is response interceptor
// intercepts the quote endpoint
// adds user information if the client requires it
// the information will be added if the quote showUserInformation set to true
// showUserInformation is boolean value means if the user(publisher) information are public
// showUserInformation set by the owner
// if the value is true will the fname & lname & id will be public
@Injectable()
export class AddUserInfoToResponseInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        // checking if showUserInformation set to true
        if (data.showUserInformation === true) {
          // fetches to fname & lname & id
          try {
            const quote = await this.prismaService.quote.findUnique({
              where: { id: data.id },
              select: {
                user: { select: { fname: true, lname: true, id: true } },
              },
            });
            // adding the fetched data to the data object
            // adding user object key value pair
            data.user = quote.user;
          } catch (err) {
            data.user = {
              fname: '',
              lname: '',
              id: '',
              error: 'User not found or deleted',
            };
          }
        }
        // if the condition is not me then do not do anything
        // return the data back
        console.log(data);
        return data;
      }),
    );
  }
}
