import torch
import sys
import os
import numpy as np
import pandas as pd
from PIL import Image

absolutePath = str(sys.argv[1])
pano_id = str(sys.argv[2])

img = f"{absolutePath}\\data\\{pano_id}\\pano_img.png"

model = torch.hub.load(f"{absolutePath}\\yolov5", "custom", path=f"{absolutePath}\\yolov5\\yolov5x.pt", source="local")

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


pd = pd.concat([results.pandas().xyxy[0],results.pandas().xyxy[1]],ignore_index=True)
print(pd.to_json(orient="records"))

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

