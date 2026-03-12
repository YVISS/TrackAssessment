class StubModel:
    """Simple stub model implementing predict and predict_proba.

    - `predict(X)` returns 0 for every sample.
    - `predict_proba(X)` returns [[1.0, 0.0]] for each sample.
    """
    def predict(self, X):
        return [0 for _ in X]

    def predict_proba(self, X):
        return [[1.0, 0.0] for _ in X]
