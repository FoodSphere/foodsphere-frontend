export interface ServiceRequest {
  id: string;
  create_time: string;
  update_time: string | null;
  reason: string;
  status: number;
}

export interface UpdateServiceRequestStatus {
  status: string;
}

export interface CreatedServiceRequestFromSignalR {
  id: string;
  create_time: string;
  update_time: string | null;
  reason: string;
  status: number;
}

export interface UpdatedServiceRequestFromSignalR {
  resource: {
    billId: string;
    id: string;
  };
  status: number;
}
