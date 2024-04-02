import { relations } from 'drizzle-orm';
import { index, pgTable } from 'drizzle-orm/pg-core';

import { Hash256, Jsonb, SerialID } from '~/application/vo';
import { BridgeContractLogsTable } from '~/domain/BridgeContractLog/BridgeContractLogModel';

import { Block } from 'viem';
import { BridgeBlockNumber } from './vo/BridgeBlockNumber';
import { BridgeBlockTimestamp } from './vo/BridgeBlockTimestamp';

export const BridgeBlocksTable = pgTable(
  'bridge_blocks',
  {
    _id: SerialID.type(),
    hash: Hash256.type('hash').unique(),
    number: BridgeBlockNumber.type().unique(),
    timestamp: BridgeBlockTimestamp.type().unique(),
    data: Jsonb.type<Block>('data'),
  },
  (table) => ({
    blockIdIdx: index().on(table._id),
    bridgeBlockHashIdx: index().on(table.hash),
    bridgeBlockNumberIdx: index().on(table.number),
    bridgeBlockTimestampIdx: index().on(table.timestamp),
  }),
);

export const BridgeBlocksRelations = relations(
  BridgeBlocksTable,
  ({ many }) => ({
    contractLogs: many(BridgeContractLogsTable),
  }),
);

export type BridgeBlockItem = typeof BridgeBlocksTable.$inferSelect;