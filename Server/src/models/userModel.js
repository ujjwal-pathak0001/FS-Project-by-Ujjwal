import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tenantId: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
