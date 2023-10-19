



const socketIo_Config = (io) => {

    try {
        
        io.on("connect", (socket)=> {
            //establishing connection
            console.log('User has been connected.');




            socket.on("joinPrivateRoom", (recieverId)=> {

                //uique room identifier
                const privateRoom = `Private_${socket.id}_${recieverId}`;

                //joining the private room
                socket.join(privateRoom)


                //listening from sender
                socket.on("sendMessage", (message)=> {

                    //broadcasting message
                    io.to(privateRoom).emit("newPrivateMessage", message);
                })

            })


            




            //disconnecting user
            socket.on("disconnect", ()=>{
                console.log('User disconnected.');
            })
        })


    } catch (error) {
        
    }



};

export default socketIo_Config;