import bpy
import subprocess

# Run the React app to read the CSV file
subprocess.run(["npm", "run", "start"])

# Open the CSV file and read the data
with open('data.csv', 'r') as file:
  data = file.read()

# Use the data to perform some operation in Blender
# For example, you can create a new object for each row in the CSV file
for row in data:
  bpy.ops.mesh.primitive_cube_add(location=(row['x'], row['y'], row['z']))
