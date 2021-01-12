const { Task, User } = require("../models");

class TaskController {
  static postTask(req, res) {
    const newTask = {
      title: req.body.title,
      category: req.body.category,
    };

    Task.create(newTask)
      .then((tasks) => {
        res.status(201).json(tasks);
      })
      .catch((err) => {
        if (err.errors[0].validatorName === "notEmpty") {
          res.status(400).json({ message: err.message });
        } else {
          res
            .status(500)
            .json({ message: "Internal Server Error", error: err.message });
        }
      });
  }

  static getTask(req, res) {
    Task.findAll({
      include: User,
    })
      .then((tasks) => {
        res.status(200).json(tasks);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      });
  }

  static getTaskById(req, res) {
    const taskId = +req.params.id;

    Task.findByPk(taskId, {
      include: User,
    })
      .then((tasks) => {
        tasks
          ? res.status(200).json(tasks)
          : res.status(404).json({ message: "Task Not Found" });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      });
  }

  static putTaskById(req, res) {
    const taskId = +req.params.id;

    const updateTask = {
      title: req.body.title,
      category: req.body.category,
    };

    Task.update(updateTask, {
      where: {
        id: taskId,
      },
      returning: true,
    })
      .then((tasks) => {
        tasks[0] === 0
          ? res.status(404).json({ message: "Tasks not found" })
          : res.status(200).json(tasks);
      })
      .catch((err) => {
        if (err.errors[0].validatorName === "notEmpty") {
          res.status(400).json({ message: err.message });
        } else {
          res
            .status(500)
            .json({ message: "Internal Server Error", error: err.message });
        }
      });
  }

  static patchTaskById(req, res) {
    const taskId = +req.params.id;

    const updateTask = {
      category: req.body.category,
    };

    Task.update(updateTask, {
      where: {
        id: taskId,
      },
      returning: true,
    })
      .then((tasks) => {
        tasks[0] === 0
          ? res.status(404).json({ message: "Task not found" })
          : res.status(200).json(tasks);
      })
      .catch((err) => {
        if (err.errors[0].validatorName === "notEmpty") {
          res.status(400).json({ message: err.message });
        } else {
          res
            .status(500)
            .json({ message: "Internal Server Error", error: err.message });
        }
      });
  }

  static deleteTaskById(req, res) {
    const taskId = +req.params.id;

    Task.destroy({
      where: { id: taskId },
    })
      .then((tasks) => {
        tasks === 1
          ? res.status(200).json({ message: "Task has been deleted" })
          : res.status(404).json({ message: "Task not found" });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      });
  }
}

module.exports = TaskController;