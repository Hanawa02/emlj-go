export class ConfirmDialogData {
  constructor(
    public title: string,
    public question: string,
    public textYes: string = 'Sim',
    public textNo: string = 'Não'
  ) {}
}
