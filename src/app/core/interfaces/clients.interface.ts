/** Client Model */
export interface AddClientDto {
  address?: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface ClientModel extends AddClientDto {
  id: string;
}

