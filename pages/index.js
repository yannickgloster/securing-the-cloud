import React from "react";

import { signIn, signOut, useSession } from "next-auth/client";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { FilterDramaIcon as CloudIcon } from "@material-ui/icons/FilterDrama";

import PageLayout from "../src/PageLayout";
import Copyright from "../src/Copyright";

export default function Index() {
  const [session, loading] = useSession();

  return (
    <PageLayout>
      <Button color="primary" variant="contained">
        Upload File
      </Button>
    </PageLayout>
  );
}
