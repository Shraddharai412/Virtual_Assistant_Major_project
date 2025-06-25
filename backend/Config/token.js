const jwt = require("jsonwebtoken");

const gentoken = async (UserID) => {
  try {
    const token = await jwt.sign({ userId: UserID }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = gentoken;
