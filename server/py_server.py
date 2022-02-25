import cv2
import numpy as np
import matplotlib.pyplot as plt
import subprocess
from PIL import Image
import svgwrite 
import requests
import streetview
from skimage import io
import os 
import sys
import torch
import pandas as pd

# arguments
pano_latitude = float(sys.argv[1])
pano_longitude = float(sys.argv[2])
pano_heading = float(sys.argv[3])
pano_id = sys.argv[4]
zoom = int(sys.argv[5])
print(pano_heading, pano_latitude, pano_longitude, pano_id, zoom)

def fig2img(fig):
    """Convert a Matplotlib figure to a PIL Image and return it"""
    import io
    buf = io.BytesIO()
    fig.savefig(buf)
    buf.seek(0)
    img = Image.open(buf)
    return img

def objectDetection (pano_img, pano_id):

    absolutePath=os.getcwd()

    yoloOutput = subprocess.run(f"python {absolutePath}\\yolov5\\main.py {absolutePath} {pano_id} ", shell= True, capture_output = True, text = True)
    #print(yoloOutput.stdout)
    print(yoloOutput.stderr)

    print(pd.read_json(yoloOutput.stdout))

if __name__ == '__main__':

    panoids = streetview.panoids(lat=pano_latitude, lon=-pano_longitude)

    # panoid = panoids[0]['panoid']
    panoid = pano_id
    panorama = streetview.download_panorama_v3(panoid, zoom=zoom, disp=True)
    pano_img = Image.fromarray(panorama)
    if ~os.path.isdir(f"./data/{pano_id}"): os.mkdir(f"./data/{pano_id}")

    pano_img.save(f'./data/{pano_id}/pano_img.png')

    objectDetection(pano_img,pano_id)
  
    # print(panorama)

    # plt.imshow(pano_img)

    print(panorama.shape)

    # resize image 
    scale_percent = 100 # percent of original size
    width = int(panorama.shape[1] * scale_percent / 100)
    height = int(panorama.shape[0] * scale_percent / 100)
    dim = (width, height)

    img = cv2.resize(panorama, dim, interpolation=cv2.INTER_AREA)

    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    green_min = np.asarray([35, 0, 0])   
    green_max = np.asarray([105, 255, 255])   
    gray_min = np.asarray([0, 0, 100])   
    gray_max = np.asarray([180, 100, 230])   
    blue_min = np.asarray([0, 0, 0])   
    blue_max = np.asarray([50, 100, 255])  
    # sky_min = np.asarray([0, 0, 0])   
    # sky_max = np.asarray([255, 100, 255])  
     

    mask = cv2.inRange(img_hsv, green_min, green_max)
    # sky_mask = cv2.inRange(img_hsv, sky_min, sky_max)
    gray_mask = cv2.inRange(img_hsv, gray_min, gray_max)
    blue_mask = cv2.inRange(img_hsv, blue_min, blue_max)

    # slice the green
    imask = mask > 0
    img_w_green = np.zeros_like(img, np.uint8)
    img_w_green[imask] = img[imask]
    # slice the gray
    jmask = gray_mask > 0
    jmask[0:int(jmask.shape[0] / 2)] = False
    img_w_gray = np.zeros_like(img, np.uint8)
    img_w_gray[jmask] = img[jmask]
    # slice the blue and gray
    # kmask = sky_mask > 0
    lmask = blue_mask > 0
    lmask[int(jmask.shape[0] / 2) : jmask.shape[0]] = False
    print('lmask', lmask, lmask.shape, lmask[0:int(lmask.shape[0] / 2)].shape)

    img_copy = img.copy()
    # make image that highlights the skyblue in RGB
    # img_copy[kmask] = [75, 255, 75]
    img_copy[lmask] = [165, 203, 246]
    # make image that highlights the gray in RGB
    img_copy[jmask] = [175, 175, 175]
    # make image that highlights the green in RGB
    img_copy[imask] = [75, 255, 75]

    sky_pixels = 0
    green_pixels = 0
    street_pixels = 0
    # Get percentage of each mask in the image 
    for x in range(img_copy.shape[0]):
        for y in range(img_copy.shape[1]):
            if np.array_equal(np.array([175,175,175]), np.array(img_copy[x][y])):
                street_pixels += 1
            elif np.array_equal(np.array([165,203,246]), np.array(img_copy[x][y])):
                sky_pixels += 1
            elif np.array_equal(np.array([75,255,75]), np.array(img_copy[x][y])):
                green_pixels += 1
        

    total_pixels = img_copy.shape[0] * img_copy.shape[1]
    print('total pixels:', total_pixels)
    print('sky', sky_pixels)
    print('green', green_pixels)
    print('street', street_pixels)
    sky_px_percent = sky_pixels / total_pixels
    green_px_percent = green_pixels / total_pixels
    street_px_percent = street_pixels / total_pixels
    print('percentages', sky_px_percent, green_px_percent, street_px_percent)
    print(sky_px_percent + green_px_percent + street_px_percent)

    # and save it
    pano_img = Image.fromarray(img_copy)
    pano_img.save(f'./data/{pano_id}/pano_img_intensity.png')

    x_axis = np.arange(start=0, stop=mask.shape[1], step=1)
    theta_axis = np.linspace(0, 2 * np.pi, mask.shape[1])

    # polar axis shifted by 90deg to have middle of image in front 
    theta_axis_shifted = np.roll(theta_axis, int(mask.shape[1] * 3 / 4) )
    # theta_axis_shifted = theta_axis

    green_pixels_by_x = []

    for y in range(mask.shape[1]):
        num_green_pixels = 0
        for x in range(mask.shape[0]):
            if mask[x][y] > 0:
                num_green_pixels += 1
        green_pixels_by_x.append(num_green_pixels)


    fig1 = plt.figure(0)
    plt.subplot(221)
    plt.title('Original 360deg Image')
    plt.imshow(img)
    plt.subplot(222)
    plt.title('360deg Image with green color mask')
    plt.imshow(mask, cmap='gray')   # this colormap will display in black / white
    plt.subplot(223, projection='polar')
    plt.title('Polar green pixel frequency graph')
    plt.plot(theta_axis_shifted, green_pixels_by_x)
    plt.subplot(224)
    plt.title('Horizontal green pixel frequency graph')
    plt.plot(x_axis, green_pixels_by_x)

    # print(theta_axis_shifted)
    # print(green_pixels_by_x)

    with open(f'./data/{pano_id}/values_x.txt', 'w') as f:
        for el in theta_axis_shifted:
            f.write(str(el) + '\n')
    with open(f'./data/{pano_id}/values_y.txt', 'w') as f:
        for el in green_pixels_by_x:
            f.write(str(el)  + '\n')
    with open('./data/img_percents.txt', 'w') as f:
        f.write(f"{str(sky_px_percent)},{str(green_px_percent)},{str(street_px_percent)}")

    # polar_figure = plt.plot(theta_axis_shifted, green_pixels_by_x)qq
    fig, ax = plt.subplots(subplot_kw={'projection': 'polar'})
    ax.plot(theta_axis_shifted, green_pixels_by_x)

    img = fig2img(fig1)
    # img.show()
    # img.save(f'./greenery_mapping/client/src/assets/figures/{img_name}.png')
    img.save(f'./data/{pano_id}/pano_figures.png')
    
    # plt.show()
    # exit
    # cv2.destroyAllWindows()
    # cv2.waitKey(0)
    print('finished')

    