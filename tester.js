import jwt from "jsonwebtoken";


const data = {
  userId: "65153f2737de4c657ee57072",
  username: "goku",
  email: "goku@mail.com"
};

const secret = "abc123";

const options = {
    expiresIn: "1d"
}


const generateJwt= async (key, dat, op) => {

    return new Promise ((resolve, reject) => {
        jwt.sign(dat, key, op, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })

    

}

generateJwt(secret, data, options).then((token) => {
    console.log(token);
})