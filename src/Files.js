import React, { useEffect, useState } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import DeleteIcon from "@material-ui/icons/Delete";

export default function Files(props) {
  const [files, setFiles] = useState([]);
  const groupID = props.groupID;

  useEffect(() => {
    getFiles();
    const interval = setInterval(getFiles, 1000);
    return () => clearInterval(interval);
  }, []);

  const getFiles = async () => {
    try {
      const path = "/api/GetFiles/" + groupID;
      console.log(path);
      const filesReq = await axios.get(path);
      setFiles(filesReq.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async (id) => {
    try {
      const filesReq = await axios.delete("/api/DeleteFile", {
        data: { id: id },
      });
    } catch (error) {
      console.log(error);
    }
  };

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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell component="th" scope="row">
                <InsertDriveFileIcon />
              </TableCell>
              <TableCell align="right">{file.name}</TableCell>
              <TableCell align="right">{file.mimeType}</TableCell>
              <TableCell align="right">No</TableCell>
              <TableCell align="right">None</TableCell>
              <TableCell component="th" scope="row" padding="checkbox">
                <IconButton onClick={() => deleteFile(file.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
