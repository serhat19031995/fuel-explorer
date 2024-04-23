import type { PredicatePayload } from '@core/domain/Predicate/PredicateModel';
import type {
  GQLInput,
  GQLInputCoin,
  GQLInputMessage,
} from '@core/generated/gql-types';
import { ValueObject } from '@core/shared/ValueObject';
import { InputType } from './InputType';

interface Props {
  value: PredicatePayload | undefined;
}

export class InputPredicateData extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static create(value: GQLInput) {
    const data = getPredicateData(value);
    return new InputPredicateData({ value: data });
  }

  value() {
    return this.props.value;
  }
}

function getPredicateData(value: GQLInput) {
  const type = InputType.create(value);
  if (!type.isCoin && !type.isMessage) return;

  const bytecode = (value as GQLInputCoin | GQLInputMessage).predicate;
  const address = getPredicateAddress(value);
  return { bytecode, address };
}

function getPredicateAddress(data: GQLInput) {
  const type = InputType.create(data);
  if (type.is('InputCoin')) return (data as GQLInputCoin).owner;
  return (data as GQLInputMessage).sender;
}
