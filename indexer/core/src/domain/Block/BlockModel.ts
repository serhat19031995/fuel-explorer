import { Hash256, Timestamp } from '@core/application/vo';
import { TransactionsTable } from '@core/domain/Transaction/TransactionModel';
import { relations } from 'drizzle-orm';
import { index, pgTable } from 'drizzle-orm/pg-core';
import { BlockData } from './vo/BlockData';
import { BlockGasUsed } from './vo/BlockGasUsed';
import { BlockModelID } from './vo/BlockModelID';
import { BlockProducer } from './vo/BlockProducer';

export const BlocksTable = pgTable(
  'blocks',
  {
    _id: BlockModelID.type(),
    blockHash: Hash256.type('id').unique(),
    timestamp: Timestamp.type(),
    data: BlockData.type(),
    totalGasUsed: BlockGasUsed.type(),
    producer: BlockProducer.type(),
  },
  (table) => ({
    blockTimestampIdx: index().on(table.timestamp),
    blockHashIdx: index().on(table.blockHash),
    blockIdIdx: index().on(table._id),
  }),
);

export const BlocksRelations = relations(BlocksTable, ({ many }) => ({
  transactions: many(TransactionsTable),
}));

export type BlockItem = typeof BlocksTable.$inferSelect;