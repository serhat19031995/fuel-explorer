import type { GQLBlock } from '@core/generated/gql-types';
import { Identifier } from '@core/shared/Identifier';
import { integer } from 'drizzle-orm/pg-core';

export class BlockModelID extends Identifier<number> {
  private constructor(id: number) {
    super(id);
  }

  static type() {
    return integer('_id').primaryKey();
  }

  static create(block: GQLBlock) {
    return new BlockModelID(Number(block.header.height));
  }
}
