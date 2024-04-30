export type ReturnDataAsset = {
  public_id: string;
  resource_type: string;
  type: string;
  format: string;
  version: number;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  duration: number | null;
  tags: string[];
  metadata: object;
  created_at: string;
  access_mode: string;
  access_control: string[];
  created_by: object;
  uploaded_by: object;
  folder_id?: string;
  id?: string;
  folder?: string;
};

export type InsertReturnData = {
  assets: ReturnDataAsset[];
  m1Id: string;
};
