import yargs from 'yargs/yargs';
import { db } from '../database/Db';
import { QueueNames, queue } from '../queue';

const PER_PAGE = 10;

export class Program {
  async create() {
    yargs(process.argv.slice(2))
      .command({
        command: 'sync',
        describe: 'Sync blocks from node',
        builder: (yargs) => {
          return yargs
            .option('all', {
              alias: 'a',
              type: 'boolean',
              default: false,
            })
            .option('bridge', {
              alias: 'b',
              type: 'boolean',
              default: false,
            })
            .option('missing', {
              alias: 'm',
              type: 'boolean',
              default: false,
            })
            .option('from', {
              alias: 'fl',
              type: 'number',
              default: null,
            })
            .option('clean', {
              alias: 'c',
              type: 'boolean',
              default: false,
            });
        },
        handler: async (argv) => {
          await this.sync(argv);
        },
      })
      .command({
        command: 'migrate',
        describe: 'Run migrations',
        handler: async () => {
          await db.connect();
          await db.migrate();
          await db.close();
        },
      })
      .help('help')
      .parse();
  }

  async sync(argv: {
    all: boolean;
    bridge: boolean;
    missing: boolean;
    from: number | null;
    clean: boolean;
  }) {
    await db.connect();
    await queue.start();

    if (argv.clean) {
      await queue.deleteAllQueues();
    }
    if (argv.missing) {
      await queue.push(QueueNames.SYNC_MISSING, undefined);
    }
    if (argv.bridge) {
      const mockBlock = 5606747;
      // @TODO: Maybe we need to clean everything realted to fuel
      // since we have indexed everything from L2 already
      // await queue.push(QueueNames.SYNC_BRIDGE_FUEL_TO_ETH, {
      //   address: mockAddress,
      // });
      await queue.push(QueueNames.SYNC_BRIDGE_ETH_TO_FUEL, {
        fromBlock: mockBlock,
        toBlock: mockBlock,
      });
    }
    if (argv.all) {
      await queue.push(QueueNames.SYNC_BLOCKS, {
        first: PER_PAGE,
      });
    }
    if (!argv.all && argv.from) {
      await queue.push(QueueNames.SYNC_BLOCKS, {
        after: argv.from,
        first: PER_PAGE,
      });
    }

    await queue.stop();
    await db.close();
  }
}
