const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const toDoListSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      required: true,
      default: "OPEN",
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true }
)

toDoListSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("ToDoList", toDoListSchema)
