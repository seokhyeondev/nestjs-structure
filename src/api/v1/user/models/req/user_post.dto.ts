import { OmitType, PartialType } from '@nestjs/swagger';
import { UserModelDTO } from '../user.model.dto';

export class User_POST_DTO extends OmitType(UserModelDTO, ['id', 'createdAt', 'deletedAt', 'updatedAt'] as const) {}
