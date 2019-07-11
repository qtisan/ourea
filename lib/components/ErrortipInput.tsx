import { TextField, Theme, Tooltip } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { createStyles, withStyles } from '@material-ui/styles';

export default withStyles((theme: Theme) =>
  createStyles({
    tooltip: {
      '&>.MuiTooltip-tooltip': {
        background: theme.palette.error[100]
      }
    }
  })
)(function ErrortipInput(props: TextFieldProps & { errmsg: string; classes: any }) {
  const { errmsg, classes, ...textFieldProps } = props;
  return (
    <Tooltip
      title={errmsg}
      placement="top"
      open={!!errmsg}
      PopperProps={{
        className: classes.tooltip
      }}
    >
      <TextField {...textFieldProps} error={!!errmsg} />
    </Tooltip>
  );
});
