const tasks = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    let email = req.headers["email"];
    let taskData = req.body;
    taskData.email = email;
    await tasks.create(taskData);
    res
      .status(201)
      .json({ status: "Success", message: "Created data successfully" });
  } catch (error) {
    res.status(401).json({ status: "fail", message: error });
  }
};
exports.readTask = async (req, res) => {
  try {
    let email = req.headers["email"];
    let data = await tasks.aggregate([
      {
        $match: { email: email },
      },
      {
        $project: {
          _id: 0,
          createdAt: 0,
          updatedAt: 0
        },
      },
    ]);
    res.json({ status: "Success", Task_data: data });
  } catch (error) {
    res.json({ status: "Fail", data: error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let taskData = req.body;
    let email = req.headers["email"];
    let { id } = req.params;
    let task = await tasks.find({
      _id: id,
      email: email,
    });
    if (task.length > 0) {
      await tasks.updateOne({ _id: id }, { $set: taskData });
      res.json({ status: "Success", message: "Data successfully updated" });
    } else {
      res.json({ status: "Fail", message: "No task found" });
    }
  } catch (error) {
    res.json({ status: "Fail", message: error });
  }
};
exports.updateTaskStatus = async (req, res) => {
  try {
    let email = req.headers["email"];
    let { id } = req.params;
    let taskStatus = req.body["taskStatus"];
    let task = await tasks.find({
      _id: id,
      email: email,
    });
    if (task.length > 0) {
      await tasks.updateOne({ _id: id }, { $set: { taskStatus: taskStatus } });
      res.json({ status: "Success", message: "Data successfully updated" });
    } else {
      res.json({ status: "Fail", message: "No task found" });
    }
  } catch (error) {
    res.json({ status: "Fail", message: error });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    let email = req.headers["email"];
    let { id } = req.params;
    let task = await tasks.find({
      _id: id,
      email: email,
    });
    if (task.length > 0) {
      await tasks.deleteOne({ _id: id });
      res.json({ status: "Success", message: "Data successfully deleted" });
    } else {
      res.json({ status: "Fail", message: "No task found" });
    }
  } catch (error) {
    res.json({ status: "Fail", message: error });
  }
};
exports.selectTaskByStatus = async (req, res) => {
  try {
    let email = req.headers["email"];
    let taskStatus = req.body["taskStatus"];
    let data = await tasks.find({ email: email, taskStatus: taskStatus });
    if (data.length > 0) {
      res.json({ status: "success", data: data });
    } else {
      res.json({ status: "Fail", message: "No task found" });
    }
  } catch (err) {
    res.json({ status: "fail", message: err });
  }
};
exports.selectTaskByDate = async (req, res) => {
  try {
    let email = req.headers["email"];
    let fromDate = req.body["fromDate"];
    let toDate = req.body["toDate"];
    let data = await tasks.find({
      email: email,
      createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
    });
    res.json({ status: "success", data: data });
  } catch (err) {
    res.json({ status: "fail", message: err });
  }
};
