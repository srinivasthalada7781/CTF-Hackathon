import subprocess
import time
import requests
import pefile

# Create a dummy PE file for testing
def create_dummy_pe(filename):
    # This is not a real PE file, just enough to not crash our basic extractor
    with open(filename, 'wb') as f:
        f.write(b'MZ\x00\x00' + b'\x00' * 56 + b'\x80\x00\x00\x00')
        f.write(b'PE\x00\x00')
        # adding some padding
        f.write(b'\x00' * 1024)

print("Starting FastAPI server...")
server = subprocess.Popen(["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"])

try:
    # Wait for server to start
    time.sleep(3)
    
    # Test health endpoint
    print("Testing /health...")
    r = requests.get("http://localhost:8000/health")
    print(r.json())
    
    # Run the trainer script to generate the model
    print("Running trainer to build model...")
    subprocess.run(["python", "trainer.py"], check=True)
    
    # Give the server a moment, though we might need to restart it to load the model
    print("Restarting server to load model...")
    server.terminate()
    server.wait()
    
    server = subprocess.Popen(["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"])
    time.sleep(3)
    
    print("Testing /health again...")
    r = requests.get("http://localhost:8000/health")
    print(r.json())
    """
    create_dummy_pe("dummy.exe")
    print("Testing /scan...")
    with open("dummy.exe", "rb") as f:
        r = requests.post("http://localhost:8000/scan", files={"file": f})
    print(r.json())
    """
finally:
    print("Terminating server...")
    server.terminate()
    server.wait()
