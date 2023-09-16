const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const username = req.body.name;
    const tokenWithBearer = req.headers["authorization"];
    const token = tokenWithBearer.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
      if (error) {
        return res
          .status(200)
          .send({ message: "Auth failed!", success: false });
      } else {
        //console.log('helloooooooo',response);
        req.body.userId = response.id;
        // console.log('User id',req.body.userId );
        next();
      }
    });
  } catch (error) {
    console.log("error is ", error);
  }
};
