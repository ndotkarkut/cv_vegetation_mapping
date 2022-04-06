# Classes available in yolo 
#names: ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
#         'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
#         'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
#         'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
#         'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
#         'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
#         'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
#         'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
#         'hair drier', 'toothbrush'] 

import torch
import sys
import os
import numpy as np
import pandas as pd
from PIL import Image
import json
from math import sin, cos, asin, acos, atan2, radians, degrees

def inxY(pixel_index, pano_width):
    return int(320/pano_width * pixel_index) - 1

def inxX(pixel_index, pano_height):
    return int(1024/pano_height * pixel_index) - 1

def getHeading(pano_heading, pano_x_mid, x_mid, heading_per_pixel):
    heading = heading_per_pixel * x_mid

    heading = pano_heading - 180 +  heading if pano_x_mid > x_mid  else pano_heading + 180 - heading

    if heading < 0:
        heading = 360 + heading
    elif heading > 360:
        heading = 360 % heading

    return heading

def getCoordinates(orgLat, orgLon, heading, depth):
    R = 6378100
    delta = depth / R
    orgLat = radians(orgLat)
    orgLon = radians(orgLon)
    heading = radians(heading)
    newLat   = asin( sin(orgLat) * cos(delta)  + cos(orgLat) * sin(delta) * cos(heading) )
    newLong  = orgLon + atan2( sin(heading) * sin(delta) * cos(orgLat), cos(delta) -  sin(orgLat) * sin(newLat) )
    #print(degrees(newLat), degrees(newLong))
    return degrees(newLat), degrees(newLong)


absolutePath = str(sys.argv[1])
pano_id = str(sys.argv[2])
pano_latitude = float(sys.argv[3])
pano_longitude = float(sys.argv[4])
pano_heading = float(sys.argv[5])

img = f"{absolutePath}\\data\\{pano_id}\\pano_img.png"

model = torch.hub.load(f"{absolutePath}\\yolov5", "custom", path=f"{absolutePath}\\yolov5\\yolov5x.pt", source="local", force_reload=False, verbose=False)

model.conf = 0.16  # NMS confidence threshold
model.iou = 0.15  # NMS IoU threshold
model.classes = [13]  # (optional list) filter by class, i.e. = [0, 15, 16] for COCO persons, cats and dogs

img = np.asarray(Image.open(img))
height, width, useless = img.shape

width_cutoff = width // 2
s1 = img[:, :width_cutoff]
s2 = img[:, width_cutoff:]

results = model([s1, s2])

results.save(f"{absolutePath}\\data\\{pano_id}\\processed")

s1 = np.asarray(Image.open(f"{absolutePath}\\data\\{pano_id}\\processed\\image0.jpg"))
s2 = np.asarray(Image.open(f"{absolutePath}\\data\\{pano_id}\\processed\\image1.jpg"))

combined_image = np.concatenate((s1, s2),axis=1)
combined_image = Image.fromarray(combined_image)
combined_image.save(f"{absolutePath}\\data\\{pano_id}\\processed\\pano_img.jpg")
combined_image.show()


df = pd.concat([results.pandas().xyxy[0],results.pandas().xyxy[1]], ignore_index=True)
#print(pd)

depthMatrix = np.load(f"{absolutePath}\\data\\{pano_id}\\pano_img_depth.npy")[0][0]

pano = Image.open(f"{absolutePath}\\data\\{pano_id}\\pano_img.png")
pano_np = np.asarray(pano)

pano_y = pano_np.shape[0]
pano_x = pano_np.shape[1]

pano_y_mid = int(pano_np.shape[0] / 2)
pano_x_mid = int(pano_np.shape[1] / 2)

heading_per_pixel = 360/pano_x

# print(pano_np.shape)
# print(depthMatrix.shape)

for index, row in df.iterrows():
    depth = np.average(depthMatrix[inxY(row["ymin"],pano_y):inxY(row["ymax"],pano_y), inxX(row["xmin"],pano_x):inxX(row["xmax"], pano_x)])

    y_mid = int( (row["ymin"] + row["ymax"]) / 2)
    x_mid = int( (row["xmin"] + row["xmax"]) / 2) 

    heading = getHeading(pano_heading, pano_x_mid, x_mid, heading_per_pixel)
    latitude, longitude = getCoordinates(pano_latitude, pano_longitude, depth, heading)
    df.loc[index , "depth"] = depth
    df.loc[index , "heading"] = heading
    df.loc[index , "latitude"] = latitude
    df.loc[index , "longitude"] = longitude

print(df)
coordinatesArray=[]
for index, row in df.iterrows():
    coordinatesArray.append( {"lat":df.loc[index , "latitude"], "lng":df.loc[index , "longitude"]})

print(coordinatesArray)
json_file_path = f"{absolutePath}/data/{pano_id}/processed/object_detection.json"

count_json={}
if not df.empty:
    temp = df["name"].value_counts()
    classes = temp.keys().tolist()
    counts  = temp.tolist()

    for i in range (len(classes)):
        count_json[classes[i]] =  {"count":counts[i],"coordinates":coordinatesArray}

with open(json_file_path, "w") as outfile:
    json.dump(count_json, outfile)

#print(pd.to_json(orient="records"))

