import torch
import sys

pano_id = str(sys.argv[1])

img = f"C:/Users/groms/Downloads/greenery_mapping/server/data/{pano_id}_pano_img.png"  # or file, Path, PIL, OpenCV, numpy, list

#model = torch.hub.load('ultralytics/yolov5', 'yolov5x')  # or yolov5m, yolov5l, yolov5x, custom
model = torch.hub.load("C:/Users/groms/Downloads/yolov5", "custom", path="C:/Users/groms/Downloads/yolov5/yolov5x.pt", source="local")

# model.conf = 0.25  # NMS confidence threshold
# model.iou = 0.25  # NMS IoU threshold
# model.agnostic = False  # NMS class-agnostic
model.multi_label = False  # NMS multiple labels per box


results = model(img)



results.show()
results.save("C:/Users/groms/Downloads/greenery_mapping/server/data/processed") # or .show(), .save(), .crop(), .pandas(), etc.

print(results.pandas().xyxy[0])
