import numpy as np
import sys
import subprocess

absolutePath = str(sys.argv[1])
pano_id = str(sys.argv[2])

model_name = "mono_1024x320"

depthOutput = subprocess.run(["python", f"{absolutePath}\\monodepth2\\test_simple.py", 
                                        "--image_path", f"{absolutePath}\\data\\{pano_id}\\pano_img.png", 
                                        "--model_name", f"{model_name}",
                                        "--pred_metric_depth"], shell= True, capture_output = True, text = True)
print(depthOutput.stdout)
print(depthOutput.stderr)

depthMatrix = np.load(f"{absolutePath}\\data\\{pano_id}\\pano_img_depth.npy")

maxDepth = np.amax(depthMatrix)
print (maxDepth)
print(np.average(depthMatrix))
