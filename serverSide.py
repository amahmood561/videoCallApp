import asyncio
from aiohttp import web
from aiortc import RTCPeerConnection, RTCSessionDescription

async def index(request):
    pc = RTCPeerConnection()
    # generate an offer
    offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    # send the offer to the client
    return web.json_response({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type})

async def on_ice_candidate(request):
    # handle ICE candidates sent from the client
    candidate = request.json()
    pc.addIceCandidate(candidate)

app = web.Application()
app.router.add_get("/", index)
app.router.add_post("/on_ice_candidate", on_ice_candidate)

web.run_app(app)
