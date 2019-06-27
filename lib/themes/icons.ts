import * as MaterialIcons from '@material-ui/icons';
import SvgIcon from '@material-ui/core/SvgIcon';

type SvgIconComponent = typeof SvgIcon;

const Icons: {
  [s: string]: SvgIconComponent
} = MaterialIcons;

export default Icons;
export * from '@material-ui/icons';
