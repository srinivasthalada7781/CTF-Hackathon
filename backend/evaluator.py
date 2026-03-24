import joblib
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_curve, auc
from sklearn.preprocessing import label_binarize
import os

def generate_evaluation_report():
    print("Generating Evaluation Report Visuals...")
    
    # Load model and class names
    model = joblib.load('models/malware_detector.joblib')
    classes = joblib.load('models/class_names.joblib')
    
    # Generate some test data (similar to trainer.py test split)
    from trainer import MalwareTrainer
    trainer = MalwareTrainer()
    X, y = trainer.load_real_data()
    
    # We'll just use a subset for the report visuals
    from sklearn.model_selection import train_test_split
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    y_score = model.predict_proba(X_test)
    y_pred = model.predict(X_test)
    
    os.makedirs('backend/static/reports', exist_ok=True)
    
    # 1. Confusion Matrix Plot
    plt.figure(figsize=(10, 8))
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', xticklabels=classes, yticklabels=classes, cmap='Blues')
    plt.title('Confusion Matrix - S³ Malware Classifier')
    plt.ylabel('Actual Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('static/reports/confusion_matrix.png')
    plt.close()
    
    # 2. ROC Curve
    y_test_bin = label_binarize(y_test, classes=range(len(classes)))
    plt.figure(figsize=(10, 8))
    
    for i in range(len(classes)):
        fpr, tpr, _ = roc_curve(y_test_bin[:, i], y_score[:, i])
        roc_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, lw=2, label=f'{classes[i]} (AUC = {roc_auc:.4f})')
    
    plt.plot([0, 1], [0, 1], 'k--', lw=2)
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) - Multi-Class')
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig('static/reports/roc_curve.png')
    plt.close()
    
    print("Report visuals saved to backend/static/reports/")

if __name__ == "__main__":
    generate_evaluation_report()
