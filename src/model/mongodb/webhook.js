const { mongoose } = require("../../database/mongodb/index");

const WebhookSchema = new mongoose.Schema(
  {
    receiver: {
      type: String,
      require: true,
      select: true,
    },
    title: {
      type: String,
      select: true,
    },
    content: {
      type: String,
      require: true,
      select: true,
    },
    type: {
      type: String,
      require: true,
      select: true,
    },
    reason: {
      type: String,
      require: true,
      select: true,
      default: "deploy",
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
  { collection: "webhook" }
);
WebhookSchema.pre("save", async function (next) {
  next();
});

const webhook = mongoose.model("webhook", WebhookSchema);

module.exports = webhook;
