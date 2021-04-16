export default class GroupUser {
  constructor(groupID, userID) {
    if (groupID) {
      this.groupID = groupID;
    }
    if (userID) {
      this.userID = userID;
    }
  }
}

export const GroupUserSchema = {
  name: "GroupUser",
  target: GroupUser,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    groupID: {
      type: "int",
      unique: true,
    },
    userID: {
      type: "int",
      unique: true,
    },
  },
};
