from flask import Flask, render_template, request, send_from_directory
import os
from predictmodel import predict_from_model
import json

app = Flask(__name__)

# Define the upload directory where videos will be saved
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_video():
    if "video" in request.files:
        video = request.files["video"]
        if video:
            # Save the uploaded video to the UPLOAD_FOLDER
            video.save(os.path.join(app.config['UPLOAD_FOLDER'], video.filename))
            return render_template("play_video.html", video_filename=video.filename)
    return "Video upload failed."

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    # Serve uploaded videos from the UPLOAD_FOLDER
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/predict", methods=["POST"])
def predict():
    filename = request.json['filename']
    out = predict_from_model(filename)
    res = {
        'output': out
    }
    print(res)
    return json.dumps(res)

if __name__ == "__main__":
    # Create the UPLOAD_FOLDER directory if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)