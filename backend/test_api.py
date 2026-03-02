import requests

# Test /rule-predict/
url = "http://localhost:8000/rule-predict/"
data = {
    "numerical_ability": 80,
    "clerical_ability": 95,
    "interpersonal_skills_test": 80,
    "mechanical_ability": 70,
    "st_lr": 90,
    "va_et": 85
}
response = requests.post(url, json=data)
print("Rule Predict Response:")
print(response.json())
print()

# Test /predict
url2 = "http://localhost:8000/predict"
data2 = {
    "verbal_ability": 80,
    "numerical_ability": 80,
    "science_test": 80,
    "clerical_ability": 95,
    "interpersonal_skills_test": 80,
    "logical_reasoning": 80,
    "entrepreneurship_test": 90,
    "mechanical_ability": 70
}
response2 = requests.post(url2, json=data2)
print("Predict Response:")
print(response2.json())
print()

# Test /recompute-predictions
url3 = "http://localhost:8000/recompute-predictions"
response3 = requests.post(url3)
print("Recompute Predictions Response:")
print(response3.json())
print()

# Test /predictions
url4 = "http://localhost:8000/predictions"
response4 = requests.get(url4)
print("Predictions Response:")
print(response4.json())

