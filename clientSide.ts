import React, { useRef } from 'react';
import { useEffect } from 'react';

function VideoCall() {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const pc = new RTCPeerConnection();

    useEffect(() => {
        // get the local video stream and display it
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                pc.addStream(stream);
            });

        // create an offer and send it to the server
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => {
                fetch('/', {
                    method: 'POST',
                    body: JSON.stringify({ sdp: pc.localDescription.sdp, type: pc.localDescription.type }),
                });
            });

        // handle ICE candidates received from the server
        pc.onicecandidate = event => {
            if (event.candidate) {
                fetch('/on_ice_candidate', {
                    method: 'POST',
                    body: JSON.stringify({ candidate: event.candidate }),
                });
            }
        };

        // handle remote stream
        pc.onaddstream = event => {
            remoteVideoRef.current.srcObject = event.stream;
        };
    }, []);

    return (
        <div>
            <video ref={localVideoRef} autoPlay />
            <video ref={remoteVideoRef} autoPlay />
        </div>
    );
}

export default VideoCall;
