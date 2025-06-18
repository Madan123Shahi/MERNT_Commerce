import mongoose, { Model, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const passRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// interface for user document
export interface IUSER extends Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUSER> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Valid Email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      validate: function (v: string) {
        return validator.isMobilePhone(v, "any", { strictMode: true });
      },
      message: "Please Provide a valid phone number",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [
        8,
        "Minimum Length for the password should be at least 8 character Long",
      ],
      validate: function (v: string) {
        passRegExp.test(v);
      },
      message:
        "Password must contain atleast one uppercase, one lowercase, one digit and one special character",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre<IUSER>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUSER> = mongoose.model<IUSER>("User", userSchema);
export default User;
