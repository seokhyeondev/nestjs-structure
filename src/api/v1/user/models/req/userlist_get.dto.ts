import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import PaginationDTO from 'src/common/models/req/pagination.dto';
import { UserModelDTO } from '../user.model.dto';

export class UserList_GET_DTO extends IntersectionType(
  PaginationDTO,
  PartialType(OmitType(UserModelDTO, ['createdAt', 'deletedAt', 'updatedAt'] as const)),
) {}
