const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["CLIENT", "ADMIN"] },
    userName: { type: String, trim: true },
    password: { type: String, select: false },
    accessToken: [{ type: String, select: false }],
  },
  { timestamps: true }
)

userSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("User", userSchema)
