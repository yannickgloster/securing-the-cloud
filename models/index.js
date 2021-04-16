// To make importing them easier, you can export all models from single file
import User, { UserSchema } from "./User";
import Group, { GroupSchema } from "./Group";
import GroupUser, { GroupUserSchema } from "./GroupUser";

export default {
  //   User: {
  //     model: User,
  //     schema: UserSchema,
  //   },
  Group: {
    model: Group,
    schema: GroupSchema,
  },
  GroupUser: {
    model: GroupUser,
    schema: GroupUserSchema,
  },
};
