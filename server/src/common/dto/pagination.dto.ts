/* eslint-disable no-magic-numbers */
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateIf
} from 'class-validator'
import { constants } from '../constants'

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  @Max(constants.pagination.defaultMaxLimit)
  @Type(() => Number)
  limit: number

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page: number

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((p) => Boolean(p.search))
  search?: string

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((p) => Boolean(p.key))
  key?: string

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((p) => Boolean(p.value))
  value?: string

  skip?: number
}
