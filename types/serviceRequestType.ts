export interface ServiceRequest {
  id: string;
  create_time: string;
  update_time: string | null;
  bill_id: string;
  table: {
    id: number;
    name: string;
  };
  reason: string;
  status: number;
}

export interface UpdateServiceRequestStatus {
  status: string;
}

export interface CreatedServiceRequestFromSignalR extends ServiceRequest {}

export interface UpdatedServiceRequestFromSignalR {
  resource: {
    billId: string;
    id: string;
  };
  status: number;
}
