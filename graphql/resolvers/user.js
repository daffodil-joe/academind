const User = require("../../models/user");
const bcyrpt = require("bcryptjs");

module.exports = {
  createUser: async (args) => {
    const existingUser = await User.findOne({
      email: args.userInput.email,
    });
    if (existingUser) {
      throw new Error(
        "There is already an account connected to that email address"
      );
    } else {
      try {
        const hashedPassword = await bcyrpt.hash(args.userInput.password, 12);
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        const result = await user.save();
        return { ...result._doc, password: null };
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
