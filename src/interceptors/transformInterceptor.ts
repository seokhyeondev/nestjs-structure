import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationResDTO } from 'src/common/models/res/pagination.res.dto';

interface ClassType<T> {
  new (): T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Promise<Partial<T>>> {
  constructor(private readonly classType: ClassType<T>, private readonly pagination?: boolean) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Promise<Partial<T>>> {
    return next.handle().pipe(
      map(async data => {
        if (this.pagination) {
          const paginationResDTO = new PaginationResDTO();
          paginationResDTO.totalCount = data.totalCount;
          paginationResDTO.list = await Promise.all(
            data.list.map(async (item: any) => {
              const convertItem: any = plainToInstance(this.classType, item, { enableImplicitConversion: true });
              await validate(convertItem, {
                whitelist: true,
                validationError: { target: false },
                forbidNonWhiteliste: false,
                dismissDefaultMessages: false,
                forbidUnknownValues: true,
              });
              return convertItem;
            }),
          );
          return paginationResDTO;
        } else {
          const convertData: any = plainToInstance(this.classType, data);

          await validate(convertData, {
            whitelist: true,
            validationError: { target: false },
            forbidNonWhiteliste: false,
            dismissDefaultMessages: false,
            forbidUnknownValues: true,
          });

          return convertData;
        }
      }),
    );
  }
}
