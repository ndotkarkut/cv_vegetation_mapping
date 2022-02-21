import torch
import sys

absolutePath = str(sys.argv[1])
pano_id = str(sys.argv[2])

img = f"{absolutePath}\\data\\{pano_id}\\pano_img.png"

model = torch.hub.load(f"{absolutePath}\\yolov5", "custom", path=f"{absolutePath}\\yolov5\\yolov5x.pt", source="local")

results = model(img)

results.show()
results.save(f"{absolutePath}\\data\\{pano_id}\\processed")

print(results.pandas().xyxy[0].to_json(orient="records"))

