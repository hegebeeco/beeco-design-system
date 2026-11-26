# Realistic 3D phone mockup: the app screenshot (with its flat frame) becomes the glass front of an
# extruded, bevelled phone body; soft studio light, transparent background, soft contact shadow.
# Usage: blender -b -P render_phone.py -- <screen.png> <out.png> [yaw_deg] [pitch_deg] [res_x] [res_y]
import bpy, sys, math, bmesh
argv = sys.argv[sys.argv.index('--') + 1:]
src, out = argv[0], argv[1]
yaw = float(argv[2]) if len(argv) > 2 else -22.0
pitch = float(argv[3]) if len(argv) > 3 else 6.0
rx = int(argv[4]) if len(argv) > 4 else 640
ry = int(argv[5]) if len(argv) > 5 else 1100

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.samples = 64
sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_x, sc.render.resolution_y = rx, ry
sc.render.image_settings.file_format = 'PNG'
sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'Standard'

img = bpy.data.images.load(src)
W, H = img.size
h = 1.0
w = h * W / H
depth = 0.045
r = 0.075 * h  # corner radius

# rounded-rectangle outline
def rounded_rect(bm, w, h, r, z, seg=16):
    vs = []
    cs = [(w/2 - r, h/2 - r, 0), (-w/2 + r, h/2 - r, 90), (-w/2 + r, -h/2 + r, 180), (w/2 - r, -h/2 + r, 270)]
    for cx, cy, a0 in cs:
        for i in range(seg + 1):
            a = math.radians(a0 + 90 * i / seg)
            vs.append(bm.verts.new((cx + r * math.cos(a), cy + r * math.sin(a), z)))
    return vs

# body: extruded rounded rectangle with bevelled edges (dark titanium)
bm = bmesh.new()
top = rounded_rect(bm, w, h, r, depth / 2)
fb = bm.faces.new(top)
ext = bmesh.ops.extrude_face_region(bm, geom=[fb])
for v in [e for e in ext['geom'] if isinstance(e, bmesh.types.BMVert)]:
    v.co.z -= depth
me = bpy.data.meshes.new('body'); bm.to_mesh(me); bm.free()
body = bpy.data.objects.new('body', me); sc.collection.objects.link(body)
bev = body.modifiers.new('bev', 'BEVEL'); bev.width = 0.012; bev.segments = 6; bev.limit_method = 'ANGLE'
bpy.context.view_layer.objects.active = body
for p in body.data.polygons: p.use_smooth = True
mb = bpy.data.materials.new('metal'); mb.use_nodes = True
bsdf = mb.node_tree.nodes['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (0.11, 0.115, 0.12, 1)
bsdf.inputs['Metallic'].default_value = 0.85
bsdf.inputs['Roughness'].default_value = 0.32
body.data.materials.append(mb)

# screen: the screenshot as a slightly raised glass plane on the front
bm = bmesh.new()
fs = bm.faces.new(rounded_rect(bm, w * 0.995, h * 0.995, r * 0.98, depth / 2 + 0.0015))
uv = bm.loops.layers.uv.new()
for l in fs.loops:
    l[uv].uv = (l.vert.co.x / w + 0.5, l.vert.co.y / h + 0.5)
me = bpy.data.meshes.new('screen'); bm.to_mesh(me); bm.free()
scr = bpy.data.objects.new('screen', me); sc.collection.objects.link(scr)
ms = bpy.data.materials.new('screen'); ms.use_nodes = True
nt = ms.node_tree; nodes = nt.nodes
nodes.remove(nodes['Principled BSDF'])
tex = nodes.new('ShaderNodeTexImage'); tex.image = img; tex.interpolation = 'Cubic'
em = nodes.new('ShaderNodeEmission'); em.inputs['Strength'].default_value = 1.0
nt.links.new(tex.outputs['Color'], em.inputs['Color'])
gl = nodes.new('ShaderNodeBsdfGlossy'); gl.inputs['Roughness'].default_value = 0.06
fr = nodes.new('ShaderNodeFresnel'); fr.inputs['IOR'].default_value = 1.5
glass = nodes.new('ShaderNodeMixShader')
nt.links.new(fr.outputs['Fac'], glass.inputs['Fac'])
nt.links.new(em.outputs['Emission'], glass.inputs[1])
nt.links.new(gl.outputs['BSDF'], glass.inputs[2])
pb = glass
# transparent pixels of the screenshot (its outer corners) show the body
mix = nodes.new('ShaderNodeMixShader'); trans = nodes.new('ShaderNodeBsdfTransparent')
outn = nodes['Material Output']
nt.links.new(tex.outputs['Alpha'], mix.inputs['Fac'])
nt.links.new(trans.outputs['BSDF'], mix.inputs[1])
nt.links.new(pb.outputs['Shader'], mix.inputs[2])
nt.links.new(mix.outputs['Shader'], outn.inputs['Surface'])
scr.data.materials.append(ms)

# side buttons
for (x, y, l) in [(-w/2, 0.22, 0.09), (-w/2, 0.10, 0.09), (w/2, 0.16, 0.15)]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x + (0.004 if x > 0 else -0.004), y, 0))
    b = bpy.context.active_object; b.scale = (0.012, l, depth * 0.45); b.data.materials.append(mb)
    bv = b.modifiers.new('bv', 'BEVEL'); bv.width = 0.004; bv.segments = 3

# group and pose: stand the phone up, turn it a little
root = bpy.data.objects.new('root', None); sc.collection.objects.link(root)
for o in list(sc.objects):
    if o is not root and o.parent is None and o.type == 'MESH':
        o.parent = root
root.rotation_euler = (math.radians(90 - pitch), 0, math.radians(yaw))
root.location = (0, 0, h / 2 + 0.02)

# shadow catcher floor
# no floor: the page adds a soft CSS shadow

# light: big soft key, rim, fill
def area(name, loc, rot, size, power):
    L = bpy.data.lights.new(name, 'AREA'); L.size = size; L.energy = power
    o = bpy.data.objects.new(name, L); o.location = loc; o.rotation_euler = [math.radians(a) for a in rot]
    sc.collection.objects.link(o)
area('key', (-1.4, -2.4, 2.6), (50, 0, -30), 3.0, 110)
area('rim', (1.6, 1.0, 1.4), (65, 0, 125), 1.0, 60)
area('fill', (1.8, -2.4, 0.9), (80, 0, 35), 2.0, 25)
world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.25

# camera: slightly above, framing the phone
cam_d = bpy.data.cameras.new('cam'); cam_d.lens = 85; cam_d.sensor_fit = 'VERTICAL'; cam_d.sensor_height = 36
cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
dist = 3.35
cz = h / 2 + 0.02
cam.location = (0, -dist * math.cos(math.radians(5)), cz + dist * math.sin(math.radians(5)))
cam.rotation_euler = (math.radians(85), 0, 0)
cam_d.shift_y = 0.0
bpy.ops.object.select_all(action='DESELECT')
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print('OK', out)
