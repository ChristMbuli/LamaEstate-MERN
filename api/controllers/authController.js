import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { fname, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fname: req.body.fname,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    console.log(newUser);
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user !" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Vérifier si user existe
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    //check password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid)
      return res.status(404).json({ message: "Invalid credentials" });

    //Generer cookie
    //res.setHeader("Set-Cookie", "test=" + "myValue").json("success");

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        //secure: true,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successfully" });
};
