from flask import Flask, request, render_template
from flask_cors import CORS
from PIL import Image
import numpy as np
from utils import get_prediction
import json
import os
# os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

app = Flask(__name__)
CORS(app)

@app.route("/",methods=["GET","POST"])
def predict():
    if request.method == "POST":
        img = request.files.get("img")
        if img is None:
            return json.dumps({"error":"No Image Found"})
        try:
            img = Image.open(img)
            img_arr = np.array(img)[:,:,::-1]
            res= get_prediction(img_arr)
            return json.dumps(res)
        except Exception as e:
            return json.dumps({"error":str(e)})
    return "App Running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
