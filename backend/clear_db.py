import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Connected to Supabase. Purging old test records from 'scans' table...")
    
    # Supabase Python client requires an equality match to delete many rows unless using filters.
    # We can effectively delete everything by matching where id IS NOT NULL.
    # We will just select all IDs and delete them.
    response = supabase.table("scans").select("id").execute()
    
    deleted_count = 0
    if response.data:
        for row in response.data:
            supabase.table("scans").delete().eq("id", row["id"]).execute()
            deleted_count += 1
            
    print(f"Successfully purged {deleted_count} legacy records from the database.")
else:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in environment.")
