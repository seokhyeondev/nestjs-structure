import { OmitType } from '@nestjs/swagger';
import { UserModelDTO } from '../user.model.dto';

export class UserDetail_GET_RES_DTO extends OmitType(UserModelDTO, ['deletedAt', 'password', 'salt'] as const) {}
