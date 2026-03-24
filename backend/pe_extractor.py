import pefile
import math
import re
import hashlib
import numpy as np

class PEFeatureExtractor:
    def __init__(self):
        # Comprehensive API patterns for Competition-Grade Detection
        self.behavior_patterns = {
            'injection': ['VirtualAllocEx', 'WriteProcessMemory', 'CreateRemoteThread', 'NtCreateThreadEx', 'QueueUserAPC'],
            'hollowing': ['NtUnmapViewOfSection', 'VirtualAllocEx', 'SetThreadContext', 'ResumeThread', 'GetThreadContext'],
            'anti_debug': ['IsDebuggerPresent', 'CheckRemoteDebuggerPresent', 'NtQueryInformationProcess', 'OutputDebugStringA', 'FindWindowA'],
            'anti_vm': ['VBoxService.exe', 'vmtoolsd.exe', 'qemu-ga.exe', 'GetSystemFirmwareTable', 'Cpuid'],
            'networking': ['HttpSendRequestA', 'InternetOpenA', 'WSAStartup', 'gethostbyname', 'URLDownloadToFileA', 'WinHttpOpen'],
            'registry': ['RegCreateKeyExA', 'RegSetValueExA', 'RegOpenKeyExA', 'RegDeleteKeyA', 'RegEnumKeyExA'],
            'stealing': ['GetKeyboardState', 'GetClipboardData', 'CryptUnprotectData', 'ReadProcessMemory']
        }
        self.suspicious_apis = [api for sublist in self.behavior_patterns.values() for api in sublist]
        
    def calculate_entropy(self, data):
        if not data:
            return 0
        entropy = 0
        counts = np.bincount(np.frombuffer(data, dtype=np.uint8), minlength=256)
        probs = counts[counts > 0] / len(data)
        return -np.sum(probs * np.log2(probs))

    def extract_features(self, file_path):
        try:
            pe = pefile.PE(file_path)
            with open(file_path, 'rb') as f:
                data = f.read()
        except Exception as e:
            print(f"Error parsing PE file: {e}")
            return None

        features = {}
        
        # 1. Header & Structural Features
        features['num_sections'] = pe.FILE_HEADER.NumberOfSections
        features['entry_point'] = pe.OPTIONAL_HEADER.AddressOfEntryPoint
        features['image_base'] = pe.OPTIONAL_HEADER.ImageBase
        features['total_entropy'] = self.calculate_entropy(data)
        
        # 2. Advanced Import Features
        features['imphash'] = pe.get_imphash()
        imported_dlls = []
        imported_functions = []
        
        found_apis = set()
        if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
            for entry in pe.DIRECTORY_ENTRY_IMPORT:
                imported_dlls.append(entry.dll.decode().lower())
                for imp in entry.imports:
                    if imp.name:
                        func_name = imp.name.decode()
                        imported_functions.append(func_name)
                        found_apis.add(func_name)

        features['num_imported_dlls'] = len(imported_dlls)
        features['num_imported_functions'] = len(imported_functions)
        
        # 3. Behavioral Emulation (Sequence Detection)
        behavior_scores = {}
        for behavior, apis in self.behavior_patterns.items():
            count = sum(1 for api in apis if api in found_apis)
            behavior_scores[f'behavior_{behavior}'] = count
        
        features.update(behavior_scores)
        features['suspicious_api_count'] = sum(1 for api in self.suspicious_apis if api in found_apis)

        # 4. Section Analysis
        section_entropies = [self.calculate_entropy(s.get_data()) for s in pe.sections]
        section_sizes = [s.SizeOfRawData for s in pe.sections]
        features['avg_section_entropy'] = np.mean(section_entropies) if section_entropies else 0
        features['max_section_entropy'] = np.max(section_entropies) if section_entropies else 0
        features['avg_section_size'] = np.mean(section_sizes) if section_sizes else 0

        # 5. String Analysis (Regex patterns for malware indicators)
        features['num_strings'] = len(re.findall(rb'[ -~]{5,}', data))
        features['contains_url'] = 1 if re.search(rb'https?://', data) else 0
        features['contains_ip'] = 1 if re.search(rb'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', data) else 0
        features['contains_shell'] = 1 if re.search(rb'powershell|cmd\.exe|/c\s', data, re.I) else 0
        
        # 6. Digital Signature Check (True/False)
        features['is_signed'] = 1 if hasattr(pe, 'DIRECTORY_ENTRY_SECURITY') else 0

        # Expanded feature order (22 features)
        feature_order = [
            'num_sections', 'entry_point', 'image_base', 'total_entropy', 
            'num_imported_dlls', 'num_imported_functions', 'suspicious_api_count',
            'avg_section_entropy', 'max_section_entropy', 'avg_section_size', 
            'num_strings', 'behavior_injection', 'behavior_hollowing', 
            'behavior_anti_debug', 'behavior_anti_vm', 'behavior_networking', 
            'behavior_registry', 'behavior_stealing',
            'contains_url', 'contains_ip', 'contains_shell', 'is_signed'
        ]
        
        # Note: imphash is used for details/history but skipped in the numeric vector for baseline XGBoost
        # because it's a categorical string. we use behavior scores instead for numeric intelligence.
        
        feature_vector = [features.get(k, 0) for k in feature_order]
        
        return {
            'vector': feature_vector,
            'details': features,
            'pe_info': {
                'sections': [{'sectionName': s.Name.decode().strip('\x00'), 'entropy': self.calculate_entropy(s.get_data()), 'size': s.SizeOfRawData} for s in pe.sections],
                'imports': [entry.dll.decode() for entry in pe.DIRECTORY_ENTRY_IMPORT] if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT') else [],
                'imphash': features['imphash'],
                'is_signed': bool(features['is_signed'])
            }
        }

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        extractor = PEFeatureExtractor()
        results = extractor.extract_features(sys.argv[1])
        print(results)
