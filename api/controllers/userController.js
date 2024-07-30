import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUSers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUSer = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const updateUSer = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, profil, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized !" });
  }

  let updatePassword = null;

  try {
    if (password) {
      updatePassword = await bcrypt.hash(password, 10);
    }

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatePassword && { password: updatePassword }),
        ...(profil && { profil }),
      },
    });

    const { password: userPassword, ...rest } = updateUSer;

    res.status(200).json(rest);
    //console.log(updateUSer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update users" });
  }
};

export const deleteUSer = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized !" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete users" });
  }
};

//Save House

export const saveHouse = async (req, res) => {
  const houseId = req.body.houseId;
  const tokenUserId = req.userId;

  try {
    const savedHouse = await prisma.savedHouse.findUnique({
      where: {
        userId_houseId: {
          userId: tokenUserId,
          houseId,
        },
      },
    });

    if (saveHouse) {
      await prisma.savedHouse.delete({
        where: {
          id: savedHouse.id,
        },
      });
      res.status(200).json({ message: "House removed from saved list" });
    } else {
      await prisma.savedHouse.create({
        data: {
          userId: tokenUserId,
          houseId,
        },
      });
      res.status(200).json({ message: "House saved " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete users" });
  }
};
