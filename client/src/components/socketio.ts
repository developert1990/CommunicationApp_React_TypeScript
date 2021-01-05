import { io, Socket } from 'socket.io-client';


const socket: Socket = io("http://localhost:9003");

// 이 함수는 router.tsx 에서는 로그인한 유저가 자신의 room 으로 접속을 한다.(다른 유저가 emit 하는것을 자신의 방에서 받아야 하기 때문에 이렇게 해줌.)
// profileScreen.tsx 에서는 로그인한 유저가 follow를위해서 다른 유저를 클릭했을때 그 클릭한 유저의 룸으로 들어가야 그 유저와 소통을 할 수 있어서 이렇게 구현했다.)
export const newNotificationUsingSocket = (userId: string) => {
    console.log("노티피케이션  소켓 함수 들어옴: ", userId)
    socket.emit("join", userId, (error: Error) => {
        if (error) {
            alert(error);
        }
    })
}
