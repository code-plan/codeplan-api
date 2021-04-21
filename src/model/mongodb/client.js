const { mongoose } = require("../../database/mongodb/index");
const crypto = require("crypto");

const ClientSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      require: true,
      select: true,
    },
    secret: {
      type: String,
      unique: true,
      require: true,
      select: true,
    },
    confirmed: {
      type: Boolean,
      require: true,
      select: true,
      default: false,
    },
    ip_address: {
      type: String,
      require: true,
      select: true,
    },
    enabled: {
      type: Boolean,
      require: true,
      select: true,
      default: true,
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
  { collection: "client" }
);
ClientSchema.pre("save", async function (next) {
  const hash = await crypto.randomBytes(255).toString("hex");
  this.secret = hash;
  next();
});

const client = mongoose.model("client", ClientSchema);

module.exports = client;
