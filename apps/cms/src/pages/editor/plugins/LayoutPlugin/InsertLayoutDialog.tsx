import { LexicalEditor } from 'lexical';
import { useState } from 'react';

import Button from '../../ui/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import { INSERT_LAYOUT_COMMAND } from '../../utils/exportedCommands';

const LAYOUTS = [
  { label: '2 columns (equal width)', value: '1fr 1fr' },
  { label: '2 columns (25% - 75%)', value: '1fr 3fr' },
  { label: '3 columns (equal width)', value: '1fr 1fr 1fr' },
  { label: '3 columns (25% - 50% - 25%)', value: '1fr 2fr 1fr' },
  { label: '4 columns (equal width)', value: '1fr 1fr 1fr 1fr' },
];

export default function InsertLayoutDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const buttonLabel = LAYOUTS.find((item) => item.value === layout)?.label;

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
    onClose();
  };

  const dropdownItems = LAYOUTS.map(({ label, value }) => ({
    text: label,
    onClick: () => setLayout(value),
  }));

  return (
    <>
      <Dropdown
        type='general'
        currentValue={buttonLabel!}
        ariaLabel='Column Layout Options'
        items={dropdownItems}
        disabled={false}
      />
      <Button onClick={onClick}>Insert</Button>
    </>
  );
}
