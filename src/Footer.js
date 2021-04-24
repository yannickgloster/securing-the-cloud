import React from "react";

import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";

export default function Footer() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Built By "}
      <MuiLink
        color="initial"
        href="https://yannickgloster.com/"
        target="_blank"
      >
        Yannick Gloster
      </MuiLink>{" "}
      {"for the "}
      <MuiLink
        color="initial"
        href="https://teaching.scss.tcd.ie/module/csu34031-advanced-telecommunications/"
        target="_blank"
      >
        CSU34031 Advanced Telecommunications
      </MuiLink>{" "}
      {"module at Trinity College Dublin."}
    </Typography>
  );
}
