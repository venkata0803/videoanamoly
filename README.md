# Video Anomaly Detection

A deep learning-based video classification application that analyzes uploaded videos and classifies them as either **Anomaly** or **Normal**.

The project uses a Flask web application for video upload and prediction, OpenCV and NumPy for video preprocessing, and a custom Keras 3D CNN architecture that combines RGB video information with optical-flow features.

## Overview

The system processes a video through the following pipeline:

```text
Input Video
    ↓
Video Frame Extraction
    ↓
Resize Frames to 224 × 224
    ↓
RGB + Optical Flow Extraction
    ↓
Video Preprocessing
    ↓
Uniform Sampling to 64 Frames
    ↓
3D CNN
    ├── RGB Branch
    └── Optical Flow Branch
            ↓
       Feature Fusion
            ↓
      Fully Connected Layers
            ↓
       Softmax Classifier
            ↓
     Anomaly / Normal
```

## Features

- Upload videos through a Flask web interface
- Store uploaded videos in an `uploads` directory
- Extract RGB frames from videos
- Calculate dense optical flow using the Farneback algorithm
- Combine RGB and optical-flow information into a 5-channel representation
- Uniformly sample videos to 64 frames
- Apply normalization and video augmentation
- Classify videos using a 3D CNN
- Display the prediction as `Anomaly` or `Normal`

## Technology Stack

### Backend

- Python
- Flask

### Deep Learning

- TensorFlow / Keras
- 3D Convolutional Neural Network
- Conv3D
- MaxPooling3D
- Dense layers
- Dropout
- Softmax classification

### Video Processing

- OpenCV
- NumPy

## Model Architecture

The model accepts an input tensor with the shape:

```text
(64, 224, 224, 5)
```

The five channels contain:

```text
3 RGB channels + 2 Optical Flow channels
```

The input is divided into two separate branches.

### RGB Branch

The first three channels are processed using multiple 3D convolution and pooling layers.

```text
RGB Input
   ↓
Conv3D
   ↓
Conv3D
   ↓
MaxPooling3D
   ↓
Conv3D
   ↓
Conv3D
   ↓
MaxPooling3D
   ↓
Conv3D
   ↓
Conv3D
   ↓
MaxPooling3D
   ↓
Conv3D
   ↓
Conv3D
   ↓
MaxPooling3D
```

### Optical Flow Branch

The final two channels are processed through a separate series of 3D convolution and pooling layers.

```text
Optical Flow Input
       ↓
    Conv3D
       ↓
    Conv3D
       ↓
 MaxPooling3D
       ↓
    Conv3D
       ↓
    Conv3D
       ↓
 MaxPooling3D
       ↓
    Conv3D
       ↓
    Conv3D
       ↓
 MaxPooling3D
       ↓
    Conv3D
       ↓
    Conv3D
       ↓
 MaxPooling3D
```

### Feature Fusion

The RGB and optical-flow features are combined using element-wise multiplication.

```text
RGB Features ─────┐
                  ├── Multiply → MaxPooling3D
Optical Flow ─────┘
```

Additional 3D convolution and pooling layers are then applied to the fused features.

The final classification layers are:

```text
Flatten
   ↓
Dense(128, ReLU)
   ↓
Dropout(0.2)
   ↓
Dense(32, ReLU)
   ↓
Dense(2, Softmax)
```

The prediction is converted into:

```text
0 → Anomaly
1 → Normal
```

## Video Preprocessing

### Frame Extraction

Videos are read using OpenCV. Each frame is resized to:

```text
224 × 224
```

Frames are converted from BGR to RGB.

### Optical Flow

Dense optical flow is calculated between consecutive frames using OpenCV's Farneback optical-flow method.

The horizontal and vertical optical-flow components are:

- Mean-adjusted to reduce camera movement effects
- Normalized
- Combined with the RGB channels

The resulting representation is:

```text
[R, G, B, Flow-X, Flow-Y]
```

### Uniform Sampling

The input video is uniformly sampled to:

```text
64 frames
```

