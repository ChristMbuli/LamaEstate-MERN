import prisma from "../lib/prisma.js";

export const getHouses = async (req, res) => {
  const query = req.query;
  console.log(query);

  try {
    const houses = await prisma.house.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 1000000,
        },
      },
    });
    //setTimeout(() => {
    res.status(200).json(houses);
    //}, 3000);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Houses !" });
  }
};

export const getHouse = async (req, res) => {
  const id = req.params.id;
  try {
    const house = await prisma.house.findUnique({
      where: { id },
      //Afficher les details et les infos de users
      include: {
        houseDetail: true,
        User: {
          //Récuperer uniquement le fname et profile
          select: {
            fname: true,
            profil: true,
          },
        },
      },
    });

    let userId;
    const token = req.cookie.token;

    res.status(200).json(house);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get House !" });
  }
};

export const addHouse = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newHouse = await prisma.house.create({
      data: {
        //...body;
        ...body.houseData,
        userId: tokenUserId,
        houseDetail: {
          create: body.houseDetail,
        },
      },
    });
    res.status(200).json(newHouse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Houses !" });
  }
};

export const updateHouse = async (req, res) => {
  try {
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Houses !" });
  }
};

export const deleteHouse = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const house = await prisma.house.findUnique({
      where: { id },
    });

    if (house.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    await prisma.house.delete({
      where: { id },
    });

    res.status(200).json({ message: "House deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to deleted Houses !" });
  }
};
