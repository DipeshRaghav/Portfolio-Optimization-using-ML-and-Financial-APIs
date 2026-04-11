import joblib
from models.ml_model import load_all_data, create_features, train_model


def train_and_save():
    print("Loading data...")
    data = load_all_data()

    print("Creating features...")
    X, y, _ = create_features(data)

    print("Training model...")
    model = train_model(X, y)

    print("Saving model...")
    joblib.dump(model, "portfolio/model.pkl")

    print("Model saved successfully!")

if __name__ == "__main__":
    train_and_save()