Padding is applied when the sampled video contains fewer than the target number of frames.

### Data Augmentation

The preprocessing pipeline includes:

- Random horizontal flipping
- Color jittering
- Normalization

Color jittering modifies the saturation and value components of the video frames.

## Prediction Pipeline

The prediction process is implemented in `predictmodel.py`.

When a video is submitted:

1. The trained model weights are loaded from `keras_model.h5`.
2. The uploaded video is converted into the RGB + optical-flow representation.
3. The video is uniformly sampled to 64 frames.
4. Color jittering is applied.
5. Random horizontal flipping is applied.
6. RGB and optical-flow features are normalized.
7. The processed video is passed to the trained model.
8. The class with the highest prediction score is selected.
9. The result is returned as `Anomaly` or `Normal`.

## Flask Application

The Flask application provides the web interface and prediction endpoints.

### Routes

| Route | Method | Description |
|---|---|---|
| `/` | GET | Displays the main page |
| `/upload` | POST | Uploads a video |
| `/uploads/<filename>` | GET | Serves an uploaded video |
| `/predict` | POST | Runs the model and returns the prediction |

## Project Structure

```text
Video-Anomaly-Detection/
│
├── app.py
├── model.py
├── predictmodel.py
├── videoTransforms.py
├── keras_model.h5
│
├── templates/
│   ├── index.html
│   └── play_video.html
│
├── uploads/
│
├── requirements.txt
├── .gitignore
└── README.md
```

## File Description

### `app.py`

Contains the Flask application, video upload functionality, uploaded-video serving route, and prediction endpoint.

### `videoTransforms.py`

Contains video conversion and preprocessing functions:

- `getOpticalFlow()`
- `Video2Npy()`
- `normalize()`
- `random_flip()`
- `uniform_sampling()`
- `color_jitter()`

### `predictmodel.py`

Loads the trained model weights, preprocesses an uploaded video, performs inference, and returns the final classification.

### `model.py`

Defines the Keras 3D CNN architecture with separate RGB and optical-flow branches, feature fusion, and the final two-class classifier.

### `keras_model.h5`

Contains the trained model weights used during prediction.

## Installation

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd <your-project-folder>
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### 3. Install Dependencies

If `requirements.txt` is available:

```bash
pip install -r requirements.txt
```

The project requires Python packages for Flask, TensorFlow/Keras, OpenCV, and NumPy.

## Running the Application

Start the Flask application:

```bash
python app.py
```

The Flask development server will start and provide a local URL that can be opened in a web browser.

## Using the Application

1. Open the application in a browser.
2. Upload a video.
3. The video is saved in the `uploads` directory.
4. The uploaded video can be displayed through the web interface.
5. Run the prediction.
6. The video is processed using RGB and optical-flow features.
7. The trained model generates the final classification.
8. The result is displayed as either `Anomaly` or `Normal`.

## Input and Output

### Input

A video uploaded through the Flask web interface.

### Output

One of the following classifications:

```text
Anomaly
```

or

```text
Normal
```

## Important Notes

- `keras_model.h5` must be available for prediction.
- The model expects input with 64 frames, a resolution of 224 × 224, and 5 channels.
- Uploaded videos are stored in the `uploads` directory.
- The current Flask application runs in debug mode for development.
- Production deployment should use an appropriate production server and secure file-upload configuration.

## Limitations

- The project currently performs binary classification into `Anomaly` and `Normal`.
- Prediction depends on the availability of the trained `keras_model.h5` weights.
- The application is configured as a development Flask application.
- Dataset details and model performance metrics are not included in this repository documentation.

## Future Improvements

Possible improvements include:

- Add model accuracy and evaluation metrics
- Add support for more video formats
- Improve video preprocessing and augmentation
- Add prediction confidence scores
- Add visualization of detected anomalous segments
- Improve production deployment and file-upload security
- Add a dedicated results dashboard

## Author

**Venkata Ganapathi Subramanian V**

**Roll No:** 23f1000054

## License

This project was developed for educational purposes.
