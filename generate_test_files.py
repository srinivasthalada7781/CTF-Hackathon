import os
import struct
import numpy as np

def create_pe_file(filename, entropy_level='low'):
    """
    Creates a valid-looking (but non-functional) PE header structure 
    to test the pe_extractor.py logic.
    """
    print(f"Generating {filename} ({entropy_level} entropy)...")
    
    # DOS Header (64 bytes)
    dos_header = b'MZ' + (b'\x00' * 58) + struct.pack('<I', 64)
    
    # PE Header (4 bytes + 20 bytes + 96 bytes optional)
    nt_header = b'PE\x00\x00'
    file_header = struct.pack('<HHIIIHH', 
        0x14c, # i386
        1,     # 1 section
        0, 0, 0, 
        96,    # size of optional header
        0x102  # characteristics
    )
    
    # Data for entropy
    if entropy_level == 'high':
        # Random data has high entropy (~7.8+)
        data = os.urandom(1024 * 10)
    else:
        # Repeating data has low entropy (~0.1+)
        data = b'BENIGN_CODE_DATA' * 1000
        
    with open(filename, 'wb') as f:
        f.write(dos_header)
        f.write(nt_header)
        f.write(file_header)
        f.write(data)

if __name__ == "__main__":
    os.makedirs('test_samples', exist_ok=True)
    create_pe_file('test_samples/benign_sample.exe', 'low')
    create_pe_file('test_samples/suspicious_sample.exe', 'high')
    print("\n✅ Test samples created in sentinel-ai-main/test_samples/")
    print("1. benign_sample.exe (Should be detected as Benign)")
    print("2. suspicious_sample.exe (Should be detected as Malicious due to high entropy)")
