import { OmitType, PartialType } from '@nestjs/swagger';
import { UserModelDTO } from '../user.model.dto';

export class User_PATCH_DTO extends PartialType(OmitType(UserModelDTO, ['createdAt', 'deletedAt', 'updatedAt'] as const)) {}
