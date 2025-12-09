# germination_model
GerminationModel – Automated Germination Detection API

---

# 🌱 GerminationNet – Automated Germination Detection API

A lightweight Flask-based inference server for detecting germination in broccoli microgreens using a fine-tuned ResNet18 model.
This repository is designed for **Google Colab deployment**, enabling remote inference via **ngrok** for dashboards, prototypes, and small-scale vertical farming setups.

---

## 🚀 Features

* Pretrained **ResNet18 germination classifier** (binary: germinated / not germinated).
* Easy-to-run **Flask API** with `/predict` and `/health` endpoints.
* Automatic **ngrok tunneling** to expose Colab notebook as a public API.
* Accepts **image URLs** from S3, Supabase, or any public storage.
* Returns probability & classification decision.

---

## 📁 Repository Structure


---

## ⚙️ Requirements

Install dependencies inside your Colab notebook:

```bash
!pip install flask flask-cors pyngrok requests pillow torch torchvision
```

---

## ▶️ Running the Server in Google Colab

### 1. Upload your model to Google Drive

Update the path in the script:

```python
MODEL_PATH = "/content/drive/MyDrive/germination_project/germination_resnet18.pth"
```

### 2. Add your ngrok token

```python
ngrok.set_auth_token("YOUR_NGROK_TOKEN_HERE")
```

### 3. Run the server

Execute the full script in **germination-net-server.py**.
You will receive a public URL:

```
🚀 GerminationNet API is running!
📡 Public URL: https://xxxx.ngrok-free.app
🔗 Use this endpoint: https://xxxx.ngrok-free.app/predict
```



## 🧠 Model Details

* Backbone: **ResNet18**
* Output: Single sigmoid neuron → probability of germination
* Input size: **224×224 RGB**
* Normalization: ImageNet mean/std



## 🛠️ Customization

To retrain or fine-tune the model, modify the `GerminationNet` class:

```python
class GerminationNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = models.resnet18(weights=None)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, 1)
```


## 🏗️ Deployment Notes

* ngrok URLs rotate unless you use a paid static domain.
* The API is suitable for dashboards built on **Vercel + Supabase**, sending image URLs directly.
* Ideal for research, prototypes, and educational purposes.

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome!
Typical areas to improve:

* Batch inference
* Dockerized API
* Model retraining notebooks

---

## 📜 License

MIT License – free to use for academic and commercial projects.
