import librosa
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Assuming you have 9 audio file paths in this list
audio_files = ["recording1.wav", "recording2.wav", ..., "recording9.wav"] 

# Step 1: Feature Extraction

def extract_features(file_path):
    y, sr = librosa.load(file_path)

    # Example features (adjust as needed)
    mfccs = librosa.feature.mfcc(y=y, sr=sr)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    mel = librosa.feature.melspectrogram(y=y, sr=sr)
    
    # Aggregate features
    return np.concatenate([
        np.mean(mfccs, axis=1),
        np.mean(chroma, axis=1),
        np.mean(mel, axis=1),
    ])


features = [extract_features(file) for file in audio_files]

# Step 2: Preprocessing

scaler = StandardScaler()
features = scaler.fit_transform(features)

# Step 3: Clustering (K-Means)

# We know we have 3 speakers
kmeans = KMeans(n_clusters=3, n_init="auto")
labels = kmeans.fit_predict(features)

# Step 4: Results

for i, file in enumerate(audio_files):
    print(f"{file}: Speaker {labels[i]}")