import json
import urllib.request
import time

url = "http://127.0.0.1:8000/analyze"
payload = {"files": {"smoke.py": "import sys\n\nprint('smoke test')\n"}}

def try_post(retries=6, delay=0.5):
    data = json.dumps(payload).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    for i in range(retries):
        try:
            req = urllib.request.Request(url, data=data, headers=headers)
            with urllib.request.urlopen(req, timeout=5) as resp:
                text = resp.read().decode("utf-8")
                print("Response:")
                print(text)
                return 0
        except Exception as e:
            print(f"Attempt {i+1} failed: {e}")
            time.sleep(delay)
    print("All attempts failed.")
    return 1

if __name__ == '__main__':
    raise SystemExit(try_post())

