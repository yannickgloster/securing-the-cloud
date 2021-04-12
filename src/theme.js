import { createMuiTheme } from "@material-ui/core/styles";
import {
  orange,
  blueGrey,
  deepOrange,
  green,
  lightBlue,
  yellow,
} from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue[100],
    },
    secondary: {
      main: orange[100],
    },
    error: {
      main: deepOrange.A100,
    },
    warning: {
      main: yellow.A100,
    },
    info: {
      main: blueGrey[50],
    },
    success: {
      main: green.A100,
    },
    background: {
      default: "#FFFFFF",
    },
  },
});

export default theme;
