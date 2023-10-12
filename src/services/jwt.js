import jwt from 'jsonwebtoken'


// @desc    Sign JWT token
// @file   < Middleware >
// @access  Private
const generateJwt = (data) =>{
    try {
        return new Promise((resolve,reject) => {
            const options = { expiresIn: '1h' },
              payload = {};
            if(data._id){
              payload.userId = data._id;
            } else if (data.email){
              payload.email = data.email;
            }

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