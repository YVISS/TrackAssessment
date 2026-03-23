import requests
body={'bucket':'msa-images','path':'test_uploads/test1.png','data_url':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg=='}
resp=requests.post('http://127.0.0.1:8000/upload_dataurl', json=body, timeout=20)
print('status', resp.status_code)
print(resp.text)
