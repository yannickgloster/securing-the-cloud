import React from "react";

import { signIn, signOut, useSession } from "next-auth/client";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import Copyright from "../src/Copyright";

export default function Index() {
  const [session, loading] = useSession();

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Securing the Cloud
        </Typography>
        {!session && (
          <>
            <Typography variant="subtitle1" component="h5" gutterBottom>
              Not signed in!
            </Typography>
            <Button onClick={() => signIn()}>Sign in</Button>
          </>
        )}
        {session && (
          <>
            <Typography variant="subtitle1" component="h5" gutterBottom>
              Signed in as {session.user.email}
            </Typography>
            <Button onClick={() => signOut()}>Sign out</Button>
          </>
        )}
        <Copyright />
      </Box>
    </Container>
  );
}
