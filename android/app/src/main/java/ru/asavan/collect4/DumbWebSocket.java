package ru.asavan.collect4;

import static ru.asavan.collect4.AndroidWebServerActivity.MAIN_LOG_TAG;

import android.util.Log;

import java.io.IOException;

import fi.iki.elonen.NanoHTTPD.IHTTPSession;
import fi.iki.elonen.NanoWSD.WebSocket;
import fi.iki.elonen.NanoWSD.WebSocketFrame;


class DumbWebSocket extends WebSocket {

    private final IWebSocketServer server;

    public DumbWebSocket(IHTTPSession handshakeRequest, IWebSocketServer server) {
        super(handshakeRequest);
        this.server = server;
    }

    @Override
    protected void onOpen() {
        Log.i(MAIN_LOG_TAG, "socket open");
        server.addUser(this);
    }

    @Override
    protected void onClose(WebSocketFrame.CloseCode code, String reason, boolean initiatedByRemote) {
        server.removeUser(this);
    }

    @Override
    protected void onMessage(WebSocketFrame message) {
        Log.i(MAIN_LOG_TAG, "broadcast");
        server.broadcast(this, message);
    }

    @Override
    protected void onPong(WebSocketFrame pong) {
        Log.i(MAIN_LOG_TAG, "pong");
    }

    @Override
    protected void onException(IOException exception) {
        server.removeUser(this);
    }
}
