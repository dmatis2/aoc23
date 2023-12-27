import networkx as nx

G = nx.Graph()
with open('input.txt') as f:
    for line in f:
        [src, dests] = line.strip().split(': ')
        dests = dests.split(' ')
        for node in dests:
            G.add_edge(src, node)

G.remove_edges_from(nx.minimum_edge_cut(G))
first, second = nx.connected_components(G)

print(len(first) * len(second))