import * as WebSocket from "ws";

const wsServer = new WebSocket.Server({
    noServer: true
})                                     

wsServer.on("connection", function() {   
    //
})
