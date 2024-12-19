import requestWebRHCQS from '../../utils/axios';

export async function getTotalProject() {
  try {
    const response = await requestWebRHCQS.get('/project/total-project', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total project:', error);
    throw new Error('Failed to fetch total project');
  }
}

export async function getTotalProjectBySaleStaff(accountId: string) {
  try {
    const response = await requestWebRHCQS.get(
      `/project/total-project-staff?accountId=${accountId}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total project:', error);
    throw new Error('Failed to fetch total project');
  }
}

export async function getTotalPriceByMonth(month: number, year: number) {
  try {
    const response = await requestWebRHCQS.get(
      `/dashboard/totalprice-bymonth?month=${month}&year=${year}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data.totalPrice;
  } catch (error) {
    console.error('Error fetching total price by month:', error);
    throw new Error('Failed to fetch total price by month');
  }
}

export async function getTotalPaidPriceByMonth(month: number, year: number) {
  try {
    const response = await requestWebRHCQS.get(
      `/dashboard/totalpaidprice-bymonth?month=${month}&year=${year}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data.totalPrice;
  } catch (error) {
    console.error('Error fetching total paid price by month:', error);
    throw new Error('Failed to fetch total paid price by month');
  }
}

export async function getTotalProgressPriceByMonth(
  month: number,
  year: number,
) {
  try {
    const response = await requestWebRHCQS.get(
      `/dashboard/totalprogressprice-bymonth?month=${month}&year=${year}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data.totalPrice;
  } catch (error) {
    console.error('Error fetching total progress price by month:', error);
    throw new Error('Failed to fetch total progress price by month');
  }
}
