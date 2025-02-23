import os
import json
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

data_dir = r"E:\School Projects\COSC 559\FittsExperiment\data"
files = [f for f in os.listdir(data_dir) if f.endswith(".json")]

all_data = []

for file in files:
    with open(os.path.join(data_dir, file), 'r') as f:
        all_data.extend(json.load(f))

# Calculate Index of Difficulty (ID) and extract Movement Time (MT)
IDs = [np.log2((d["cursorDistance"] / d["targetSize"]) + 1) for d in all_data]
MTs = [d["timeTaken"] for d in all_data]

# Perform linear regression (MT = a + b * ID)
slope, intercept, r_value, _, _ = stats.linregress(IDs, MTs)

# Generate regression line for visualization
ID_range = np.linspace(min(IDs), max(IDs), 100)
predicted_MT = intercept + slope * ID_range

# Plot the data points
plt.scatter(IDs, MTs, color="blue", label="Data Points")
plt.plot(ID_range, predicted_MT, color="red", label=f"Fit: MT={intercept:.2f} + {slope:.2f} * ID")

# Annotate 'a' and 'b' values
plt.text(min(IDs), max(MTs) - (max(MTs) - min(MTs)) * 0.1, 
         f"a = {intercept:.2f}\nb = {slope:.2f}", 
         fontsize=12, color="black", bbox=dict(facecolor='white', alpha=0.6))

# Labels and Titles
plt.xlabel("Index of Difficulty (ID)")
plt.ylabel("Movement Time (MT)")
plt.title("Fitts' Law Experiment")
plt.legend()
plt.grid(True)

# Show Plot
plt.show()

print(f"Slope (b): {slope}, Intercept (a): {intercept}, R²: {r_value**2}")
