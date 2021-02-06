import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTypedSelector } from '../../__shared__/hooks';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}));

const PageContentHeader: React.FC = () => {
  const classes = useStyles();
  const page = useTypedSelector(state => state.pages.current);

  return (
    <Typography variant="h1" align="center" className={classes.root}>
      {page?.date || ''}
    </Typography>
  );
};

export default PageContentHeader;
