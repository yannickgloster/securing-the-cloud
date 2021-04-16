import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";

import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography, Button, Box } from "@material-ui/core";
import { AccountCircle, CloudCircle, Lock } from "@material-ui/icons/";

import Link from "./Link";

// import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  appBarStyle: {
    width: "100%",
    padding: 5,
    margin: 0,
  },
  buttonStyle: {
    height: 35,
    margin: 10,
    [theme.breakpoints.up("xs")]: {
      width: 100,
      height: 40,
    },
    [theme.breakpoints.up("md")]: {
      width: 130,
      height: 35,
    },
    [theme.breakpoints.up("lg")]: {
      width: 150,
    },
  },
  buttonText: {
    textAlign: "center",
    fontSize: 12,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [session, loading] = useSession();

  return (
    <AppBar position="static" className={classes.appBarStyle}>
      <Toolbar>
        <Box display="flex" flexGrow={1} alignItems="center">
          <Box flexGrow={1}>
            <Lock fontSize="large" color="secondary" />
            <CloudCircle fontSize="large" color="secondary" />
          </Box>

          {session && (
            <Typography variant="h6" component="h6">
              {session.user.name}
            </Typography>
          )}

          <Button
            color="secondary"
            variant="contained"
            className={classes.buttonStyle}
            onClick={() => {
              if (session) signOut();
              else signIn("google");
            }}
          >
            <AccountCircle />
            <Typography
              style={{ paddingLeft: 10 }}
              className={classes.buttonText}
            >
              {session ? "Logout" : "Login"}
            </Typography>
          </Button>
          <Button
            as={Link}
            href="/groups"
            color="secondary"
            variant="contained"
            className={classes.buttonStyle}
          >
            <Typography className={classes.buttonText}>Groups</Typography>
          </Button>
          <Button
            as={Link}
            href="/"
            color="secondary"
            variant="contained"
            className={classes.buttonStyle}
          >
            <Typography className={classes.buttonText}>My Files</Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
