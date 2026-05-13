export interface SellerDashboardStatusCount {
  status: string;
  count: number;
}

export interface ISellerDashboardStatsPayload {
  auctions: {
    total: number;
    byStatus: SellerDashboardStatusCount[];
    liveListingsCount: number;
  };
  payments: {
    total: number;
    byStatus: SellerDashboardStatusCount[];
    completedAmountSum: number;
  };
}
