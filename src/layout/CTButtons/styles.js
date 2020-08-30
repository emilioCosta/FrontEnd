import { makeStyles } from '@material-ui/core/styles';

export const useButtonStyles = makeStyles({
  bold: {
    fontWeight: 'bold'
  },
  teal: {
    fontWeight: 'bold',
    marginLeft: 5,
    minWidth: 'max-content',
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      },
      '&:disabled': {
        opacity: 0.8
      }
    }
  },
  tealLink: {
    fontWeight: 'bold',
    '&:hover': {
      color: 'teal'
    }
  }
});