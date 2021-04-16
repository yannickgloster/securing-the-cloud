export default class Group {
  constructor(name) {
    if (name) {
      this.name = name;
    }
  }
}

export const GroupSchema = {
  name: "Group",
  target: Group,
  columns: {
    id: {
      // This property has `objectId: true` instead of `type: int` in MongoDB
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
  },
};
