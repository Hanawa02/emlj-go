export class Rent {
  constructor(
    public studentId: string,
    public studentName: string,
    public rentItem: string,
    public rentDate: string,
    public returnDate?: string,
    public comment?: string
  ) {}
}
