import type {
  GQLTransaction,
  GQLTransactionStatus,
  Maybe,
} from '@core/generated/gql-types';
import { ValueObject } from '@core/shared/ValueObject';
import { text } from 'drizzle-orm/pg-core';

interface Props {
  value: Maybe<GQLTransactionStatus['__typename']> | undefined;
}

export class TransactionStatus extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static type() {
    return text('timestamp');
  }

  static create(transaction: GQLTransaction) {
    return new TransactionStatus({ value: transaction.status?.__typename });
  }

  value() {
    return this.type;
  }

  is(status: 'Success' | 'Failure' | 'Squeezed' | 'Submitted') {
    const statusType = this.props.value;
    if (status === 'Success') return statusType === 'SuccessStatus';
    if (status === 'Failure') return statusType === 'FailureStatus';
    if (status === 'Squeezed') return statusType === 'SqueezedOutStatus';
    return statusType === 'SubmittedStatus';
  }

  get type() {
    if (this.is('Success')) return 'Success';
    if (this.is('Failure')) return 'Failure';
    if (this.is('Squeezed')) return 'Squeezed';
    return 'Submitted';
  }
}
