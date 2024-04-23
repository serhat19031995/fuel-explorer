import { SerialID } from '@core/application/vo';
import type { GQLInput } from '@core/generated/gql-types';
import { Entity } from '@core/shared/Entity';
import type { TxID } from '../Transaction/vo/TransactionModelID';
import type { InputItem, InputPayload } from './InputModel';
import { InputData } from './vo/InputData';
import { InputPredicateData } from './vo/InputPredicateData';
import { InputType } from './vo/InputType';

type InputProps = {
  data: InputData;
  type: InputType;
  predicateData: InputPredicateData;
};

export class InputEntity extends Entity<
  InputProps,
  SerialID | null | undefined
> {
  static create(input: InputPayload, inputId?: number) {
    if (!input?.data) {
      throw new Error('Input data is required');
    }

    const id = inputId ? SerialID.create(inputId) : null;
    const data = InputData.create(input.data);
    const type = InputType.create(input.data);
    const predicateData = InputPredicateData.create(input.data);
    return new InputEntity({ data, type, predicateData }, id);
  }

  static toDBItem(
    input: GQLInput,
    transactionId: TxID,
  ): Omit<InputItem, '_id'> {
    const data = InputData.create(input).value();
    return { data, transactionId };
  }

  get data() {
    return this.props.data;
  }

  get type() {
    return this.props.type;
  }

  get isCoin() {
    return this.type.is('InputCoin');
  }

  get isMessage() {
    return this.type.is('InputMessage');
  }

  get isContract() {
    return this.type.is('InputContract');
  }

  get predicateData() {
    return this.props.predicateData.value();
  }

  get hasPredicate() {
    const data = this.data.value();
    if ('predicate' in data) {
      return !!data.predicate && data.predicate !== '0x';
    }

    return false;
  }
}
