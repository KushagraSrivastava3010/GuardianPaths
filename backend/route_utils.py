import os
import pandas as pd
import networkx as nx

# Go to project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Correct CSV path
ROAD_PATH = os.path.join(BASE_DIR, "data1", "Road_Network_Dataset.csv")

# Safety check (VERY IMPORTANT)
if not os.path.exists(ROAD_PATH):
    raise FileNotFoundError(f"Road network file not found at {ROAD_PATH}")

road_df = pd.read_csv(ROAD_PATH)

# Build graph
G = nx.Graph()

for _, row in road_df.iterrows():
    src = row["src_node"]
    dst = row["dst_node"]
    distance = row["base_distance_meters"]
    safety = row["safety_score"]

    weight = distance * safety
    G.add_edge(src, dst, weight=weight)


def get_safest_route(start, end):
    try:
        path = nx.dijkstra_path(G, start, end, weight="weight")
        risk = nx.dijkstra_path_length(G, start, end, weight="weight")
        return path, round(risk, 3)
    except nx.NetworkXNoPath:
        return None, None
