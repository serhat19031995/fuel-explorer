import { Address, VStack } from '@fuels/ui';
import clsx from 'clsx';
import { bn } from 'fuels';
import NextLink from 'next/link';
import { useContext } from 'react';
import { Amount } from '~/systems/Core/components/Amount/Amount';
import { ReceiptContext } from '~/systems/Transaction/component/TxScripts/context';

export function TxReceiptAmount({
  className,
  singleMode,
}: { className?: string; singleMode?: boolean }) {
  const { receipt: item } = useContext(ReceiptContext);
  const receipt = item?.item;
  const assetId = receipt?.assetId ?? '';
  const amount = bn(receipt?.amount);
  const contract = receipt?.to ?? receipt?.contractId ?? null;

  if (!amount?.gt?.(0)) {
    return null;
  }

  return (
    <VStack className={clsx('gap-1 items-end self-end', className)}>
      <Amount
        iconSize={16}
        assetId={assetId}
        value={amount}
        className="text-xs tablet:text-sm"
      />
      {!singleMode && !!contract && !!assetId && (
        <Address
          iconSize={14}
          value={assetId}
          className="text-xs tablet:text-sm font-mono hidden tablet:block"
          linkProps={{
            as: NextLink,
            href: `/contract/${contract}/assets`,
          }}
        />
      )}
    </VStack>
  );
}
