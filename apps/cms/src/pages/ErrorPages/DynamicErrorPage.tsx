import { useNavigate, Link } from 'react-router-dom';
import { ERROR_ANIMALS_AND_TEXT } from './errorAnimals';

import classes from './ErrorPages.module.css';

const DynamicErrorPage = ({ error }: { error: Error }) => {
  const navigate = useNavigate();
  const chosenAnimal =
    ERROR_ANIMALS_AND_TEXT[
      Math.floor(Math.random() * ERROR_ANIMALS_AND_TEXT.length)
    ];

  return (
    <div className={classes['error_container']}>
      <div className={classes.label}>Oops</div>
      <p className={classes['dynamic_heading']}>
        Something went wrong: {error.message}
      </p>
      <div className={classes['error_cat_container']}>
        <img src={chosenAnimal.image} alt='Error image' />
      </div>
      <p className={classes['dynamic_description']}>
        This shouldn't have happened. {chosenAnimal.text}&nbsp;
        <span>
          <Link
            className={classes['link']}
            to={'..'}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            go back
          </Link>
        </span>
        .
      </p>
    </div>
  );
};

export default DynamicErrorPage;
