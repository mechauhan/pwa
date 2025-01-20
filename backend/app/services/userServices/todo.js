let db = require("./../dboperations");
let model = require("./../../Models/todoModel");
const { ObjectId } = require("mongodb");
exports.insert = async (data) => {
  let { title, description, userId,status } = data;
  let todo = await db.saveData(model, { title, description, userId,status });
  return todo;
};

exports.update = async (data) => {
  let { title, description, status, id } = data;
  let todo = await db.findAndUpdate(
    model,
    { _id: new ObjectId(id)  },
    { title, description, status }
  );
  return todo;
};
exports.delete = async (data) => {
  let { id } = data;
  let todo = await db.findAndRemove(model, { _id: new ObjectId(id) });
  return todo;
};

exports.getAll = async (data) => {
  let { userId } = data;
  let todo = await db.getData(model, { userId });
  return todo;
};
