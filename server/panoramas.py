import time
import requests
from PIL import Image
from io import BytesIO
import numpy as np

zoom_0_tiles = [(0, 0)]
zoom_1_tiles = [(0, 0), (1, 0)]
zoom_2_tiles = [(0, 0), (1, 0), (2, 0), (3, 0), (0, 1), (1, 1), (2, 1), (3, 1)]
zoom_3_tiles = [(0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0),
                (0, 1), (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1),
                (0, 2), (1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2),
                (0, 3), (1, 3), (2, 3), (3, 3), (4, 3), (5, 3), (6, 3)]

def download_streetview_panorama(panoid='', zoom=0):
    tile_width = 512
    tile_height = 512

    if zoom == 0:
        panorama = Image.new('RGB', (512 * (zoom_0_tiles[-1][0] + 1), 512 * (zoom_0_tiles[-1][1] + 1))) 
        
        for x, y in zoom_0_tiles: 
            tile_img = download_tile(panoid=panoid, zoom=zoom, x=x, y=y)
            panorama.paste(im=tile_img, box=(tile_width * x, tile_height * y))

        cropped_pano = panorama.crop((0, 0, 416, 208))
    elif zoom == 1:
        panorama = Image.new('RGB', (512 * (zoom_1_tiles[-1][0] + 1), 512 * (zoom_1_tiles[-1][1] + 1)))
        
        for x, y in zoom_1_tiles: 
            tile_img = download_tile(panoid=panoid, zoom=zoom, x=x, y=y)
            panorama.paste(im=tile_img, box=(tile_width * x, tile_height * y))

        cropped_pano = panorama.crop((0, 0, 832, 416))
    elif zoom == 2:
        panorama = Image.new('RGB', (512 * (zoom_2_tiles[-1][0] + 1), 512 * (zoom_2_tiles[-1][1] + 1)))
        
        for x, y in zoom_2_tiles: 
            tile_img = download_tile(panoid=panoid, zoom=zoom, x=x, y=y)
            panorama.paste(im=tile_img, box=(tile_width * x, tile_height * y))

        cropped_pano = panorama.crop((0, 0, 1664, 832))
    elif zoom == 3:
        panorama = Image.new('RGB', (512 * (zoom_3_tiles[-1][0] + 1), 512 * (zoom_3_tiles[-1][1] + 1)))
        
        for x, y in zoom_3_tiles: 
            tile_img = download_tile(panoid=panoid, zoom=zoom, x=x, y=y)
            panorama.paste(im=tile_img, box=(tile_width * x, tile_height * y))

        cropped_pano = panorama.crop((0, 0, 1664 * 2, 832 * 2))
    else:
        raise Exception('Zoom value provided is not valid.')

    return np.array(cropped_pano)

def download_tile(panoid='', zoom=0, x=0, y=0):
    url = f"https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid={panoid}&output=tile&x={x}&y={y}&zoom={zoom}&nbt=1&fover=2"
    while True:
        try:
            response = requests.get(url, stream=True)
            break
        except requests.ConnectionError:
            print("Connection error. Trying again in 2 seconds.")
            time.sleep(2)
    tile_img = Image.open(BytesIO(response.content))

    return tile_img