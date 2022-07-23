import { PickType } from '@nestjs/swagger';
import { UserModelDTO } from '../user.model.dto';

export class UserList_GET_RES_DTO extends PickType(UserModelDTO, ['id', 'email'] as const) {}
