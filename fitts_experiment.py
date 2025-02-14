import json
import glob
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load all JSON files from the 'data' folder
json_files = glob.glob("data/*.json")

# Read data from all files and combine into a single DataFrame
data_list = []
for file in json_files:
    with open(file, "r") as f:
        data_list.extend(json.load(f))

df = pd.DataFrame(data_list)

# Create scatter plots
sns.set(style="whitegrid")

plt.figure(figsize=(12, 5))

# Cursor Distance vs Time Taken
plt.subplot(1, 2, 1)
sns.regplot(x=df["cursorDistance"], y=df["timeTaken"])
plt.xlabel("Cursor Distance")
plt.ylabel("Time Taken (ms)")
plt.title("Cursor Distance vs Time Taken")

# Target Size vs Time Taken
plt.subplot(1, 2, 2)
sns.regplot(x=df["targetSize"], y=df["timeTaken"])
plt.xlabel("Target Size")
plt.ylabel("Time Taken (ms)")
plt.title("Target Size vs Time Taken")

plt.tight_layout()
plt.show()
