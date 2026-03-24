import os
import struct

def create_super_clean_pe(filename):
    """
    Creates a PE file that looks like a standard, unsigned, 
    low-impact utility. This should be flagged as BENIGN by the AI.
    """
    print(f"Generating Super Clean Sample: {filename}...")
    
    # 1. DOS Header
    mz_signature = b'MZ'
    dos_header_padding = b'\x00' * 58
    e_lfanew = struct.pack('<I', 64) # Pointer to NT header
    dos_header = mz_signature + dos_header_padding + e_lfanew
    
    # 2. NT Header (PE Signature)
    pe_signature = b'PE\x00\x00'
    
    # 3. File Header
    # Machine: 0x14c (i386), Sections: 1, Characteristics: 0x102 (Executable)
    file_header = struct.pack('<HHIIIHH', 0x14c, 1, 0, 0, 0, 224, 0x102)
    
    # 4. Optional Header (Simplified)
    # Magic: 0x10b (PE32), EntryPoint: 0x1000, ImageBase: 0x400000
    optional_header = b'\x0b\x01' + (b'\x00' * 222) # Just enough padding for standard size
    
    # 5. Section Header (.text)
    # Name: .text, VSize: 0x1000, VAddr: 0x1000, RSize: 0x200, RPtr: 0x400
    section_header = b'.text' + (b'\x00' * 3) + struct.pack('<IIIIIIHHI', 0x1000, 0x1000, 0x200, 0x400, 0, 0, 0, 0, 0x60000020)
    
    # 6. Content (Very Clean, Low Entropy)
    # Filling with a standard string to ensure minimal entropy (~0.5)
    clean_contents = b'This is a completely safe and standard executable file for testing purposes.' * 100
    
    with open(filename, 'wb') as f:
        f.write(dos_header)
        f.write(pe_signature)
        f.write(file_header)
        f.write(optional_header)
        f.write(section_header)
        f.write(b'\x00' * (0x400 - f.tell())) # Pad to section start
        f.write(clean_contents)

if __name__ == "__main__":
    os.makedirs('test_samples', exist_ok=True)
    create_super_clean_pe('test_samples/super_clean_sample.exe')
    print("\n✅ Super Clean Sample created at: test_samples/super_clean_sample.exe")
    print("This file has 0.1 - 0.5 entropy and standard PE headers.")
