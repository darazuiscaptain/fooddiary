import React from 'react';
import { Divider, List, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CategoriesListItem from './CategoriesListItem';
import { getCategories } from '../thunks';
import { useAppDispatch, useRefreshEffect, useAppSelector } from '../../__shared__/hooks';

const useStyles = makeStyles(theme => ({
  emptyItems: {
    padding: theme.spacing(2),
  },
}));

const CategoriesList: React.FC = () => {
  const categoryItems = useAppSelector(state => state.categories.categoryItems);

  const dispatch = useAppDispatch();
  const classes = useStyles();

  useRefreshEffect(
    state => state.categories.operationStatus,
    () => {
      dispatch(getCategories());
    },
  );

  if (categoryItems.length === 0) {
    return (
      <Typography color="textSecondary" align="center" className={classes.emptyItems}>
        No categories found
      </Typography>
    );
  }

  return (
    <List>
      {categoryItems.map((category, index) => (
        <React.Fragment key={category.id}>
          <CategoriesListItem category={category}></CategoriesListItem>
          {index >= 0 && index < categoryItems.length - 1 && <Divider></Divider>}
        </React.Fragment>
      ))}
    </List>
  );
};

export default CategoriesList;
