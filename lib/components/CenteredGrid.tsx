import Grid, { GridProps } from "@material-ui/core/Grid";


export default function CenteredGrid (props: GridProps) {
  const { children } = props;
  return <Grid container justify="center" alignItems="center" {...props}>
    {children}
  </Grid>;
};
