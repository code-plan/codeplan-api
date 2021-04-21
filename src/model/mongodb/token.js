const { mongoose } = require("../../database/mongodb/index");

const TokenSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.ObjectId,
      require: true,
      select: true,
    },
    token: {
      type: String,
      unique: true,
      require: true,
      select: true,
    },
    type: {
      type: String,
      require: true,
      select: false,
      default: "authorization",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "token" }
);
TokenSchema.pre("save", async function (next) {
  next();
});

const token = mongoose.model("token", TokenSchema);

module.exports = token;
