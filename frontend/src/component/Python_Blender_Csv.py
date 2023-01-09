import bpy
import subprocess
import asyncio
import websockets

async def handle_connection(websocket, path):
    async for message in websocket:
        print(f"Received message: {message}")
        await websocket.send(message)

start_server = websockets.serve(handle_connection, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
# Run the React app to read the CSV file
subprocess.run(["npm", "run", "start"])

# Open the CSV file and read the data
with open('data.csv', 'r') as file:
  data = file.read()

# Use the data to perform some operation in Blender
# For example, you can create a new object for each row in the CSV file
for row in data:
  bpy.ops.mesh.primitive_cube_add(location=(row['x'], row['y'], row['z']))
