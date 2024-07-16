import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# Generate synthetic data with noise
np.random.seed(42)
X = np.linspace(0, 10, 100).reshape(-1, 1)
y = 2 * X + 1 + np.random.normal(0, 1, size=X.shape) # Add Gaussian noise

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict on the test set
y_pred_mean = model.predict(X_test)

# Assume homoscedastic noise: Constant variance across all inputs
residuals = y_test - y_pred_mean
aleatoric_uncertainty = np.std(residuals)

print(f"Estimated Aleatoric Uncertainty (std): {aleatoric_uncertainty:.2f}")

# Estimate Epistemic Uncertainty

n_bootstraps = 100
bootstrapped_predictions = []

for _ in range(n_bootstraps):
  # Sample with replacement
  bootstrap_indices = np.random.choice(len(X_train), len(X_train), replace=True)
  X_bootstrap = X_train[bootstrap_indices]
  y_bootstrap = y_train[bootstrap_indices]
  
  # Train a new model on the bootstrapped data
  bootstrap_model = LinearRegression()
  bootstrap_model.fit(X_bootstrap, y_bootstrap)
  
  # Predict on the test set
  y_pred_bootstrap = bootstrap_model.predict(X_test)
  bootstrapped_predictions.append(y_pred_bootstrap)

# Calculate the variance of predictions for each test point
epistemic_uncertainty = np.std(bootstrapped_predictions, axis=0)



#Visualize Predictions and Uncertainties
# Sort for better visualization
sort_idx = np.argsort(X_test.flatten())
X_test_sorted = X_test[sort_idx]
y_pred_mean_sorted = y_pred_mean[sort_idx]
aleatoric_uncertainty_sorted = np.repeat(aleatoric_uncertainty, len(X_test))[sort_idx]
epistemic_uncertainty_sorted = epistemic_uncertainty[sort_idx]

# Plot the results
plt.figure(figsize=(10, 6))
plt.scatter(X_test, y_test, label="Test Data", alpha=0.5)
plt.plot(X_test_sorted, y_pred_mean_sorted, color='red', label="Predicted Mean")
plt.fill_between(X_test_sorted.flatten(), 
                 (y_pred_mean_sorted - aleatoric_uncertainty_sorted).flatten(), 
                 (y_pred_mean_sorted + aleatoric_uncertainty_sorted).flatten(), 
                 color='orange', alpha=0.3, label="Aleatoric Uncertainty")
plt.fill_between(X_test_sorted.flatten(), 
                 (y_pred_mean_sorted - epistemic_uncertainty_sorted).flatten(), 
                 (y_pred_mean_sorted + epistemic_uncertainty_sorted).flatten(), 
                 color='blue', alpha=0.3, label="Epistemic Uncertainty")
plt.legend()
plt.xlabel("X")
plt.ylabel("y")
plt.title("Linear Regression with Aleatoric and Epistemic Uncertainties")
plt.show()