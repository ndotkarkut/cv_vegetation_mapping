import numpy as np
import math 

data = np.load(f'./data/f_nFt45Lw_yRMwo4hc9z1g/pano_img_depth.npy')
data = data[0][0]
print(data.shape)

pano_x_dim = 1664

depth_per_x = []

for i in range(int(data.shape[1])):
    all_depths_added = 0
    for j in range(int(data.shape[0] / 2)):
        all_depths_added += data[j][i]

    avg_distance_away = all_depths_added / int(data.shape[0] / 2)
    depth_per_x.append(avg_distance_away)

print(len(depth_per_x), max(depth_per_x) + 5)

max_distance = max(depth_per_x) + 5
min_distance = 0

pano_adjusted_depth_arr = np.zeros(pano_x_dim)

past_x = 0
for depth_x_loc in range(len(depth_per_x)):
    x_pix_loc = math.floor(pano_x_dim / data.shape[1] * depth_x_loc)
    pano_adjusted_depth_arr[x_pix_loc] = depth_per_x[depth_x_loc]
    for i in range(past_x + 1, x_pix_loc):
        pano_adjusted_depth_arr[i] = depth_per_x[depth_x_loc]
    past_x = x_pix_loc
pano_adjusted_depth_arr[-1] = depth_per_x[-1]



with open(f'./data/f_nFt45Lw_yRMwo4hc9z1g/depth_data.txt', 'w') as f:
    for i in pano_adjusted_depth_arr:
        f.write(f'{i}\n')