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

export default function GroupsTable() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const groupsReq = await axios.get("/api/groups/GetAll");
      setGroups(groupsReq.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGroup = async (group) => {
    try {
      console.log(group);
      const groupDel = await axios.delete("/api/groups/Delete", {
        data: group,
      });
      getGroups();
      console.log(groupDel.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Groups">
        <TableHead>
          <TableRow>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Users</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell align="right">{group.name}</TableCell>
              <TableCell align="right">
                {group.users.map((user) => user.email + "\n")}
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton
                  onClick={() =>
                    deleteGroup({
                      id: group.id,
                      folderID: group.folderID,
                    })
                  }
                >
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
