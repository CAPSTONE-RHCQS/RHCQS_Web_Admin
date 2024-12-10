export interface CreateDesignRequest {
  name: string;
  houseDesignDrawingId: string;
  fileUrl: string;
  relatedDrawingId: string | null;
  previousDrawingId: string | null;
}
