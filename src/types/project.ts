export type Quote = {
  id: number;
  version: string;
  createdTime: string;
  creator: string;
  content: string;
  status: string;
};

export type Design = {
  id: number;
  drawing: string;
  createdTime: string;
  executor: string;
  status: string;
};

export type DetailedQuote = {
  id: number;
  version: string;
  createdTime: string;
  creator: string;
  content: string;
};

export type Contract = {
  id: number;
  version: string;
  contractType: string;
  creator: string;
  status: string;
  content: string;
};
