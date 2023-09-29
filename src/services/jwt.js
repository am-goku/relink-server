import jwt from 'jsonwebtoken'

const generateJwt = (data) =>{
    try {
        return new Promise((resolve,reject) => {
            const options = {expiresIn: '1h'}, payload = {userId: data._id, username: data.username, email: data.email};
            jwt
              .sign(payload, process.env.JWT_KEY_SECRET, options, (err, token)=>{
                  if (err) {
                    reject(err);
                  } else {
                    resolve(token);
                  }
              });
        });
    } catch (error) {
        console.log("Error generating JWT", error);
    }
};


export default generateJwt;