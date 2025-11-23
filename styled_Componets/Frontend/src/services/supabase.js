import { createClient } from "@supabase/supabase-js";
export const  supabaseUrl = "https://eeznytuylkihrxqwcvaz.supabase.co";
// For Create React App, use REACT_APP_SUPABASE_KEY
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlem55dHV5bGtpaHJ4cXdjdmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDMzNDEsImV4cCI6MjA2OTk3OTM0MX0.-uWgPFRfJhDEFoMQSo1yu_CanrCAUrbbx0pwefBaZhY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
