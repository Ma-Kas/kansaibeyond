import { Container, Button, Divider, ActionIcon, Group } from '@mantine/core';

import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowForwardUp,
} from '@tabler/icons-react';
import classes from './ComposerHeader.module.css';

const ComposerHeader = () => {
  return (
    <header className={classes.composerheader}>
      <Container fluid>
        <div className={classes['composerheader-inner']}>
          <Button
            leftSection={<IconArrowLeft size={14} />}
            className={classes['plain-button']}
            variant='transparent'
          >
            Back
          </Button>

          <Group ml={'auto'}>
            <ActionIcon
              variant='transparent'
              className={classes['plain-button']}
            >
              <IconArrowBackUp className={classes['action-button']} />
            </ActionIcon>
            <ActionIcon
              variant='transparent'
              className={classes['plain-button']}
            >
              <IconArrowForwardUp className={classes['action-button']} />
            </ActionIcon>
            <Divider orientation='vertical' />
            <Button className={classes['color-button']} variant='transparent'>
              Save
            </Button>
            <Divider orientation='vertical' />
            <Button className={classes['color-button']} variant='transparent'>
              Preview
            </Button>
            <Button
              radius={'xl'}
              style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
            >
              Publish
            </Button>
          </Group>
        </div>
      </Container>
    </header>
  );
};

export default ComposerHeader;
