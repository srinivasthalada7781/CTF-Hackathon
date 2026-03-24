import time
import requests

def test_api():
    base_url = "http://localhost:8000"
    
    print("Testing /health...")
    try:
        r = requests.get(f"{base_url}/health")
        print(r.json())
    except Exception as e:
        print(f"Health check failed: {e}")
        return

    print("\nCreating dummy file...")
    # Create a dummy PE file for testing
    with open("dummy.exe", 'wb') as f:
        f.write(b'MZ\x00\x00' + b'\x00' * 56 + b'\x80\x00\x00\x00')
        f.write(b'PE\x00\x00')
        f.write(b'\x00' * 1024)

    print("Testing /scan...")
    try:
        with open("dummy.exe", "rb") as f:
            r = requests.post(f"{base_url}/scan", files={"file": f})
        print(r.json())
    except Exception as e:
        print(f"Scan failed: {e}")

if __name__ == "__main__":
    test_api()
