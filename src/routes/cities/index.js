const express = require("express");
const cityRouter = express.Router();
const CityModel = require("./citySchema");
const UserModel = require("../users/userSchema");
const auth = require("../middleware/auth");
const fetch = require("node-fetch");
const request = require("request");
const userRouter = require("../users");

const api_Key = " b48efb4041a0c6f319274152e5311a78";
const city = "stockholm";
const url = `api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_Key}`;

cityRouter.get("/weather/:city", (req, res, next) => {
  try {
    fetch(url, (error, response, body) => {
      if (error) {
        res.send(error);
      }
      if (response.httpStatusCode !== 200) {
        return res
          .status(404)
          .json({ msg: "No weather info for this city found" });
      } else {
        res.json(JSON.parse(body));
      }
    });
  } catch (error) {
    next(error);
  }
});

// cityRouter.get("/weather/:city", (req, res, next) => {

//     fetch(url, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' }
//     }, (error,response,body)=>{
//         if(error){
//             res.send(error)
//         }
//         if (response.httpStatusCode !== 200) {
//                      return res
//                      .status(404)
//                       .json({ msg: "No weather info for this city found" });
//                   }else{
//                      res.send(JSON.parse(body));
//                    }
//     })

// })
// Adds a city to the users list

cityRouter.post("/list", auth, async (req, res, next) => {
  const newCity = await new CityModel({
    city: req.body.name,
    user: req.user.id,
  });

  newCity.save();
  res.send(newCity);
});

// get all cities
cityRouter.get("/list", async (req, res, next) => {
  try {
    const cities = await CityModel.find(req.query);
    res.status(200).send(cities);
  } catch (error) {
    next(error);
  }
});

// get cities for a specific user
cityRouter.get("/list/:userId", auth, async (req, res, next) => {
  try {
    const city = await CityModel.find({ user: req.user.id });
    if (city) {
      res.status(200).send(city);
    } else {
      const error = new Error("list of user cities not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

// Remove a city from the user's list

cityRouter.delete("/list/:id", auth, async (req, res, next) => {
  try {
    const city = await CityModel.findByIdAndDelete(req.user.id);
    if (city) {
      res.status(200).send("deleted");
    } else {
      const error = new Error("city not deleted");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = cityRouter;
