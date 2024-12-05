import requestWebRHCQS from '../../utils/axios';

export interface ConstructionItem {
  ConstructionId: string;
  ConstructionName: string;
  WorkTemplates: WorkTemplates[];
}

export interface WorkTemplates {
  WorkTemplateId: string;
  ConstructionWorkName: string;
  Weight: number;
  LaborCost: number;
  MaterialCost: number;
  MaterialFinishedCost: number;
  Unit: string;
}

export type ConstructionWorkResponse = ConstructionItem[];

export const uploadConstructionWork = async (
  file: File,
  packageId: string,
): Promise<ConstructionWorkResponse> => {
  const formData = new FormData();
  formData.append('file', file, file.name);

  try {
    const response = await requestWebRHCQS.post<ConstructionWorkResponse>(
      `/worktemplate/excel?packageid=${packageId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading equipment Excel:', error);
    throw error;
  }
};
