import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

const testFiles = [
  {
    kind: "drive#file",
    id: "1234",
    name: "file1",
    mimeType: "application/pdf",
  },
  {
    kind: "drive#file",
    id: "4321",
    name: "file2",
    mimeType: "application/pdf",
  },
];

export default function Files() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Files">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Encrypted</TableCell>
            <TableCell align="right">Group</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testFiles.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <InsertDriveFileIcon />
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.mimeType}</TableCell>
              <TableCell align="right">No</TableCell>
              <TableCell align="right">None</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
