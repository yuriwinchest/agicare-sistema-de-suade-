
import { supabase } from "@/integrations/supabase/client";
import { OfflineSyncItem } from "../nursing/types";

export const addToOfflineQueue = async (data: Omit<OfflineSyncItem, 'id' | 'created_at' | 'synced'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('offline_sync_queue')
      .insert({
        patient_id: data.patient_id,
        data_type: data.data_type,
        data: data.data,
        timestamp: data.timestamp,
        synced: false
      });

    return !error;
  } catch (error) {
    console.error("Error adding to offline queue:", error);
    return false;
  }
};

export const getOfflineQueue = async (): Promise<OfflineSyncItem[]> => {
  try {
    const { data, error } = await supabase
      .from('offline_sync_queue')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data as OfflineSyncItem[];
  } catch (error) {
    console.error("Error getting offline queue:", error);
    return [];
  }
};

export const markAsSynced = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('offline_sync_queue')
      .update({ synced: true })
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error("Error marking as synced:", error);
    return false;
  }
};
