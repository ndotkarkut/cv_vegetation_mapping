import numpy as np
import sys
import subprocess
from PIL import Image
import numpy as np

absolutePath = str(sys.argv[1])
pano_id = str(sys.argv[2])

model_name = "mono_1024x320"

depthOutput = subprocess.run(["python", f"{absolutePath}\\monodepth2\\test_simple.py", 
                                        "--image_path", f"{absolutePath}\\data\\{pano_id}\\pano_img.png", 
                                        "--model_name", f"{model_name}",
                                        "--pred_metric_depth"], shell= True, capture_output = True, text = True)
#print(depthOutput.stdout)
print(depthOutput.stderr)

pano = np.asarray(Image.open(f"{absolutePath}\\data\\{pano_id}\\pano_img.png"))
pano_x = pano.shape[1]

depthMatrix = np.load(f"{absolutePath}/data/{pano_id}/pano_img_depth.npy")[0][0]
y = depthMatrix.shape[0] #320
x = depthMatrix.shape[1] #1024

depthMatrix = depthMatrix[int(0.2*y):int(0.7*y), :]

depthArray=np.average(depthMatrix, axis = 0)

depthArrayImage=np.zeros(pano_x)

for i in range(pano_x): 
    depthArrayImage[i] = depthArray[int(x/pano_x * i)-1]

np.savetxt(f"{absolutePath}/data/{pano_id}/depth_data.txt", depthArrayImage, fmt='%f')