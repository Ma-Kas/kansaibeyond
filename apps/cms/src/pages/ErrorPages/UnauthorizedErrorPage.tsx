import { useNavigate } from 'react-router-dom';
import { ERROR_ANIMALS_AND_TEXT } from './errorAnimals';

import classes from './ErrorPages.module.css';
import { Button, Group } from '@mantine/core';

const UnauthorizedErrorPage = () => {
  const navigate = useNavigate();
  const chosenAnimal =
    ERROR_ANIMALS_AND_TEXT[
      Math.floor(Math.random() * ERROR_ANIMALS_AND_TEXT.length)
    ];

  return (
    <div className={classes['error_container']}>
      <div className={classes.label}>401</div>
      <p className={classes.title}>Access Unauthorized</p>
      <div className={classes['error_cat_container']}>
        <img src={chosenAnimal.image} alt='Error image' />
      </div>
      <p className={classes['dynamic_description']}>
        Looks like you were trying to access something you were not supposed to.
        Very sorry, but this guy has to stop you.
      </p>
      <Group justify='center'>
        <Button
          type='button'
          variant='subtle'
          size='md'
          onClick={() => navigate(-1)}
        >
          Click here to go back
        </Button>
      </Group>
    </div>
  );
};

export default UnauthorizedErrorPage;
