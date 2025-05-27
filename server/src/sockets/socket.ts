import { disconnect } from "process";

let users = [] as any[];
const addUsers = (userId, socketId) => {
    if(userId){
        const user = users.find((user) => user?.userId===userId);
        if(user){
            user.socketId = socketId;
        } else {
            users.push({userId, socketId});
        }
    }
}


const removeUser = (socketId:any) => {
    users = users?.filter((user) => user?.socketId !== socketId);
}


const userLogout = (userId) => {
    users = users?.filter((u) =>u.userId !== userId )
}


export const appMessages = (socket:any, socketIo:any) => {
//    add users
    socket.on("addUser", (user:any) => {
        addUsers(user?.id, socket?.id)
    });
    socketIo.emit("getUsers", users);
    socketIo.emit("activeUsers", users);


    socket.on("logout", (userId) => {
        userLogout(userId)
    })



    socket.on("disconnect", () => {
        setTimeout(() => {
            if(!socket.connected){
                removeUser(socket.id)
                socketIo.emit("getUsers", users);
                socket.broadcast.emit("activeUsers", users);
            }
        },
          5000);
    });


}