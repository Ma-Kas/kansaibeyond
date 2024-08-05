import { IconProps, Icon } from '@tabler/icons-react';

import classes from './EmbedButton.module.css';

type Props = {
  item: {
    text: string;
    onClick: () => void;
    icon: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<Icon>
    >;
  };
};

const EmbedButton = ({ item }: Props) => {
  const Icon = item.icon;
  return (
    <button
      type='button'
      key={item.text}
      onClick={item.onClick}
      className={classes['embed_button']}
      disabled={['Table', 'Columns Layout', 'Expandable List'].includes(
        item.text
      )}
      data-test-id='embed-modal-option-url'
    >
      <Icon />
      <span>{item.text}</span>
    </button>
  );
};

export default EmbedButton;
