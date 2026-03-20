# import yaml
# print("YAML working 🚀")
from lxml import html
import yaml

# Step 1: Parse HTML
tree = html.parse("index.html")
root = tree.getroot()

IGNORE_TAGS = {"script", "style", "noscript", "br", "button","ul","li","a","p","b","h1","h2","h3","h4","h5","h6"}
IGNORE_ATTRS = {"src"}

def node_to_dict(node):
    if not isinstance(node.tag, str):
        return None
    # ❌ Skip unwanted tags
    if node.tag in IGNORE_TAGS:
        return None

    # ✅ Filter attributes (remove 'src')
    attributes = {
        key: value
        for key, value in node.attrib.items()
        if key not in IGNORE_ATTRS
    }

    result = {
        "tag": node.tag if isinstance(node.tag, str) else "unknown",
        "attributes": attributes,
        "children": []
    }

    # 🔁 Process children
    for child in node:
        child_data = node_to_dict(child)
        if child_data:
            result["children"].append(child_data)

    return result
data = node_to_dict(root)

# Step 3: Save as YAML
with open("output.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True)